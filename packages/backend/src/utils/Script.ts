/** @format */

import {opCodes, Opcode} from './Opcode';

const bio = require('bufio');

export class Script {
    private code: Opcode[];

    constructor() {
        this.code = [];
    }

    getMultisigHash(m: number, keys: Buffer[]): Buffer {
        const n = keys.length;
        this.pushSmall(m);

        //this.sortKeys(keys);
        for (const key of keys) this.pushData(key);

        this.pushSmall(n);
        this.pushOp(opCodes.OP_CHECKMULTISIG);

        return this.compile();
    }

    pushSmall(num: number) {
        return this.push(Opcode.fromSmall(num));
    }

    pushData(data: any) {
        return this.push(Opcode.fromData(data));
    }

    push(op: any) {
        this.code.push(op);
    }

    pushOp(value: any) {
        return this.push(Opcode.fromOp(value));
    }

    compile(): Buffer {
        let size = 0;

        for (const op of this.code) size += op.getSize();

        const bw = bio.write(size);

        for (const op of this.code) op.toWriter(bw);

        let raw = bw.render();

        return raw;
    }
}
