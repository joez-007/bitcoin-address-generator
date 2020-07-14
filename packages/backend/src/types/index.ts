/** @format */

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

export class InvalidParameterError extends Error {
    constructor(Parameter: string, errorMessage: string) {
        super();
        this.message = `%{Parameter} error: ${errorMessage}`;
    }
}
