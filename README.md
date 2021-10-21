# Programming assignment

Background: Lido is a protocol that lets users stake their ETH in the Ethereum 2.0 Beacon Chain and provides them with stETH. stETH is an interest bearing version of ETH, meaning users who hold it will see their balance increase over time. For this assignment, you will:
* Interact with deployed Lido contracts on the Görli testnet OR deploy them on a local blockchain (see below documentation)
* Write and deploy a smart contract that takes in the user's ETH and deposits it to Lido. This will convert the ETH to stETH, which your smart contract will custody
* In this contract, enable the user who made the deposit to withdraw only as much stETH as they deposited (i.e. if they deposited 10 ETH, allow them to withdraw up to 10 stETH from the contract)
* Write test cases for this function in a language / framework of your choice
* Add a new section in this file that describes your process clearly enough to replicate
 
To complete the assignment, fork this repo, make changes there, and then add Github user sforman2000 to the repo when you're finished. Your submission will be judged based on functionality, documentation, and test coverage. We recommend spending no more than three hours on this assignment.

## Programming assignment (Solution)

The assigmente was completed using `npm` package manager and the `truffle` framework for the development, testing and deployment. All the files are located under the [assignment](https://github.com/StoneVerve/lido-dao/tree/master/assignment) folder.

Because of this you need to go to [assignment](https://github.com/StoneVerve/lido-dao/tree/master/assignment) folder and install truffle using the command `npm install truffle`

***All the following commands need to be run inside the [assignment](https://github.com/StoneVerve/lido-dao/tree/master/assignment) folder.***

Since for the testing and deployment of the contracts we use the **Gorli** testnet you need to provide a private key corresponding to valid address on the *Gorli* testnet. The address provided also needs to have some ether in order to be able to run the tests and deployment script. I recommend to have around **5 ether** 

In order to provide the private key you need to access the file `truffle-config.js`

```

 const HDWalletProvider = require('@truffle/hdwallet-provider');
 
  /*
   * Private key of the etherum address that will be use to deploy and test the smartcontract
   */
 const private_key = "PRIVATE_KEY";

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
```

And replace the string **PRIVATE_KEY** with your actual private key

### Run tests

Since neither ether.js or web3.js provide accessible tools to catch messages trigger by a `require()` statement from solidity the tests are splited in two files.

In order to run tests that just analise the `require()` statements from the contract we usea a *Local* enviroment provided by truffle. To run the test just type the command:

```truffle test ./test/local/local_test.js```

In order to run the rest of the tests we use the **Gorli** testnet. To run the test just type the command:

```truffle test ./test/test.js --network gorli```


### Deployment


<hr/>



# Lido Ethereum Liquid Staking Protocol

[![Tests](https://github.com/lidofinance/lido-dao/workflows/Tests/badge.svg)](https://github.com/lidofinance/lido-dao/actions)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

The Lido Ethereum Liquid Staking Protocol, built on Ethereum 2.0's Beacon chain, allows their users to earn staking rewards on the Beacon chain without locking Ether or maintaining staking infrastructure.

Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The smart contract then stakes tokens with the DAO-picked node operators. Users' deposited funds are pooled by the DAO, node operators never have direct access to the users' assets.

Unlike staked ether, the stETH token is free from the limitations associated with a lack of liquidity and can be transferred at any time. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.

Before getting started with this repo, please read:

* [A Primer](https://lido.fi/static/Lido:Ethereum-Liquid-Staking.pdf)
* [Documentation](/docs)

## Lido DAO

The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.

Also, the DAO will accumulate service fees and spend them on insurance, research, development, and protocol upgrades. Initial DAO members will take part in the threshold signature for Ethereum 2.0 by making BLS threshold signatures.

The Lido DAO is an [Aragon organization](https://aragon.org/dao). Since Aragon provides a full end-to-end framework to build DAOs, we use its standard tools. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

## Protocol levers

A full list of protocol levers that are controllable by the Aragon DAO can be found [here](docs/protocol-levers.md).

## Contracts

Most of the protocol is implemented as a set of smart contracts that extend the [AragonApp](https://github.com/aragon/aragonOS/blob/next/contracts/apps/AragonApp.sol) base contract.
These contracts are located in the [contracts/0.4.24](contracts/0.4.24) directory. Additionally, there are contracts that don't depend on the Aragon; they are located in the [contracts/0.6.12](contracts/0.6.12) directory.

#### [Lido](contracts/0.4.24/Lido.sol)
Lido is the core contract which acts as a liquid staking pool. The contract is responsible for Ether deposits and withdrawals, minting and burning liquid tokens, delegating funds to node operators, applying fees, and accepting updates from the oracle contract. Node Operators' logic is extracted to a separate contract, NodeOperatorsRegistry.

Lido also acts as an ERC20 token which represents staked ether, stETH. Tokens are minted upon deposit and burned when redeemed. stETH tokens are pegged 1:1 to the Ethers that are held by Lido. stETH token’s balances are updated when the oracle reports change in total stake every day.

#### [NodeOperatorsRegistry](contracts/0.4.24/nos/NodeOperatorsRegistry.sol)
Node Operators act as validators on the Beacon chain for the benefit of the protocol. The DAO selects node operators and adds their addresses to the NodeOperatorsRegistry contract. Authorized operators have to generate a set of keys for the validation and also provide them with the smart contract. As Ether is received from users, it is distributed in chunks of 32 Ether between all active Node Operators. The contract contains a list of operators, their keys, and the logic for distributing rewards between them. The DAO can deactivate misbehaving operators.

#### [LidoOracle](contracts/0.4.24/oracle/LidoOracle.sol)
LidoOracle is a contract where oracles send addresses' balances controlled by the DAO on the ETH 2.0 side. The balances can go up because of reward accumulation and can go down due to slashing and staking penalties. Oracles are assigned by the DAO.

#### [WstETH](contracts/0.6.12/WstETH.sol)
It's an ERC20 token that represents the account's share of the total supply of stETH tokens. The balance of a wstETH token holder only changes on transfers, unlike the balance of stETH that is also changed when oracles report staking rewards, penalties, and slashings. It's a "power user" token that is required for some DeFi protocols like Uniswap v2, cross-chain bridges, etc.

The contract also works as a wrapper that accepts stETH tokens and mints wstETH in return. The reverse exchange works exactly the opposite, the received wstETH tokens are burned, and stETH tokens are returned to the user with any accrued rebalance results.

## Deployments

### Mainnet

* Lido DAO: [`0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc`](https://etherscan.io/address/0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) (proxy)
* LDO token: [`0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32`](https://etherscan.io/address/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
* Lido and stETH token: [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) (proxy)
* Node Operators registry: [`0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5`](https://etherscan.io/address/0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) (proxy)
* Oracle: [`0x442af784A788A5bd6F42A01Ebe9F287a871243fb`](https://etherscan.io/address/0x442af784A788A5bd6F42A01Ebe9F287a871243fb) (proxy)
* WstETH token: [`0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0`](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0)
* Aragon Voting: [`0x2e59A20f205bB85a89C53f1936454680651E618e`](https://etherscan.io/address/0x2e59A20f205bB85a89C53f1936454680651E618e) (proxy)
* Aragon Token Manager: [`0xf73a1260d222f447210581DDf212D915c09a3249`](https://etherscan.io/address/0xf73a1260d222f447210581DDf212D915c09a3249) (proxy)
* Aragon Finance: [`0xB9E5CBB9CA5b0d659238807E84D0176930753d86`](https://etherscan.io/address/0xB9E5CBB9CA5b0d659238807E84D0176930753d86) (proxy)
* Aragon Agent: [`0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`](https://etherscan.io/address/0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) (proxy)

### Görli+Prater testnet

* Lido DAO: [`0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A`](https://goerli.etherscan.io/address/0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A) (proxy)
* LDO token: [`0x56340274fB5a72af1A3C6609061c451De7961Bd4`](https://goerli.etherscan.io/address/0x56340274fB5a72af1A3C6609061c451De7961Bd4)
* Lido and stETH token: [`0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F`](https://goerli.etherscan.io/address/0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F) (proxy)
* Node Operators registry: [`0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320`](https://goerli.etherscan.io/address/0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320) (proxy)
* Oracle: [`0x24d8451BC07e7aF4Ba94F69aCDD9ad3c6579D9FB`](https://goerli.etherscan.io/address/0x24d8451BC07e7aF4Ba94F69aCDD9ad3c6579D9FB) (proxy)
* WstETH token: [`0x1643e812ae58766192cf7d2cf9567df2c37e9b7f`](https://goerli.etherscan.io/address/0x1643e812ae58766192cf7d2cf9567df2c37e9b7f)
* Aragon Voting: [`0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db`](https://goerli.etherscan.io/address/0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db) (proxy)
* Aragon Token Manager: [`0xDfe76d11b365f5e0023343A367f0b311701B3bc1`](https://goerli.etherscan.io/address/0xDfe76d11b365f5e0023343A367f0b311701B3bc1) (proxy)
* Aragon Finance: [`0x75c7b1D23f1cad7Fb4D60281d7069E46440BC179`](https://goerli.etherscan.io/address/0x75c7b1D23f1cad7Fb4D60281d7069E46440BC179) (proxy)
* Aragon Agent: [`0x4333218072D5d7008546737786663c38B4D561A4`](https://goerli.etherscan.io/address/0x4333218072D5d7008546737786663c38B4D561A4) (proxy)

### Görli+Pyrmont testnet

* Lido DAO: [`0xE9c991d2c9Ac29b041C8D05484C2104bD00CFF4b`](https://goerli.etherscan.io/address/0xE9c991d2c9Ac29b041C8D05484C2104bD00CFF4b) (proxy)
* LDO token: [`0xF837FBd803Ad6EdA0a89c5acF8785034F5aB33f2`](https://goerli.etherscan.io/address/0xF837FBd803Ad6EdA0a89c5acF8785034F5aB33f2)
* stETH token: [`0xA0cA1c13721BAB3371E0609FFBdB6A6B8e155CC0`](https://goerli.etherscan.io/address/0xA0cA1c13721BAB3371E0609FFBdB6A6B8e155CC0) (proxy)
* cstETH token: [`0x259d1D7058db3C7cB2aa15f60c1f40f261e9A009`](https://goerli.etherscan.io/address/0x259d1D7058db3C7cB2aa15f60c1f40f261e9A009)
* Lido: [`0xA5d26F68130c989ef3e063c9bdE33BC50a86629D`](https://goerli.etherscan.io/address/0xA5d26F68130c989ef3e063c9bdE33BC50a86629D) (proxy)
* Node Operators registry: [`0xB1e7Fb9E9A71063ab552dDEE87Ea8C6eEc7F5c7A`](https://goerli.etherscan.io/address/0xB1e7Fb9E9A71063ab552dDEE87Ea8C6eEc7F5c7A) (proxy)
* Oracle: [`0x8aA931352fEdC2A5a5b3E20ed3A546414E40D86C`](https://goerli.etherscan.io/address/0x8aA931352fEdC2A5a5b3E20ed3A546414E40D86C) (proxy)
* Aragon Voting: [`0xA54DBf1B494113fBDA2E593419eE7241EfE8B766`](https://goerli.etherscan.io/address/0xA54DBf1B494113fBDA2E593419eE7241EfE8B766) (proxy)
* Aragon token manager: [`0xB90D5df4aBDf5F69a00088d43E4A0Fa8A8b44244`](https://goerli.etherscan.io/address/0xB90D5df4aBDf5F69a00088d43E4A0Fa8A8b44244) (proxy)
* Aragon finance: [`0xfBfa38921d745FD7bE9fa657FFbcDFecC4Ab7Cd4`](https://goerli.etherscan.io/address/0xfBfa38921d745FD7bE9fa657FFbcDFecC4Ab7Cd4) (proxy)
* Aragon agent: [`0xd616af91a0C3fE5AEeA0c1FaEfC2d73AcA82F0c9`](https://goerli.etherscan.io/address/0xd616af91a0C3fE5AEeA0c1FaEfC2d73AcA82F0c9) (proxy)

## Development

### Requirements

* shell - bash or zsh
* docker
* find
* sed
* jq
* curl
* cut
* docker
* node.js v12
* (optional) Lerna

### Installing Aragon & other deps

Installation is local and doesn't require root privileges.

If you have `yarn` installed globally:

```bash
yarn
```

otherwise:

```bash
npx yarn
```

### Building docker containers

```bash
cd e2e
docker-compose build --no-cache
```

### Starting & stopping e2e environment

> ***All E2E operations must be launched under the `./e2e` subdirectory***

The E2E environment consists of two parts: ETH1-related processes and ETH 2.0-related processes.

For ETH1 part: Ethereum single node (ganache), IPFS docker containers and Aragon Web App.

For ETH2 part: Beacon chain node, genesis validators machine, and, optionally, 2nd and 3rd peer beacon chain nodes.

To start the whole environment from predeployed snapshots, use:

```bash
./startup.sh -r -s
```

then go to [http://localhost:3000/#/lido-dao/](http://localhost:3000/#/lido-dao/) to manage the DAO via Aragon Web App.

> To completely repeat the compilation and deployment process in ETH1 chain, just omit the `-s` flag.

#### ETH1 part

As a result of the script execution, the following will be installed:

* the Deposit Contract instance;
* all Aragon App instances (contracts: Lido, NodeOperatorsRegistry, and LidoOracle)
* the Aragon PM for `lido.eth`;
* the Lido DAO template;
* and finally, the Lido DAO will be deployed.

To start only the ETH1 part, use:

```bash
./startup.sh -1
```

#### ETH2 part

To work with the ETH2 part, the ETH1 part must be running.

As a result of the script execution, the following will happen:

* the Beacon chain genesis config (Minimal with tunes) will be generated;
* validator's wallet with 4 keys will be generated;
* a deposit of 32 ETH will be made to the Deposit Contract for each validator key;
* based on the events about the deposit, a genesis block will be created, including validators;
* ETH2 node will start from the new Genesis block.

To reseat and restart only the ETH2 part, use:

```bash
./startup.sh -r2
```

##### Stop all

To stop, use:
> Note: this action permanently deletes all generated data

```bash
./shutdown.sh
```

### DKG

To build a DGK container:

 * Add your local SSH key to the Github account;
 * run `./dkg.sh` inside the `e2e` directory.

### Build & test all our apps

Run unit tests:

```bash
yarn test
```

Run E2E tests:

```bash
cd e2e
./dkg.sh
./startup.sh -r -s
yarn test:e2e
./shutdown.sh
```

Run unit tests and report gas used by each Solidity function:

```bash
yarn test:gas
```

Generate unit test coverage report:

```bash
yarn test:coverage
```

Test coverage is reported to `coverage.json` and `coverage/index.html` files located
inside each app's folder.

Keep in mind that the code uses `assert`s to check invariants that should always be kept
unless the code is buggy (in contrast to `require` statements which check pre-coditions),
so full branch coverage will never be reported until
[solidity-coverage#219] is implemented.

[solidity-coverage#219]: https://github.com/sc-forks/solidity-coverage/issues/269

## Deploying

Networks are defined in `buidler.config.js` file. To select the target network for deployment,
set `NETWORK_NAME` environment variable to a network name defined in that file. All examples
below assume `localhost` target network.

#### Network state file

Deployment scripts read their config from and store their results to a file called `deployed.json`,
located in the repo root. This file has the following structure and should always be committed:

```js
{
  "networks": {
    "1337": { // network id
      "networkName": "devnet", // serves as a comment
      // ...deployment results
    }
  }
}
```

When a script sees that some contract address is already defined in the network state file, it won't
re-deploy the same contract. This means that all deployment scripts are idempotent, you can call the
same script twice and the second call will be a nop.

You may want to specify some of the configuration options in `networks.<netId>` prior to running
deployment to avoid those values being set to default values:

* `owner` The address that everything will be deployed from.
* `ensAddress` The address of a ENS instance.
* `depositContractAddress` The address of the Beacon chain deposit contract (it will deployed otherwise).
* `daoInitialSettings` Initial settings of the DAO; see below.

You may specify any number additional keys inside any network state, they will be left intact by
deployment scripts.

#### DAO initial settings

Initial DAO settings can be specified pripr to deployment for the specific network in
`networks.<netId>.daoInitialSettings` field inside `deployed.json` file.

* `holders` Addresses of initial DAO token holders.
* `stakes` Initial DAO token balances of the holders.
* `tokenName` Name of the DAO token.
* `tokenSymbol` Symbol of the DAO token.
* `voteDuration` See [Voting app documentation].
* `votingSupportRequired` See [Voting app documentation].
* `votingMinAcceptanceQuorum` See [Voting app documentation].
* `depositIterationLimit` See [protocol levers documentation].

[Voting app documentation]: https://wiki.aragon.org/archive/dev/apps/voting
[protocol levers documentation]: /protocol-levers.md

An example of `deployed.json` file prepared for a testnet deployment:

```js
{
  "networks": {
    "5": {
      "networkName": "goerli",
      "depositContractAddress": "0x07b39f4fde4a38bace212b546dac87c58dfe3fdc",
      "owner": "0x3463dD800410965fdBeC2958085b1467CBd4aA31",
      "daoInitialSettings": {
        "holders": [
          "0x9be0D8ef365A7217c2313c3f33a71D5CeBea2686",
          "0x7B1F4c068b3E89Cc586c2f3656Bd95f56CA5B10A",
          "0x6244D856606c874DEAC61a61bd07698d47a6F6F2"
        ],
        "stakes": [
          "100000000000000000000",
          "100000000000000000000",
          "100000000000000000000"
        ],
        "tokenName": "Lido DAO Testnet Token",
        "tokenSymbol": "LDO",
        "voteDuration": 86400,
        "votingSupportRequired": "500000000000000000",
        "votingMinAcceptanceQuorum": "300000000000000000",
        "beaconSpec": {
          "epochsPerFrame": 225,
          "slotsPerEpoch": 32,
          "secondsPerSlot": 12,
          "genesisTime": 1605700807
        }
      }
    }
  }
}
```

#### Step 1: сompile the code

```bash
yarn compile
```

#### Step 2: deploy Aragon environment and core apps (optional)

This is required for test/dev networks that don't have Aragon environment deployed.

```bash
# ENS, APMRegistryFactory, DAOFactory, APMRegistry for aragonpm.eth, etc.
NETWORK_NAME=localhost yarn deploy:aragon-env

# Core Aragon apps: voting, vault, etc.
NETWORK_NAME=localhost yarn deploy:aragon-std-apps
```

#### Step 3: deploy Lido APM registry and DAO template

```bash
NETWORK_NAME=localhost yarn deploy:apm-and-template
```

#### Step 4: build and deploy Lido applications

```bash
NETWORK_NAME=localhost yarn deploy:apps
```

#### Step 5: deploy the DAO

```bash
NETWORK_NAME=localhost yarn deploy:dao
```

This step deploys `DepositContract` as well, if `depositContractAddress` is not specified
in `deployed.json`.

# License

2020 Lido <info@lido.fi>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the [GNU General Public License](LICENSE)
along with this program. If not, see <https://www.gnu.org/licenses/>.
