/** @format */

import {describe, it} from 'mocha';
import * as crypto from '../../utils/crypto';
import * as assert from 'assert';
import {Buffer} from 'buffer';

describe('crypto', () => {
    let hash = [
        {
            hex: '0000000000000001',
            hash160: 'cdb00698f02afd929ffabea308340fa99ac2afa8',
            hash256: '3ae5c198d17634e79059c2cd735491553d22c4e09d1d9fea3ecf214565df2284',
            ripemd160: '8d1a05d1bc08870968eb8a81ad4393fd3aac6633',
            hmacSHA512:
                'f69d6961b7c5f8deb1714e90ba197e2596fe32faf9b87760c422ab4fd850b5e1c7aeda796e6baee33ddb860c13cc7133b6594328d4da750b10b710a3e1974d8f',
            sha256: 'cd2662154e6d76b2b2b92e70c0cac3ccf534f9b74eb5b89819ec509083d00a50',
        },
        {
            hex: '0101010101010101',
            hash160: 'abaf1119f83e384210fe8e222eac76e2f0da39dc',
            hash256: '728338d99f356175c4945ef5cccfa61b7b56143cbbf426ddd0e0fc7cfe8c3c23',
            ripemd160: '5825701b4b9767fd35063b286dca3582853e0630',
            hmacSHA512:
                '395ca89620dd427853caea05f2a63b6a09a37e7f0392f2df9df51bc9153ea1b0830f7051db86784edf059ddb5682e5f0e7dfbe076d36f34afcffbf41eaa2b9ef',
            sha256: '04abc8821a06e5a30937967d11ad10221cb5ac3b5273e434f1284ee87129a061',
        },
        {
            hex: 'ffffffffffffffff',
            hash160: 'f86221f5a1fca059a865c0b7d374dfa9d5f3aeb4',
            hash256: '752adad0a7b9ceca853768aebb6965eca126a62965f698a0c1bc43d83db632ad',
            ripemd160: 'cb760221600ed34337ca3ab70016b5f58c838120',
            hmacSHA512:
                '9d9fb76740acb6dbdafecab944e5c176afe86b5b42722992b815cb4a04fcb0ea13e28120667bf8dc647f96b2e2873c008025a31a6715cbc7f4dcc191489ea847',
            sha256: '12a3ae445661ce5dee78d0650d33362dec29c4f82af05e7e57fb595bbbacf0ca',
        },
        {
            hex:
                '4c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e73656374657475722061646970697363696e6720656c69742e20446f6e65632061742066617563696275732073617069656e2c2076656c20666163696c6973697320617263752e20536564207574206d61737361206e6962682e205574206d6f6c6c69732070756c76696e6172206d617373612e20557420756c6c616d636f7270657220646f6c6f7220656e696d2c20696e206d6f6c657374696520656e696d20636f6e64696d656e74756d2061632e20416c697175616d206572617420766f6c75747061742e204e756c6c6120736f64616c657320617420647569206e656320',
            hash160: '9763e6b367c363bd6b88a7b361c98e6beee243a5',
            hash256: '033588797115feb3545052670cac2a46584ab3cb460de63756ee0275e66b5799',
            ripemd160: 'cad8593dcdef12ee334c97bab9787f07b3f3a1a5',
            hmacSHA512:
                '43d3c12c9053c101f9d28c832a53a2e797c5a4bf352a1deaa2f803108e3edea2950ce13e9a6c75705b4b96eec38f7fe12acd08f6a3fda6209463e56163a483f9',
            sha256: 'a7fb8276035057ed6479c5f2305a96da100ac43f0ac10f277e5ab8c5457429da',
        },
    ];

    ['hash160', 'ripemd160', 'sha256', 'hmacSHA512'].forEach(algorithm => {
        describe(algorithm, () => {
            hash.forEach(f => {
                const fn = (crypto as any)[algorithm];
                const expected = (f as any)[algorithm];

                it('returns ' + expected + ' for ' + f.hex, () => {
                    const data = Buffer.from(f.hex, 'hex');
                    let actual: string;
                    if (algorithm == 'hmacSHA512') {
                        actual = fn(Buffer.from('key', 'utf8'), data).toString('hex');
                    } else {
                        actual = fn(data).toString('hex');
                    }

                    assert.strictEqual(actual, expected);
                });
            });
        });
    });
});
