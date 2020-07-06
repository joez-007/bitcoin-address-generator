/** @format */

import {Dispatch} from 'redux';
import {History} from 'history';

export interface UmiComponentProps {
    history: History;
    dispatch: Dispatch<any>;
}
