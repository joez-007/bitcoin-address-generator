import * as hdUtils from '../../utils/hdUtils';
import * as assert from 'assert';
import {describe, it} from 'mocha';
import {mockWalletData} from "../mock";

describe('hdUtils', () =>{
    const seed = mockWalletData.seed;
    const path = mockWalletData.Wallet[0].path;
    describe('generateMasterKeyFromSeed', () => {

        it('can be able to generate master key from a given seed', () => {
            const bSeed: Buffer = Buffer.from(seed, 'hex');
            let result = hdUtils.generateMasterKeyFromSeed(bSeed);
            if(result.privateKey)
            {
                assert.equal(result.privateKey.toString("hex"), mockWalletData.root.privateKey);
            }
            assert.equal(result.chainCode.toString("hex"), mockWalletData.root.chainCode);
        }); 
    });

    describe('derivePath', () => {
        for(let w of mockWalletData.Wallet){
            it('can be able to generate child key from a given seed and path:'+w.path, () => {
                const bSeed: Buffer = Buffer.from(seed, 'hex');
                let result = hdUtils.derivePath(w.path, bSeed);
                if(result.privateKey)
                {
                    assert.equal(result.privateKey?.toString('hex'), w.privateKey);
                    assert.equal(result.publicKey?.toString('hex'), w.publicKey);

                }
                assert.equal(result.chainCode.toString('hex'), w.chainCode);
            });
        }
    });
});
