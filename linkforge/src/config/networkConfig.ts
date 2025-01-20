export const TESTNET_LINK_PACKAGE_ID =
    "0xd68f52b5ce73079310513198b1825efe52cf8eb5b39c6f0b2af1c077f1a96ab9";
export const TESTNET_LINK_STORE_OBJECT_ID =
    "0x6a69a744f684ba158a85e4bc0c68b316eed8d710eafb681db86c1b51a79b8c40";


export const NETWORK = 'testnet'


import {getFullnodeUrl} from '@mysten/sui/client';
import {createNetworkConfig, NetworkConfig} from "@mysten/dapp-kit";

// 定义具体的 Variables 类型
interface Variables {
    linkforgePackageId: string;
    linkforgeStoreObjectId: string;
}

const {networkConfig, useNetworkVariable, useNetworkVariables} =
    createNetworkConfig({
        // localnet: {url: getFullnodeUrl('localnet')},
        // devnet: {url: getFullnodeUrl('devnet')},
        // mainnet: {url: getFullnodeUrl('mainnet')},
        testnet: {
            url: getFullnodeUrl('testnet'),
            variables: {
                linkforgePackageId: TESTNET_LINK_PACKAGE_ID,
                linkforgeStoreObjectId: TESTNET_LINK_STORE_OBJECT_ID,
            }
        },
    } as Record<string, NetworkConfig<Variables>>);

export {useNetworkVariable, useNetworkVariables, networkConfig};
