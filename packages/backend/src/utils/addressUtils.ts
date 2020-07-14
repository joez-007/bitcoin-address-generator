/** @format */

import {hash160} from './cryptoUtils';

const ECKey = require('eckey-util');
const randomBytes = require('randombytes');
const cryptoHash = require('crypto-hashing');
const bio = require('bufio');
const {base58, bech32} = require('bstring');

/**
 * Generate Segregated Witness Pay-to-PubKeyHash address from public key
 * @param pubkey public key
 */
export function getP2wpkhAddress(pubkey: Buffer): string {
    return toBech32(pubkey);
}

/**
 * Generate public key from private key
 * @param privateKey
 */
export function getPublicKey(privateKey: Buffer): Buffer {
    const publicKey = ECKey.getPublicKey(privateKey.toString('hex'));
    return Buffer.from(publicKey, 'hex');
}

/**
 * Generate a random Seed
 */
export function generateSeed(): string {
    const strength = 512;
    const seed = randomBytes(strength / 8);
    return seed.toString('hex');
}

/**
 * Prefixs of main addresses
 */
export const mainAddressPrefix = {
    pubkeyhash: 0x00,
    scripthash: 0x05,
    witnesspubkeyhash: 0x06,
    witnessscripthash: 0x0a,
    bech32: 'bc',
};

export function toRaw(hash: Buffer, prefix: number) {
    const size = 5 + hash.length;
    const bw = bio.write(size);
    bw.writeU8(prefix);
    bw.writeBytes(hash);
    bw.writeChecksum((hash: any) => {
        return cryptoHash('hash256', hash);
    });

    return bw.render();
}

/**
 * Generate Segregated Witness format address from a given public key
 * @param pubKey
 */
function toBech32(pubKey: Buffer): string {
    const scriptVersion = 0;
    let hash = hash160(pubKey);
    const prefix = mainAddressPrefix.bech32;
    return bech32.encode(prefix, scriptVersion, hash);
}
