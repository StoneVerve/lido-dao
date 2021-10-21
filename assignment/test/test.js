const Custodian = artifacts.require('Custodian');
const Steth = artifacts.require('ISTETH');

let custodian;
let lido;

require('chai').use(require('chai-as-promised')).should();


/* 
 * We test the functionality of the Custodian contract (deposits and withdraws)
 * using the testne Gorli and calling the Lido contract deployed in the testnet
 */
contract("Testing the custodian", ([admin]) => {
	
	/*
	 * The address of the Lido contract 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F
	 */
	before(async () => {
		custodian = await Custodian.new("0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F");
		lido = await Steth.at("0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F");
	})
	
	it("A user can deposit Eth using the custodian", async () => {
		let amount = web3.utils.toWei("0.3");
		await custodian.deposit({value: amount} );
		// We use to.be.above because of the variable gas fee that will be requiered to perform the operation
		// We assume that the current gas price on the gorli testnet is 15000 gwei
		expect(Number(web3.utils.fromWei(await lido.balanceOf(custodian.address)))).to.be.above(0.28);
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.above(0.28);
	});
	
	it("A user can deposit Eth multiple times", async () => {
		let amount = web3.utils.toWei("0.3");
		await custodian.deposit({value: amount} );
		// We use to.be.above because of the variable gas fee that will be requiered to perform the operation
		// We assume that the current gas price on the gorli testnet is 15000 gwei
		expect(Number(web3.utils.fromWei(await lido.balanceOf(custodian.address)))).to.be.above(0.56);
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.above(0.56);
	});
	
	it("A user can withdraw StEth", async () => {
		let amount = web3.utils.toWei("0.2");
		await custodian.withdraw(amount);
		// We use to.be.above because of the variable gas fee that will be requiered to perform the operation
		// In the case of withdraw since we are not sure what amount of value was deposited and what amount used as gas
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.above(0.36);
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.below(0.41);
		expect(Number(web3.utils.fromWei(await lido.balanceOf(admin)))).to.be.above(0.18);
	});
	
	it("A user can withdraw StEth multiple times as long as they have enough StEth", async () => {
		let amount = web3.utils.toWei("0.2");
		await custodian.withdraw(amount);
		// We use to.be.above because of the variable gas fee that will be requiered to perform the operation
		// In the case of withdraw since we are not sure what amount of value was deposited and what amount used as gas
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.above(0.16);
		expect(Number(web3.utils.fromWei(await custodian.balancesEth(admin)))).to.be.below(0.21);
		expect(Number(web3.utils.fromWei(await lido.balanceOf(admin)))).to.be.above(0.36);
	});
	
});
		