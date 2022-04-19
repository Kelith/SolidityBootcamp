pragma solidity ^0.8.0;

// Safemath not needed anymore from sol 0.8 onwards
// import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    // Safemath not needed anymore from sol 0.8 onwards
    // using SafeMath for uint;

    //Variables
    string public name = "JoJo Coin";
    string public symbol = "JJC";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    //Events
    event Transfer(address indexed from, address indexed to, uint256 value);        //indexed means only the events in which we're the receiver/sender?

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
