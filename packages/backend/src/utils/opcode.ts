export const opCodes = {
    // Push
    OP_0: 0x00,

    OP_PUSHDATA1: 0x4c,
    OP_PUSHDATA2: 0x4d,
    OP_PUSHDATA4: 0x4e,

    OP_1NEGATE: 0x4f,

    OP_RESERVED: 0x50,

    OP_1: 0x51,
    OP_2: 0x52,
    OP_3: 0x53,
    OP_4: 0x54,
    OP_5: 0x55,
    OP_6: 0x56,
    OP_7: 0x57,
    OP_8: 0x58,
    OP_9: 0x59,
    OP_10: 0x5a,
    OP_11: 0x5b,
    OP_12: 0x5c,
    OP_13: 0x5d,
    OP_14: 0x5e,
    OP_15: 0x5f,
    OP_16: 0x60,

    // Control
    OP_NOP: 0x61,
    OP_VER: 0x62,
    OP_IF: 0x63,
    OP_NOTIF: 0x64,
    OP_VERIF: 0x65,
    OP_VERNOTIF: 0x66,
    OP_ELSE: 0x67,
    OP_ENDIF: 0x68,
    OP_VERIFY: 0x69,
    OP_RETURN: 0x6a,

    // Stack
    OP_TOALTSTACK: 0x6b,
    OP_FROMALTSTACK: 0x6c,
    OP_2DROP: 0x6d,
    OP_2DUP: 0x6e,
    OP_3DUP: 0x6f,
    OP_2OVER: 0x70,
    OP_2ROT: 0x71,
    OP_2SWAP: 0x72,
    OP_IFDUP: 0x73,
    OP_DEPTH: 0x74,
    OP_DROP: 0x75,
    OP_DUP: 0x76,
    OP_NIP: 0x77,
    OP_OVER: 0x78,
    OP_PICK: 0x79,
    OP_ROLL: 0x7a,
    OP_ROT: 0x7b,
    OP_SWAP: 0x7c,
    OP_TUCK: 0x7d,

    // Splice
    OP_CAT: 0x7e,
    OP_SUBSTR: 0x7f,
    OP_LEFT: 0x80,
    OP_RIGHT: 0x81,
    OP_SIZE: 0x82,

    // Bit
    OP_INVERT: 0x83,
    OP_AND: 0x84,
    OP_OR: 0x85,
    OP_XOR: 0x86,
    OP_EQUAL: 0x87,
    OP_EQUALVERIFY: 0x88,
    OP_RESERVED1: 0x89,
    OP_RESERVED2: 0x8a,

    // Numeric
    OP_1ADD: 0x8b,
    OP_1SUB: 0x8c,
    OP_2MUL: 0x8d,
    OP_2DIV: 0x8e,
    OP_NEGATE: 0x8f,
    OP_ABS: 0x90,
    OP_NOT: 0x91,
    OP_0NOTEQUAL: 0x92,
    OP_ADD: 0x93,
    OP_SUB: 0x94,
    OP_MUL: 0x95,
    OP_DIV: 0x96,
    OP_MOD: 0x97,
    OP_LSHIFT: 0x98,
    OP_RSHIFT: 0x99,
    OP_BOOLAND: 0x9a,
    OP_BOOLOR: 0x9b,
    OP_NUMEQUAL: 0x9c,
    OP_NUMEQUALVERIFY: 0x9d,
    OP_NUMNOTEQUAL: 0x9e,
    OP_LESSTHAN: 0x9f,
    OP_GREATERTHAN: 0xa0,
    OP_LESSTHANOREQUAL: 0xa1,
    OP_GREATERTHANOREQUAL: 0xa2,
    OP_MIN: 0xa3,
    OP_MAX: 0xa4,
    OP_WITHIN: 0xa5,

    // Crypto
    OP_RIPEMD160: 0xa6,
    OP_SHA1: 0xa7,
    OP_SHA256: 0xa8,
    OP_HASH160: 0xa9,
    OP_HASH256: 0xaa,
    OP_CODESEPARATOR: 0xab,
    OP_CHECKSIG: 0xac,
    OP_CHECKSIGVERIFY: 0xad,
    OP_CHECKMULTISIG: 0xae,
    OP_CHECKMULTISIGVERIFY: 0xaf,

    // Expansion
    OP_NOP1: 0xb0,
    OP_CHECKLOCKTIMEVERIFY: 0xb1,
    OP_CHECKSEQUENCEVERIFY: 0xb2,
    OP_NOP4: 0xb3,
    OP_NOP5: 0xb4,
    OP_NOP6: 0xb5,
    OP_NOP7: 0xb6,
    OP_NOP8: 0xb7,
    OP_NOP9: 0xb8,
    OP_NOP10: 0xb9,

    // Custom
    OP_INVALIDOPCODE: 0xff
};

const opCache: Opcode[] = [];

function initopCache() {
    for (let value = 0x00; value <= 0xff; value++) {
        if (value >= 0x01 && value <= 0x4e) {
            opCache.push(new Opcode(-1, Buffer.alloc(0)));
            continue;
        }
        const op = new Opcode(value, Buffer.alloc(0));
        opCache.push(Object.freeze<Opcode>(op));
    }
}

export class Opcode {
    readonly value: number;
    readonly data: Buffer;

    constructor(value: number, data: Buffer) {
        this.value = value || 0;
        this.data = data;
    }

    static fromSmall(num: number): Opcode {
        return this.fromOp(num === 0 ? 0 : num + 0x50);
    }


    static fromOp(op: number): Opcode {
        if (opCache.length == 0) {
            initopCache();
        }
        const cached = opCache[op];
        return cached;
    }

    static fromData(data: Buffer): Opcode {


        if (data.length === 1) {
            if (data[0] === 0x81)
                return this.fromOp(opCodes.OP_1NEGATE);

            if (data[0] >= 1 && data[0] <= 16)
                return this.fromOp(data[0] + 0x50);
        }

        return this.fromPush(data);
    }

    static fromPush(data: Buffer): Opcode {

        if (data.length === 0)
            return this.fromOp(opCodes.OP_0);

        if (data.length <= 0x4b)
            return new this(data.length, data);

        if (data.length <= 0xff)
            return new this(opCodes.OP_PUSHDATA1, data);

        if (data.length <= 0xffff)
            return new this(opCodes.OP_PUSHDATA2, data);

        if (data.length <= 0xffffffff)
            return new this(opCodes.OP_PUSHDATA4, data);

        throw new Error('Pushdata size too large.');
    }

    /**
     * Calculate opcode size.
     * @returns {Number}
     */
    getSize(): number {
        if (!this.data)
            return 1;

        switch (this.value) {
            case opCodes.OP_PUSHDATA1:
                return 2 + this.data.length;
            case opCodes.OP_PUSHDATA2:
                return 3 + this.data.length;
            case opCodes.OP_PUSHDATA4:
                return 5 + this.data.length;
            default:
                return 1 + this.data.length;
        }
    }

    /**
     * Encode the opcode to a buffer writer.
     * @param {BufferWriter} bw
     */

    toWriter(bw: any) {
        if (this.value === -1)
            throw new Error('Cannot reserialize a parse error.');

        if (!this.data) {
            bw.writeU8(this.value);
            return bw;
        }

        switch (this.value) {
            case opCodes.OP_PUSHDATA1:
                bw.writeU8(this.value);
                bw.writeU8(this.data.length);
                bw.writeBytes(this.data);
                break;
            case opCodes.OP_PUSHDATA2:
                bw.writeU8(this.value);
                bw.writeU16(this.data.length);
                bw.writeBytes(this.data);
                break;
            case opCodes.OP_PUSHDATA4:
                bw.writeU8(this.value);
                bw.writeU32(this.data.length);
                bw.writeBytes(this.data);
                break;
            default:
                bw.writeU8(this.value);
                bw.writeBytes(this.data);
                break;
        }

        return bw;
    }
}

