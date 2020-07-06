/** @format */
import {logger} from '../utils/logger';

import http = require('http');
import {IResponseData, InvalidParameterError} from '../types';

export const writeJsonResponse = (response: http.ServerResponse, responseData: IResponseData): void => {
    response.writeHead(responseData.code, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(responseData.data));
};

export const handleError = (err: Error, res: http.ServerResponse, prefix: string) => {
    let errorMsg = 'Internal server error';
    let code = 500;
    if (err instanceof InvalidParameterError) {
        errorMsg = err.message;
        code = 400;
    }
    logger.error(`${prefix}:${err.message}`);
    res.statusCode = code;
    res.end(errorMsg);
};
