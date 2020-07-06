/** @format */

import {extend, ResponseError} from 'umi-request';
import {notification, message} from 'antd';

export const request = extend({
    maxCache: 10,
    prefix: '/v1/',
    errorHandler: async (error: ResponseError) => {
        const {response = {} as Response} = error;
        const {status, url} = response;
        const body = await response.json();
        if (body.message) {
            message.error(body.message);
            return;
        }
        notification.error({
            message: `request failed ${status}: ${url}`,
            description: body.message,
        });
    },
});
