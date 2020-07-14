import { describe, it } from 'mocha';
import * as crypto from '../../utils/cryptoUtils';
import * as assert from 'assert';
import { Buffer } from 'buffer';

describe('cryptoUtils',()=>{
    describe("hmacSHA512", () => {
        it('returns correct hash for hmacSHA512',() => {
          const data = Buffer.from("0101010101010101", 'hex');
          let actual:string;
          const expected="395ca89620dd427853caea05f2a63b6a09a37e7f0392f2df9df51bc9153ea1b0830f7051db86784edf059ddb5682e5f0e7dfbe076d36f34afcffbf41eaa2b9ef";
          actual = crypto.hmacSHA512(Buffer.from('key','utf8'),data).toString('hex');
          assert.strictEqual(actual, expected);
        });
    });

    describe("hash160", () => {
      it('returns correct hash for hash160',() => {
        const data = Buffer.from("0101010101010101", 'hex');
        let actual:string;
        const expected="abaf1119f83e384210fe8e222eac76e2f0da39dc";
        actual = crypto.hash160(data).toString('hex');
        assert.strictEqual(actual, expected);
      });
  });
})