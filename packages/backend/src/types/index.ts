/** @format */

export enum AddressType {
    P2PKH,
    P2WPKH,
}

export interface IResponseData {
    code: number;
    data: any;
}

export interface IAddressCreationResponse {
    address: string;
}

export interface ISeedCreationResponse {
    seed: string;
}

/**
 * HD Wallet Node Interface
 */
export interface IHDKeyNodeInterface {
    privateKey: Buffer | undefined;
    chainCode: Buffer;
    publicKey: Buffer | undefined;
    derivePath(path: string): IHDKeyNodeInterface;
}

export class InvalidParameterError extends Error {
    constructor(Parameter: string, errorMessage: string) {
        super();
        this.message = `%{Parameter} error: ${errorMessage}`;
    }
}
