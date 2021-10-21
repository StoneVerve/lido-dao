const Custodian = artifacts.require("Custodian");

module.exports = async function(deployer) {
	
		
	// The address for the Lido smart contract token
	let lido_address = "0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882";
	
	/* 
	 * We deploy the custodian contract with the Lido smart contract address from the gorli testnet
	 */
	await deployer.deploy(Custodian, lido_address);
	
	const custodian = await Custodian.deployed();
	
	
	console.log("Custodian contract address " + Custodian.address);
	
};