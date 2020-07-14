import {opCodes, Opcode} from "./Opcode";

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
        for (const key of keys)
            this.pushData(key);

        this.pushSmall(n);
        this.pushOp(opCodes.OP_CHECKMULTISIG);

        return this.compile();
    }

    private pushSmall(num: number) {
        return this.push(Opcode.fromSmall(num));
    }

    private pushData(data: any) {
        return this.push(Opcode.fromData(data));
    }

    private push(op: Opcode) {
        this.code.push(op);
    }

    private pushOp(value: number) {
        return this.push(Opcode.fromOp(value));
    }

    private compile(): Buffer {
        let size = 0;

        for (const op of this.code)
            size += op.getSize();

        const bw = bio.write(size);

        for (const op of this.code)
            op.toWriter(bw);

        let raw = bw.render();

        return raw;
    }
}
