import { describe, it } from 'mocha';
import * as wallet from '../service/WalletService';
import * as assert from 'assert';
import {mockWalletData} from "./mock";

describe('WalletService',()=>{

    for(let w of mockWalletData.Wallet){
        const seed=mockWalletData.seed;
        const path=w.path;

        it('Can generate a HD SegWit address from a given seed and path:'+path,()=>{
            let address=wallet.generateSegWitHDWalletAddress(seed,path)
            assert.strictEqual(address,w.P2WPKH);
        });
    }

    it('can generate a multi signature address',()=>{
        const pubKeys=mockWalletData.Wallet.map(w=>w.publicKey);
        let m=2;
        let address=wallet.generateMultiSigP2SHAddress(pubKeys,m);
        assert.strictEqual(address,mockWalletData.MultiSigP2SHAddress);
    });
})
