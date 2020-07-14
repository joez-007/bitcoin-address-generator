/** @format */

const cryptoHash = require('crypto-hashing');
import {createHmac} from 'crypto';

export function hash160(buffer: Buffer): Buffer {
    let hash = cryptoHash('sha256', buffer);
    return cryptoHash('ripemd160', hash);
}

export function hmacSHA512(key: Buffer, data: Buffer): Buffer {
    return createHmac('sha512', key).update(data).digest();
}
