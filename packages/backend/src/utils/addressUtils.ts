/** @format */

import * as crypto from '../utils/crypto';
import * as bech32 from 'bech32';
const bs58check = require('bs58check');
import * as ecc from 'tiny-secp256k1';
const randomBytes = require('randombytes');

/**
 * generate Segregated Witness Pay-to-PubKeyHash address from public key
 * @param pubkey public key
 */
export function getP2wpkhAddress(pubkey: Buffer): string {
    const hash = crypto.hash160(pubkey);
    const words = bech32.toWords(hash);
    words.unshift(0x00);
    return bech32.encode('bc', words);
}

/**
 * generate legacy Pay-to-PubKeyHash address from public key
 * @param pubkey public key
 */
export function getP2PKHAddress(pubkey: Buffer): string {
    const hash = crypto.hash160(pubkey);
    const payload: Buffer = Buffer.allocUnsafe(21);
    const pubKeyHash = 0x00;
    payload.writeUInt8(pubKeyHash, 0);
    hash.copy(payload, 1);
    return bs58check.encode(payload);
}

/**
 * generate public key from private key
 * @param privateKey
 */
export function getPublicKey(privateKey: Buffer): Buffer {
    const publicKey = ecc.pointFromScalar(privateKey, true);
    return publicKey as Buffer;
}

/**
 * Generate a random Seed
 */
export function generateSeed(): string {
    const strength = 512;
    const seed = randomBytes(strength / 8);
    return seed.toString('hex');
}
