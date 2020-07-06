/** @format */

import * as crypto from './crypto';
const OPS = require('bitcoin-ops') as {[index: string]: number};
const pushdata = require('pushdata-bitcoin');
const bs58check = require('bs58check');
const OP_INT_BASE = OPS.OP_RESERVED;

/**
 * make sure chunk is buffer
 * @param buf
 */
function singleChunkIsBuffer(buf: number | Buffer): buf is Buffer {
    return Buffer.isBuffer(buf);
}

function asMinimalOP(buffer: Buffer): number | void {
    if (buffer.length === 0) return OPS.OP_0;
    if (buffer.length !== 1) return;
    if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0];
    if (buffer[0] === 0x81) return OPS.OP_1NEGATE;
}

/**
 * compile multi signature script
 * @param chunks
 */
function compile(chunks: Buffer[]): Buffer {
    const bufferSize = chunks.reduce((accum: number, chunk) => {
        // data chunk
        if (singleChunkIsBuffer(chunk)) {
            // adhere to BIP62.3, minimal push policy
            if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
                return accum + 1;
            }

            return accum + pushdata.encodingLength(chunk.length) + chunk.length;
        }

        // opcode
        return accum + 1;
    }, 0.0);

    const buffer = Buffer.allocUnsafe(bufferSize);
    let offset = 0;

    chunks.forEach(chunk => {
        // data chunk
        if (singleChunkIsBuffer(chunk)) {
            // adhere to BIP62.3, minimal push policy
            const opcode = asMinimalOP(chunk);
            if (opcode !== undefined) {
                buffer.writeUInt8(opcode, offset);
                offset += 1;
                return;
            }

            offset += pushdata.encode(buffer, chunk.length, offset);
            chunk.copy(buffer, offset);
            offset += chunk.length;

            // opcode
        } else {
            buffer.writeUInt8(chunk, offset);
            offset += 1;
        }
    });

    if (offset !== buffer.length) throw new Error('Could not decode chunks');
    return buffer;
}

/**
 * create a multi signature address.
 * @param pubkeys  the public keys of all the participants
 * @param m the amount of signatures required to release the coins
 */
export function generateP2SHAddress(pubkeys: Buffer[], m: number): string {
    const n = pubkeys.length;
    if (m > n) m = n;

    const output = compile(([] as any).concat(OP_INT_BASE + m, pubkeys, OP_INT_BASE + n, OPS.OP_CHECKMULTISIG));
    const hash = crypto.hash160(output);

    const payload = Buffer.allocUnsafe(21);
    payload.writeUInt8(0x05, 0);
    hash.copy(payload, 1);
    return bs58check.encode(payload) as string;
}
