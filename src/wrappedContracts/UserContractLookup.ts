import { GeneralFunctions, SpecialTx, SearchLog, getClientVersion } from './GeneralFunctions';
import Web3 = require('web3');
import UserContractLookupJSON from '../../build/contracts/UserContractLookup.json';

export class UserContractLookup extends GeneralFunctions {
    web3: Web3;
    buildFile = UserContractLookupJSON;

    constructor(web3: Web3, address?: string) {
        super(
            address
                ? new web3.eth.Contract(UserContractLookupJSON.abi, address)
                : new web3.eth.Contract(
                      UserContractLookupJSON.abi,
                      (UserContractLookupJSON as any).networks.length > 0
                          ? UserContractLookupJSON.networks[0]
                          : null
                  )
        );
        this.web3 = web3;
    }

    async getAllLogChangeOwnerEvents(eventFilter?: SearchLog) {
        let filterParams;
        if (eventFilter) {
            filterParams = {
                fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest'
            };
            if (eventFilter.topics) {
                filterParams.topics = eventFilter.topics;
            }
        } else {
            filterParams = {
                fromBlock: 0,
                toBlock: 'latest'
            };
        }

        return await this.web3Contract.getPastEvents('LogChangeOwner', filterParams);
    }

    async getAllEvents(eventFilter?: SearchLog) {
        let filterParams;
        if (eventFilter) {
            filterParams = {
                fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest',
                topics: eventFilter.topics ? eventFilter.topics : [null]
            };
        } else {
            filterParams = {
                fromBlock: 0,
                toBlock: 'latest',
                topics: [null]
            };
        }

        return await this.web3Contract.getPastEvents('allEvents', filterParams);
    }

    async update(_userRegistry: string, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.update(_userRegistry);
        const transactionParams = await this.buildTransactionParams(method, txParams);

        if (transactionParams.privateKey !== '') {
            return await this.sendRaw(this.web3, transactionParams.privateKey, transactionParams);
        } else {
            return await this.web3Contract.methods
                .update(_userRegistry)
                .send({
                    from: transactionParams.from,
                    gas: transactionParams.gas,
                    gasPrice: transactionParams.gasPrice
                });
        }
    }

    async userRegistry(txParams?: SpecialTx) {
        return await this.web3Contract.methods.userRegistry().call(txParams);
    }

    async owner(txParams?: SpecialTx) {
        return await this.web3Contract.methods.owner().call(txParams);
    }

    async changeOwner(_newOwner: string, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.changeOwner(_newOwner);
        const transactionParams = await this.buildTransactionParams(method, txParams);

        if (transactionParams.privateKey !== '') {
            return await this.sendRaw(this.web3, transactionParams.privateKey, transactionParams);
        } else {
            return await this.web3Contract.methods
                .changeOwner(_newOwner)
                .send({
                    from: transactionParams.from,
                    gas: transactionParams.gas,
                    gasPrice: transactionParams.gasPrice
                });
        }
    }

    async init(_userRegistry: string, _db: string, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.init(_userRegistry, _db);
        const transactionParams = await this.buildTransactionParams(method, txParams);

        if (transactionParams.privateKey !== '') {
            return await this.sendRaw(this.web3, transactionParams.privateKey, transactionParams);
        } else {
            return await this.web3Contract.methods
                .init(_userRegistry, _db)
                .send({
                    from: transactionParams.from,
                    gas: transactionParams.gas,
                    gasPrice: transactionParams.gasPrice
                });
        }
    }
}
