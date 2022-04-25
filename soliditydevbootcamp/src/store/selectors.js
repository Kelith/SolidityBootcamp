import { createSelector } from 'reselect';
import { get } from 'lodash';

// get is an utility that prevents code to blow up if the member of a variable doesn't exist
const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)


// This is to check if the Token and Exchange smart contracts have been loaded
const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenSelector = createSelector(tokenLoaded, tl => tl)
const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeSelector = createSelector(exchangeLoaded, el => el)
export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)