/** @format */

import {configure, getLogger} from 'log4js';
import path = require('path');

// Logger configuration
configure(path.join(__dirname, '../config/log4js-config.json'));

// Default logger
export const logger = getLogger();
