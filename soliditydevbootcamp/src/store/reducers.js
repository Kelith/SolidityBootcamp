import { combineReducers } from 'redux';

function web3(state = {}, action){
    switch(action.type){
        case '':
            return state
        default:
            return state
    }
}


const rootReducer = combineReducers({
    web3  // es6 short for a key with the same value aka web3: web3
})

export default rootReducer