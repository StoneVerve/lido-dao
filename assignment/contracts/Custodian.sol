// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.4.24;


import "./ISTETH.sol";

/*
 * Smart Contract that acts as a custodian of staked eth by users
 * using the Lido protocol
 */
contract Custodian{
    
    /* The eth balances and stEth balances, since they correspond 1 to 1 */
    mapping(address => uint256) public balancesEth;
    
    // The lido protocol contract
    ISTETH public lido;
    
    
    /*
     * Creates a new Custodian given the lido protocol smart contract's address
     */
    constructor(address _lido) public {
        lido = ISTETH(_lido);
    }
	
	
	/*
	 * Allows a user to send eth so it can be staked using the Lido protocol
	 * 
	 */
	function deposit() public payable returns(bool){
	    require(msg.value != 0, "Can not deposit 0 Ether");
	    require(!lido.isStopped(), "The contract is currently stoped, please try again later");
	    balancesEth[msg.sender] += msg.value;
	    bool success = address(lido).call.value(msg.value)();
	    require(success, "The process was not successfull");
	    return success;
	}
	
	
	/*
	 * Allows a user to transfer stEth (up to the amount of Eth manged by the custodian) from the custodian to a 
	 * different address
	 * @param The amount of stEth to be transfer 
	 */
	function withdraw(uint256 amount) public returns(bool) {
	    require(amount != 0, "You can not withdraw zero stEth");
		require(amount <= balancesEth[msg.sender], "You don't have enough stEth");
	    require(!lido.isStopped(), "The contract is currently stoped, please try again later");
	    balancesEth[msg.sender] -= amount;
	    bool success = lido.transfer(msg.sender, amount);
	    require(success, "The operation was not successfull");
	    return success;
	}
	
}