import { describe, it } from 'mocha';
import * as addressUtils from '../../utils/addressUtils';
import * as assert from 'assert';
import { Buffer } from 'buffer';

import {mockWalletData} from "../mock";

describe('addressUtils',()=>{

    for(let w of mockWalletData.Wallet){
        const privateKey=w.privateKey;
        const publicKey=w.publicKey;

        describe("getP2wpkhAddress",()=>{
            it('can get Segregated Witness Pay-to-PubKeyHash address from public key:'+publicKey,()=>{
                let buffer=Buffer.from(publicKey,'hex');
                let result= addressUtils.getP2wpkhAddress(buffer);
                assert.strictEqual(result,w.P2WPKH);
            });
        });

        describe("getPublicKey",()=>{
            it('can get Public Key from private key:'+w.privateKey,()=>{
                let privateKeyBuffer=Buffer.from(privateKey,'hex');
                let result= addressUtils.getPublicKey(privateKeyBuffer);
                assert.strictEqual(result.toString("hex"),publicKey);
            });
        });
    }


    describe("generateSeed",()=>{
        it('can generate Seed',()=>{
            let result= addressUtils.generateSeed();
            assert.strictEqual(Buffer.from(result,"hex").length,64);
        });
    });

})
