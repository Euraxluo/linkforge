"use client";

import React from "react";
import {AnimatePresence} from 'framer-motion';
import SiteBackground from "@/components/layout/SiteBackground";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import {Suiet, SuiWallet, SuiWeb3ConfigProvider} from "@ant-design/web3-sui";
import {NETWORK, networkConfig} from "@/config/networkConfig";

export default function LinkForge({children}: { children: React.ReactNode }) {
    return (
        <SuiWeb3ConfigProvider
            wallets={[Suiet(), SuiWallet()]}
            networkConfig={networkConfig}
            sns={true}
            autoConnect={true}
            defaultNetwork={NETWORK}
        >
            <div
                className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 text-white relative overflow-hidden">
                <SiteBackground/>
                <SiteHeader/>
                <main className="container mx-auto px-4 py-4 relative z-10 min-h-[calc(100vh-64px-80px)]">
                    <AnimatePresence mode="wait">
                        {children}
                    </AnimatePresence>
                </main>
                <SiteFooter/>
            </div>
        </SuiWeb3ConfigProvider>
    );
}