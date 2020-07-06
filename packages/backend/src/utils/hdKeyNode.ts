/** @format */

import * as crypto from './crypto';
import * as ecc from 'tiny-secp256k1';
import * as addressUtils from '../utils/addressUtils';
import {IHDKeyNodeInterface, InvalidParameterError} from '../types';

const HIGHEST_BIT = 0x80000000;

/**
 * refer to BIP 32 to generate HD Wallet
 * https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
 */
class HDKeyNode implements IHDKeyNodeInterface {
    constructor(
        private _privateKey: Buffer | undefined,
        private _chainCode: Buffer,
        private _publicKey: Buffer | undefined
    ) {
        if (!_privateKey && !_publicKey) {
            throw new TypeError('privateKey and publicKey are undefined');
        }
    }

    get publicKey(): Buffer {
        if (this._publicKey === undefined) this._publicKey = addressUtils.getPublicKey(this._privateKey as Buffer);
        return this._publicKey!;
    }

    get privateKey(): Buffer | undefined {
        return this._privateKey;
    }

    get chainCode(): Buffer {
        return this._chainCode;
    }

    derivePath(path: string): IHDKeyNodeInterface {
        const regexp = new RegExp(/^(m\/)?(\d+'?\/)*\d+'?$/);
        if (!regexp.test(path))
            throw new InvalidParameterError(
                'path',
                `Expected BIP32Path like "/m/44'/0'/0'/0" , but got String "${path}"`
            );

        let splitPath = path.split('/');
        if (splitPath[0] === 'm' || splitPath[0] === 'M') {
            splitPath = splitPath.slice(1);
        } else {
            throw new InvalidParameterError('path', 'path must follow BIP32 and start with m');
        }

        return splitPath.reduce((prevNode, indexStr) => {
            let index;
            let node: HDKeyNode;
            if (indexStr.slice(-1) === `'`) {
                index = parseInt(indexStr.slice(0, -1), 10);
                node = prevNode.deriveHardened(index) as HDKeyNode;
            } else {
                index = parseInt(indexStr, 10);
                node = prevNode.derive(index) as HDKeyNode;
            }
            return node;
        }, this as HDKeyNode);
    }

    /**
     * dervie child for current node
     * @param index the index of child
     */
    derive(index: number): IHDKeyNodeInterface {
        const isHardened = index >= HIGHEST_BIT;
        const data = Buffer.allocUnsafe(37);

        // Hardened child
        if (isHardened) {
            if (!this.privateKey) throw new TypeError('Missing private key for hardened child key');

            // data = 0x00 || ser256(kpar) || ser32(index)
            data[0] = 0x00;
            this.privateKey!.copy(data, 1);
            data.writeUInt32BE(index, 33);

            // Normal child
        } else {
            if (!this.publicKey) throw new TypeError('Missing public key for Normal child key');

            // data = serP(point(kpar)) || ser32(index)
            //      = serP(Kpar) || ser32(index)
            this.publicKey.copy(data, 0);
            data.writeUInt32BE(index, 33);
        }

        const I = crypto.hmacSHA512(this.chainCode, data);
        const IL = I.slice(0, 32);
        const IR = I.slice(32);

        // if parse256(IL) >= n, proceed with the next value for i
        if (!ecc.isPrivate(IL)) return this.derive(index + 1);

        // Private parent key -> private child key
        let childNode: IHDKeyNodeInterface;
        if (this.privateKey) {
            // ki = parse256(IL) + kpar (mod n)
            const ki = ecc.privateAdd(this.privateKey, IL);

            // In case ki == 0, proceed with the next value for i
            if (ki == null) return this.derive(index + 1);

            childNode = new HDKeyNode(ki, IR, addressUtils.getPublicKey(ki));
        } /* Public parent key (without private key) -> public child key */ else {
            // Ki = point(parse256(IL)) + Kpar
            //    = G*IL + Kpar
            const Ki = ecc.pointAddScalar(this.publicKey, IL, true);

            // In case Ki is the point at infinity, proceed with the next value for i
            if (Ki === null) return this.derive(index + 1);

            childNode = new HDKeyNode(undefined, IR, Ki);
        }

        return childNode;
    }

    /**
     * when index ≥ 0x80000000, derive dardened child
     * @param index the index of child node
     */
    deriveHardened(index: number): IHDKeyNodeInterface {
        return this.derive(index + HIGHEST_BIT);
    }
}

/**
 * create root node of Hierarchical Deterministic from seed
 * @param seed
 */
export function createHDRootNodeFromSeed(seed: Buffer): IHDKeyNodeInterface {
    if (seed.length < 16) throw new TypeError('Seed should be at least 128 bits');
    if (seed.length > 64) throw new TypeError('Seed should be at most 512 bits');
    //network = network || BITCOIN;

    const I = crypto.hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), seed);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    const privateKey: Buffer = IL;
    const chainCode: Buffer = IR;
    const publicKey = undefined;

    return new HDKeyNode(privateKey, chainCode, publicKey);
}
