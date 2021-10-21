const Custodian = artifacts.require('Custodian');

let custodian;

require('chai').use(require('chai-as-promised')).should();


/* 
 * We test the functionality of the Custodian contract (deposits and withdraws)
 * Using the local testnet provided by truffle we test the "require" statements of our contract
 */
contract("Testing the custodian", ([admin]) => {
	
	/*
	 * The address of the Lido contract 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F
	 * The address is only valid on the Gorli testnet
	 * For these tests it doen't matter since we never actually call the Lido contract
	 */
	before(async () => {
		// We use a fake address to call the contructor
		custodian = await Custodian.new("0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F");
	})
	
	it("A user is not allow to depost zero ether", async () => {
		await custodian.deposit().should.be.rejectedWith("Can not deposit 0 Ether");
	});
	 
	it("A user is not allow withdraw zero stEth", async () => {
		await custodian.withdraw(0).should.be.rejectedWith("You can not withdraw zero stEth");
	});
	
	it("A user is not allow withdraw stEth if they don't have Eth deposited", async () => {
		await custodian.withdraw(14).should.be.rejectedWith("You don't have enough stEth");
	});
	
});
		