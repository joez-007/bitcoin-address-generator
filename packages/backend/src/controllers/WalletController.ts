/** @format */

import http = require('http');
import * as WalletService from '../service/WalletService';
import {IAddressCreationResponse, ISeedCreationResponse} from '../types';
import {writeJsonResponse, handleError} from '../utils/ResponseUtils';

function createAddressCreationResponse(address: string | undefined): IAddressCreationResponse {
    if (address) return {address: address};
    else throw new Error('unknown error');
}

/**
 * generate segwit Pay-to-Public-Key-Hash address
 * @param req Parameters passed by json in http request body: {seed:string,path:string}, seed is hex string
 * @param res  Http response
 */
async function generateP2WPKHAddress(req: any, res: any) {
    try {
        const reqData = req.swagger.params['body'].value;
        const address = WalletService.generateSegWitAddress(reqData.seed, reqData.path);
        writeJsonResponse(res, {
            code: 200,
            data: createAddressCreationResponse(address),
        });
    } catch (err) {
        handleError(err, res, 'generateP2WPKHAddress');
    }
}

/**
 * generate legacy Pay-to-Public-Key-Hash address
 * @param req Parameters passed by json in http request body: {seed:string,path:string}, seed is hex string
 * @param res  Http response
 */
async function generateP2PKHAddress(req: any, res: any) {
    try {
        const reqData = req.swagger.params['body'].value;
        const address = WalletService.generateP2PKHAddress(reqData.seed, reqData.path);
        writeJsonResponse(res, {
            code: 200,
            data: createAddressCreationResponse(address),
        });
    } catch (err) {
        handleError(err, res, 'generateP2PKHAddress');
    }
}

/**
 * generate Pay-to-ScriptHash address
 * @param req Parameters passed by json in request body: {pubkeys:string[],m:number}
 * @param res  Http response
 */
async function generateP2SHAddress(req: any, res: any) {
    try {
        const reqData = req.swagger.params['body'].value;
        const address = WalletService.generateMultiSigP2SHAddress(reqData.pubkeys, reqData.m);
        writeJsonResponse(res, {
            code: 200,
            data: createAddressCreationResponse(address),
        });
    } catch (err) {
        handleError(err, res, 'generateP2SHAddress');
    }
}

/**
 * Generate a random Seed
 * @param req Http request
 * @param res Http response
 */
async function generateSeed(req: any, res: any) {
    try {
        const seed = WalletService.generateSeed();
        const seedCreationResponse: ISeedCreationResponse = {seed: seed};
        writeJsonResponse(res, {
            code: 200,
            data: seedCreationResponse,
        });
    } catch (err) {
        handleError(err, res, 'generateSeed');
    }
}

export {generateSeed, generateP2WPKHAddress, generateP2PKHAddress, generateP2SHAddress};
