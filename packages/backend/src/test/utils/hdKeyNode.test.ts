/** @format */

import {describe, it} from 'mocha';
import * as hdNode from '../../utils/hdKeyNode';
import * as assert from 'assert';

describe('hdKeyNode', () => {
    it('can create master key form seed', () => {
        let seed = Buffer.from(
            'f4f0cda65a9068e308fad4c96e8fe22213dd535fe7a7e91ca70c162a38a49aaacfe0dde5fafbbdf63cf783c2619db7174bc25cbfff574fb7037b1b9cec3d09b6',
            'hex'
        );
        let root = hdNode.createHDRootNodeFromSeed(seed);
        let child = root.derivePath("m/84'/0'/0'/0/4");
        if (child.publicKey)
            assert.strictEqual(
                child.publicKey.toString('hex'),
                '029063f89d28f66d28b4628570ad76db8f79b09f8724aa08e0214c21dfe49d9895'
            );
    });

    it('can throw error with incorrect path', () => {
        let seed = Buffer.from(
            'f4f0cda65a9068e308fad4c96e8fe22213dd535fe7a7e91ca70c162a38a49aaacfe0dde5fafbbdf63cf783c2619db7174bc25cbfff574fb7037b1b9cec3d09b6',
            'hex'
        );
        let root = hdNode.createHDRootNodeFromSeed(seed);
        assert.throws(() => {
            let child = root.derivePath("3m/84'/0'/0'/0/4");
        });
    });
});
