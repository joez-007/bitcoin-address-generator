import { describe, it } from 'mocha';
import {mockWalletData} from "../mock";
import * as assert from 'assert';
import { Script } from '../../utils/Script';

describe("Script",()=>{
    it('can generate a multi signature hash',()=>{
        const pubKeys=mockWalletData.Wallet.map(w=>w.publicKey)
            .map(i=>Buffer.from(i,'hex'));
        let m=2; 
        let s:Script=new Script();
        let hash=s.getMultisigHash(m,pubKeys);
        assert.strictEqual(hash.toString("hex"),mockWalletData.P2ScriptHash);
    });
})