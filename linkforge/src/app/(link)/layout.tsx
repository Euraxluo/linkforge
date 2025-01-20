"use client";
import React from "react";
import {Suiet, SuiWallet, SuiWeb3ConfigProvider} from "@ant-design/web3-sui";
import {NETWORK, networkConfig} from "@/config/networkConfig";


export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <SuiWeb3ConfigProvider
            wallets={[Suiet(), SuiWallet()]}
            networkConfig={networkConfig}
            sns={true}
            autoConnect={true}
            defaultNetwork={NETWORK}
        >
            {children}
        </SuiWeb3ConfigProvider>
    )
}