/** @format */

import {describe, it} from 'mocha';
import * as addressUtils from '../../utils/addressUtils';
import * as assert from 'assert';
import {Buffer} from 'buffer';

describe('addressUtils', () => {
    const privateKey = '31c00cb30b84a37238689f6e51e6ec8025367ad92c2a388fad9ee4866f46e5cb';
    const publicKey = '02eac6dcb947b1a874176a2fd5168ab854eb3c49d8d1a7f382eb990af2bdf885ab';

    describe('getP2wpkhAddress', () => {
        it('can get Segregated Witness Pay-to-PubKeyHash address from public key', () => {
            let buffer = Buffer.from(publicKey, 'hex');
            let result = addressUtils.getP2wpkhAddress(buffer);
            assert.strictEqual(result, 'bc1qyuq83pnlnyjwk2gpt99x29y8f9thpl3ea8cdn0');
        });
    });

    describe('getP2PKHAddress', () => {
        it('can get legacy Pay-to-PubKeyHash address from public key', () => {
            let buffer = Buffer.from(publicKey, 'hex');
            let result = addressUtils.getP2PKHAddress(buffer);
            assert.strictEqual(result, '14ZDvCDGdjmVyjFhrADcHurko1Vbaf9i5q');
        });
    });

    describe('getPublicKey', () => {
        it('can get Public Key from private key', () => {
            let privateKeyBuffer = Buffer.from(privateKey, 'hex');
            let result = addressUtils.getPublicKey(privateKeyBuffer);
            assert.strictEqual(result.toString('hex'), publicKey);
        });
    });

    describe('generateSeed', () => {
        it('can generate Seed', () => {
            let result = addressUtils.generateSeed();
            assert.strictEqual(Buffer.from(result, 'hex').length, 64);
        });
    });
});
