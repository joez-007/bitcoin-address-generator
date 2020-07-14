/** @format */

import {describe, it} from 'mocha';
import * as wallet from '../service/WalletService';
import * as assert from 'assert';

describe('WalletService', () => {
    //var mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost';

    it('Can generate a HD SegWit address from a given seed and path', () => {
        let seed =
            'f4f0cda65a9068e308fad4c96e8fe22213dd535fe7a7e91ca70c162a38a49aaacfe0dde5fafbbdf63cf783c2619db7174bc25cbfff574fb7037b1b9cec3d09b6';
        let path = "m/84'/0'/0'/0/6";
        let address = wallet.generateSegWitHDWalletAddress(seed, path);
        assert.strictEqual(address, 'bc1q7ue7647tq4r4kn6fj7dpjas0fwgxt06j8gsjkg');
    });

    it('can throw error with incorrect path', () => {
        let seed =
            'f4f0cda65a9068e308fad4c96e8fe22213dd535fe7a7e91ca70c162a38a49aaacfe0dde5fafbbdf63cf783c2619db7174bc25cbfff574fb7037b1b9cec3d09b6';
        let path = "m84a'/0'/0'/0/6";
        assert.throws(() => {
            let address = wallet.generateSegWitHDWalletAddress(seed, path);
        });
    });

    it('can generate a multi signature address', () => {
        let pubkeys = [
            '022bfa20bf739d5072320c128ca6734c2e177dff913b9a4d39812acddbeb5802c5',
            '0391eec60a617e2beccc684b617d36a26f08e2b2b64f1e72e1d8a8ec632a8112b6',
            '035403ded32575dd0170b1203ef8f91be3b735fdeeaaf1302840e2f63dad7191b9',
            '043acc2157d2ed9659dcddce97280fa70bae74e1c757f4457b7296aba4f81141a37cb5628d9cff2f1be06eb528de4eaa3ee51d93a979fe854b715dc40bfd61b236',
        ];
        let m = 2;
        let address = wallet.generateMultiSigP2SHAddress(pubkeys, m);
        assert.strictEqual(address, '3Npx2NwSYSBGxpatU2CAmjsb3iku2NGo5N');
    });
});
