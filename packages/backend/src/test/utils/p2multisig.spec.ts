/** @format */

import {describe, it} from 'mocha';
import * as p2ms from '../../utils/p2shUtils';
import * as assert from 'assert';

describe('p2shUtils', () => {
    it('can generate a multi signature address', () => {
        let pubkeys = [
            '022bfa20bf739d5072320c128ca6734c2e177dff913b9a4d39812acddbeb5802c5',
            '0391eec60a617e2beccc684b617d36a26f08e2b2b64f1e72e1d8a8ec632a8112b6',
            '035403ded32575dd0170b1203ef8f91be3b735fdeeaaf1302840e2f63dad7191b9',
            '043acc2157d2ed9659dcddce97280fa70bae74e1c757f4457b7296aba4f81141a37cb5628d9cff2f1be06eb528de4eaa3ee51d93a979fe854b715dc40bfd61b236',
        ].map(i => Buffer.from(i, 'hex'));
        let m = 2;
        let address = p2ms.generateP2SHAddress(pubkeys, m);
        assert.strictEqual(address, '3Npx2NwSYSBGxpatU2CAmjsb3iku2NGo5N');
    });
});
