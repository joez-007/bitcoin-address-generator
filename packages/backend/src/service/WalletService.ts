/** @format */

import * as addressUtils from '../utils/addressUtils';
import * as hd from '../utils/hdUtils';
import {Script} from '../utils/Script';
import {hash160} from '../utils/cryptoUtils';

const {base58} = require('bstring');

/**
 * Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path
 * @param seed the seed to generate master key
 * @param path the path of child, it follows BIP32
 */
function generateSegWitHDWalletAddress(seed: string, path: string): string | undefined {
    const bSeed: Buffer = Buffer.from(seed, 'hex');
    const keys = hd.derivePath(path, bSeed);
    if (keys.privateKey) {
        const publicKey = addressUtils.getPublicKey(keys.privateKey);
        let address = addressUtils.getP2wpkhAddress(publicKey);
        return address;
    } else throw new Error('generate hdkey error');
}

/**
 * Generate a multi signature address
 * @param pubkeys the public keys of all the participants
 * @param m the amount of signatures required to release the coins
 */
function generateMultiSigP2SHAddress(pubkeys: string[], m: number): string | undefined {
    const bpubkeys = pubkeys.map(skey => Buffer.from(skey, 'hex'));
    let s: Script = new Script();
    let mHash = hash160(s.getMultisigHash(m, bpubkeys));
    let raw = addressUtils.toRaw(mHash, addressUtils.mainAddressPrefix.scripthash);
    let address = base58.encode(raw);
    return address;
}

/**
 * Generate a random Seed
 */
function generateSeed(): string {
    return addressUtils.generateSeed();
}

export {generateSeed, generateSegWitHDWalletAddress, generateMultiSigP2SHAddress};
