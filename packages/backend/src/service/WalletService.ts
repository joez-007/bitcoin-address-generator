/** @format */
import {createHDRootNodeFromSeed} from '../utils/hdKeyNode';
import * as p2sh from '../utils/p2shUtils';
import {AddressType, IHDKeyNodeInterface} from '../types/index';
import * as addressUtils from '../utils/addressUtils';

/**
 * Generate a Hierarchical Deterministic (HD) bitcoin address from a given seed and path
 * @param seed the seed to generate master key
 * @param path the path of child, it follw BIP32
 * @param addressType legacy P2PKH address or Segregated Witness address
 */
function generateHDWalletAddress(seed: string, path: string, addressType: AddressType): string | undefined {
    const bSeed: Buffer = Buffer.from(seed, 'hex');
    const rootNode: IHDKeyNodeInterface = createHDRootNodeFromSeed(bSeed);

    const childNode = rootNode.derivePath(path);
    if (addressType == AddressType.P2PKH) return addressUtils.getP2PKHAddress(childNode.publicKey as Buffer);
    else return addressUtils.getP2wpkhAddress(childNode.publicKey as Buffer);
}

/**
 * Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path
 * @param seed the seed to generate master key
 * @param path the path of child, it follw BIP32
 */
function generateSegWitAddress(seed: string, path: string): string | undefined {
    return generateHDWalletAddress(seed, path, AddressType.P2WPKH);
}

/**
 * Generate a Hierarchical Deterministic (HD) Legacy P2PKH bitcoin address from a given seed and path
 * @param seed the seed to generate master key
 * @param path the path of child, it follw BIP32
 */
function generateP2PKHAddress(seed: string, path: string): string | undefined {
    return generateHDWalletAddress(seed, path, AddressType.P2PKH);
}

/**
 * create a multi signature address
 * @param pubkeys the public keys of all the participants
 * @param m the amount of signatures required to release the coins
 */
function generateMultiSigP2SHAddress(pubkeys: string[], m: number): string | undefined {
    const bPubKyes = pubkeys.map(skey => Buffer.from(skey, 'hex'));
    return p2sh.generateP2SHAddress(bPubKyes, m);
}

/**
 * generate Seed
 */
function generateSeed(): string {
    return addressUtils.generateSeed();
}

export {generateSeed, generateSegWitAddress, generateP2PKHAddress, generateMultiSigP2SHAddress};
