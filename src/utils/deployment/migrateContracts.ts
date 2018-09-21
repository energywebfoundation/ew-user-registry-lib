import { Sloffle } from 'sloffle';
import Web3Type from '../../types/web3';
import { UserContractLookup } from '../..';
import * as fs from 'fs';

export async function migrateUserRegistryContracts(web3: Web3Type): Promise<JSON> {
    return new Promise<any>(async (resolve, reject) => {

        const configFile = JSON.parse(fs.readFileSync(process.cwd() + '/connection-config.json', 'utf8'));

        const sloffle = new Sloffle((web3 as any));

        const privateKeyDeployment = configFile.develop.deployKey.startsWith('0x') ?
            configFile.develop.deployKey : '0x' + configFile.develop.deployKey;

        const userContractLookupWeb3 = await sloffle.deploy(
            './solidity_modules/ew-user-registry-contracts/dist/UserContractLookup.json',
            [],
            { privateKey: privateKeyDeployment },
        );

        const userLogicWeb3 = await sloffle.deploy(
            './solidity_modules/ew-user-registry-contracts/dist/UserLogic.json',
            [userContractLookupWeb3._address],
            { privateKey: privateKeyDeployment },
        );

        const userDbWeb3 = await sloffle.deploy(
            './solidity_modules/ew-user-registry-contracts/dist/UserDB.json',
            [userLogicWeb3._address],
            { privateKey: privateKeyDeployment },
        );

        const userContractLookup = new UserContractLookup((web3 as any), userContractLookupWeb3._address);
        await userContractLookup.init(
            userLogicWeb3._address, userDbWeb3._address,
            { privateKey: privateKeyDeployment },
        );

        resolve(sloffle.deployedContracts);
    });
}
