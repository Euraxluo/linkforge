"use client";

import {useCurrentAccount} from "@mysten/dapp-kit";
import {useLinkData} from "@/lib/link/useLinkData";
import {ConnectButton, Connector} from "@ant-design/web3";

function SiteConnectButton() {
    const {linkData} = useLinkData();
    const currentAccount = useCurrentAccount();

    const buttonClasses = `
    flex items-center space-x-2 px-4 py-2 rounded-lg border-0
    bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400
    hover:from-blue-500 hover:via-cyan-100 hover:to-teal-500
    text-white font-medium text-sm
    shadow-lg shadow-cyan-900/30 hover:shadow-cyan-100/50
    transition-all duration-300 ease-in-out hover:scale-105`;

    return (
        <Connector>
            {linkData && currentAccount ? (
                <ConnectButton
                    avatar={{
                        src: linkData?.display.image_url,
                    }}
                    account={{
                        address: linkData?.display.creator,
                        name: linkData?.display.name,
                    }}
                    actionsMenu={{
                        extraItems: [{
                            key: '1',
                            label: 'Go to Link',
                            onClick: () => {
                                if (currentAccount && linkData?.display.link) {
                                    window.open(linkData.display.link, '_blank')?.focus();
                                } else {
                                    alert("Not Connected or No link found");
                                }
                            }
                        }]
                    }}
                    className={buttonClasses}
                />
            ) : (
                <ConnectButton className={buttonClasses}/>
            )}
        </Connector>
    );
}

export default SiteConnectButton;