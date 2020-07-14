/** @format */

import * as crypto from './cryptoUtils';
import {InvalidParameterError} from '../types';
import * as addressUtils from './addressUtils';

const secp256k1 = require('secp256k1');

/**
 * Keys type of privateKey, chainCode, publicKey
 */
type Keys = {
    privateKey: Buffer | undefined;
    chainCode: Buffer;
    publicKey: Buffer | undefined;
};

const HARDENED_OFFSET = 0x80000000;

/**
 * Generate master keys from a given seed
 * @param seed
 */
function generateMasterKeyFromSeed(seed: Buffer): Keys {
    if (seed.length < 16 || seed.length > 64) throw new TypeError('Seed should be at least 128 bits');

    const I = crypto.hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), seed);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    return {
        privateKey: IL,
        chainCode: IR,
        publicKey: addressUtils.getPublicKey(IL),
    };
}

/**
 * Verify if it is a well derivation path or not
 * @param path derivation path
 */
function isValidPath(path: string): boolean {
    const pathRegex = new RegExp(/^(m\/)?(\d+'?\/)*\d+'?$/);
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split('/')
        .slice(1)
        .map(el => el.replace("'", ''))
        .some(isNaN as any);
}

/**
 * Generate child keys from parent keys
 * @param parentkeys
 * @param index
 */
function generateChildKey(parentKeys: Keys, index: number): Keys {
    var isHardened = index >= HARDENED_OFFSET;
    var indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(index, 0);
    let data;

    if (isHardened) {
        var pk = parentKeys.privateKey as Buffer;
        var zb = Buffer.alloc(1, 0);
        pk = Buffer.concat([zb, pk]);
        data = Buffer.concat([pk, indexBuffer]);
    } else {
        let publicKey = addressUtils.getPublicKey(parentKeys.privateKey as Buffer);
        data = Buffer.concat([publicKey, indexBuffer]);
    }

    const I = crypto.hmacSHA512(parentKeys.chainCode, data);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    let hdKey: Keys = {
        privateKey: undefined,
        chainCode: IR,
        publicKey: undefined,
    };

    if (parentKeys.privateKey) {
        hdKey.privateKey = Buffer.from(secp256k1.privateKeyTweakAdd(parentKeys.privateKey, IL));
        hdKey.publicKey = addressUtils.getPublicKey(hdKey.privateKey);
    } else {
        hdKey.publicKey = Buffer.from(secp256k1.publicKeyTweakAdd(parentKeys.publicKey, IL, true));
    }

    return hdKey;
}

/**
 * Derive child from given path and seed
 * @param path derivation path
 * @param seed
 */
function derivePath(path: string, seed: Buffer): Keys {
    if (!isValidPath(path)) {
        throw new InvalidParameterError('path', `Invalid derivation path : "${path}"`);
    }

    const {privateKey, chainCode, publicKey} = generateMasterKeyFromSeed(seed);
    const segments = path
        .split('/')
        .slice(1)
        .map(el => {
            let index = 0;
            if (el.slice(-1) === `'`) {
                index = parseInt(el.slice(0, -1), 10) + HARDENED_OFFSET;
            } else {
                index = parseInt(el, 10);
            }
            return index;
        });
    //.map(el => parseInt(el, 10));

    return segments.reduce((parentKeys, segment) => generateChildKey(parentKeys, segment), {
        privateKey,
        chainCode,
        publicKey,
    });
}

export {derivePath, generateMasterKeyFromSeed};
