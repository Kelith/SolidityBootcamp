pragma solidity ^0.8.0;

contract Token {
    string public name = "JoJo Coin";
    string public symbol = "JJC";
    uint256 public decimals = 18;
    uint public totalSupply;

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
    }
}
