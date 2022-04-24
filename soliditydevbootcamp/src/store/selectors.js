import { createSelector } from 'reselect';
import { get } from 'lodash';

// get is an utility that prevents code to blow up if the member of a variable doesn't exist
const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)