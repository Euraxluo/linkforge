"use client";
import {useEffect, useMemo, useState} from "react";
import * as React from "react";
import {useCurrentAccount, useSignAndExecuteTransaction, useSuiClient} from "@mysten/dapp-kit";
import {useLinkData} from "@/lib/link/useLinkData";
import {encodeData, extractDataFromURL, PreviewData} from "@/lib/utils";
import {useNetworkVariable} from "@/config/networkConfig";
import {isEqual} from "lodash";
import {Icon} from "@iconify-icon/react";
import Preview from "@/components/mint/Preview";
import LinksForm from "@/components/mint/LinksForm";
import SocialLinksForm from "@/components/mint/SocialLinksForm";
import ProfileForm from "@/components/mint/ProfileForm";
import CustomInput from "@/components/mint/CustomInput";
import CustomDropdown from "@/components/mint/CustomDropdown";
import {TransactionVisualizer} from "@/components/common/TransactionVisualizer";
import {Transaction} from "@mysten/sui/transactions";
import {Link} from "@/lib/utils";

function MintPage() {
    const [data, setData] = useState<PreviewData>({
        n: "",
        b: "",
        u: "",
        ls: [] as Link[],
        f: "",
        x: "",
        ig: "",
        e: "",
        gh: "",
        tg: "",
        w: "",
        y: "",
        lk: "",
        m: "",
    });
    // 原来的数据
    const [originalData, setOriginalData] = useState<PreviewData | null>(null);
    const [originalTemplate, setOriginalTemplate] = useState<string | null>(null);
    const [originalIdentify, setOriginalIdentify] = useState<string | null>(null);
    // 模板
    const [template, setTemplate] = useState('simple');
    const options = [
        {value: 'simple', label: 'Simple'},
        {value: 'dynamic', label: 'Dynamic'},
    ]
    // 用户id?
    const [customId, setCustomId] = React.useState('')
    const [isValid, setIsValid] = React.useState(true)
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-"
    const handleIdInputChange = (value: string) => {
        setCustomId(value)
        setIsValid(/^[A-Za-z0-9-]*$/.test(value))
    }
    // 链接数据hook
    const linkData = useLinkData();
    // 用于查询数据
    const client = useSuiClient();
    // 当前链接账号
    const currentAccount = useCurrentAccount();
    // 合约常量
    const linkforgePackageId = useNetworkVariable("linkforgePackageId");
    const linkforgeStoreObjectId = useNetworkVariable("linkforgeStoreObjectId");
    const amount = 1; // number of coin
    const coinDecimals = 9;// number of decimals

    const [isSigningTransaction, setIsSigningTransaction] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction({
        execute: async ({bytes, signature}) =>
            await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showObjectChanges: true,
                },
            }),
    });

    /**
     * 从当前用户的链接数据中获取link信息
     */
    const {template: extractedTemplate, data: extractedData} = useMemo(() => {
        if (linkData.linkData?.display?.link) {
            return extractDataFromURL(linkData.linkData.display.link);
        }
        return {template: "", data: null};
    }, [linkData.linkData?.display?.link]);
    useEffect(() => {
        if (extractedData && !isEqual(extractedData, data)) {
            setData(extractedData);
            setOriginalData(JSON.parse(JSON.stringify(extractedData)));
        }
    }, [extractedData,data]);
    useEffect(() => {
        if (extractedTemplate && !isEqual(extractedTemplate, template)) {
            setTemplate(extractedTemplate);
            setOriginalTemplate(extractedTemplate);
        }
    }, [extractedTemplate,template]);
    /**
     * 从当前用户的链接数据中获取id
     */
    const extractedIdentify = useMemo(() => {
        if (linkData.linkData?.display?.identify) {
            return linkData.linkData?.display?.identify;
        }
        return null;
    }, [linkData.linkData?.display?.identify]);
    useEffect(() => {
        if (extractedIdentify && !isEqual(customId, extractedIdentify)) {
            setCustomId(extractedIdentify);
            setOriginalIdentify(extractedIdentify);
        }
    }, [extractedIdentify,customId]);

    // 判断新数据和原始数据是否一样
    const hasChanges = () => {
        console.log("hasChanges")
        console.log("isEqual", isEqual(data, originalData))
        console.log("originalData", originalData)
        console.log("data", data)
        console.log("encodeData", encodeData(data))
        return !isEqual(data, originalData);
    };
    // 获取具有变化的fields
    const getChangedFields = () => {
        if (!originalData) return Object.keys(data);
        return Object.keys(data).filter(key => !isEqual(data[key as keyof PreviewData], originalData[key as keyof PreviewData]));
    };

    const prefillDemoData = () => {
        setData(
            {
                ls: [
                    {
                        l: "My Website",
                        i: "ph:globe-duotone",
                        u: "https://example.com",
                    },
                    {
                        l: "Amazon wishlist",
                        i: "ant-design:amazon-outlined",
                        u: "https://amazon.in",
                    },
                    {
                        l: "React JS",
                        i: "grommet-icons:reactjs",
                        u: "https://reactjs.org/",
                    },
                    {
                        l: "Donate for our cause",
                        i: "iconoir:donate",
                        u: "https://who.int",
                    },
                    {
                        l: "Download my resume",
                        i: "ph:file-pdf",
                        u: "https://google.com",
                    },
                ],
                n: "Example",
                b: "I'm Developer.",
                u: `${window.location.origin}/placeholder.svg`,
                f: "https://www.facebook.com/username",
                x: "https://x.com/username",
                ig: "https://www.instagram.com/username",
                e: "mail@username.cc",
                gh: "https://github.com/username",
                tg: "https://t.me/username",
                w: "+918888888888",
                y: "https://youtube.com/@username",
                lk: "https://linkedin.com/in/username",
                m: "https://mastodon.social/@username",
            }
        );
    };

    const preview = () => {
        const url = `${window.location.origin}/${template}?data=${encodeData(data)}`;
        try {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.focus();
        } catch {
            navigator.clipboard.writeText(url).then(() => {
                alert("Preview Link Copied to Clipboard,Please View in New Tab");
            });
        }
    };

    const forge = async () => {
        setIsSigningTransaction(true);
        if (!currentAccount) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!data.n || !data.u) {
            alert("Name and image URL are required.");
            setIsSigningTransaction(false);
            return;
        }

        const txb = new Transaction();
        txb.setGasBudget(1_000_000_000);
        txb.setSender(currentAccount.address);


        if (!originalData) {
            let creatLinkId = `0x${currentAccount.address.substring(2, 8)}${currentAccount.address.substring(currentAccount.address.length - 6)}`;
            const regex = new RegExp(`[^${allowedChars}]`, 'g');
            if (currentAccount && currentAccount.label) {
                creatLinkId = currentAccount.label.replace(regex, '');
            }
            if (customId) {
                creatLinkId = customId
            }
            console.log("creatLinkId", creatLinkId)
            // New link creation
            txb.moveCall({
                arguments: [
                    txb.pure.string(customId || creatLinkId),
                    txb.pure.string(data.n),
                    txb.pure.string(data.u),
                    txb.pure.string(encodeData(data)),
                    txb.object(linkforgeStoreObjectId),
                ],
                target: `${linkforgePackageId}::link::new`,
            });
            console.log("forge move call new")
        } else {
            if (!linkData.linkData) {
                alert("Link data not found");
                setIsSigningTransaction(false);
                return;
            }
            // Updating existing link
            const changedFields = getChangedFields();

            if (changedFields.length > 0) {
                txb.moveCall({
                    arguments: [
                        txb.object(linkData.linkData.objectId),
                        txb.pure.string(encodeData(data)),
                    ],
                    target: `${linkforgePackageId}::link::set_content`,
                });
                console.log("forge move call set_content")
            }

            if (changedFields.includes('n')) {
                txb.moveCall({
                    arguments: [
                        txb.object(linkData.linkData.objectId),
                        txb.pure.string(data.n),
                    ],
                    target: `${linkforgePackageId}::link::set_name`,
                });
                console.log("forge move call set_name")
            }

            if (changedFields.includes('u')) {
                txb.moveCall({
                    arguments: [
                        txb.object(linkData.linkData.objectId),
                        txb.pure.string(data.u),
                    ],
                    target: `${linkforgePackageId}::link::set_image_url`,
                });
                console.log("forge move call set_image_url")
            }

            if (template !== originalTemplate) {
                const [given_coin] = txb.splitCoins(txb.gas, [1 ** coinDecimals * amount]);
                txb.moveCall({
                    arguments: [
                        txb.object(linkData.linkData.objectId),
                        txb.pure.string(template),
                        txb.object(linkforgeStoreObjectId),
                        txb.object(given_coin),
                    ],
                    target: `${linkforgePackageId}::link::set_template`,
                });
                console.log("forge move call set_template")
            }
            if (customId && customId !== originalIdentify) {
                const [given_coin] = txb.splitCoins(txb.gas, [1 ** coinDecimals * amount]);
                txb.moveCall({
                    arguments: [
                        txb.object(linkData.linkData.objectId),
                        txb.object(linkforgeStoreObjectId),
                        txb.pure.string(customId),
                        txb.object(given_coin),
                    ],
                    target: `${linkforgePackageId}::link::set_identify`,
                });
                console.log("forge move call set_template")
            }
        }


        signAndExecuteTransaction(
            {
                transaction: txb,
            },
            {
                onSuccess: (result) => {
                    console.log('Transaction successful', result);
                    setTransactionHash(result.digest);
                    setIsSigningTransaction(false);
                },
                onError: (error) => {
                    console.error('Transaction failed', error);
                    alert(`Transaction failed: ${error.message}`);
                    setIsSigningTransaction(false);
                },
            },
        );
    };
    const updateData = (newData: PreviewData) => {
        setData(prevData => ({...prevData, ...newData}));
    };


    return (
        <div className="h-screen grid grid-cols-12 md:grid-cols-3 divide-x">
            <div className="col-span-8 md:col-span-2 h-screen flex flex-col bg-slate-100">
                <div className="border-t bg-white flex items-center">
                    <button
                        onClick={prefillDemoData}
                        className="h-12 flex items-center space-x-2 px-4 border-r text-xs font-medium bg-white text-slate-700"
                    >
                        <span className="hidden md:block">Add demo data</span>
                        <Icon icon="mdi:code-json" width={18} height={18}/>
                    </button>
                    <button
                        onClick={preview}
                        className="h-12 flex items-center space-x-2 px-4 border-r text-xs font-medium bg-white text-slate-700"
                    >
                        <span className="hidden md:block">Preview</span>
                        <Icon icon="ph:paper-plane-tilt-bold" width={18} height={18}/>
                    </button>
                    <div className="flex-1"></div>
                    {/*forge 按钮*/}
                    <button
                        onClick={forge}
                        disabled={!hasChanges() && !customId}
                        className="h-12 flex items-center space-x-2 px-4 border-r text-xs font-medium bg-white text-slate-700 disabled:opacity-50"
                    >
                        <span className="hidden md:block">
                          {originalData ? 'Update' : 'Forge'}
                        </span>
                        <Icon icon="icon-park:gavel" width={24} height={24}/>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-8 pt-2 mb-4">
                    <div className="sm:overflow-hidden sm:rounded-md shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-white px-2 py-2 sm:p-2">
                            <CustomInput
                                value={customId}
                                onChange={handleIdInputChange}
                                isValid={isValid}
                                placeholder="Enter custom ID"
                            />
                            <CustomDropdown
                                options={options}
                                value={template}
                                onChange={setTemplate}
                                placeholder="Select a template"
                            />
                        </div>
                    </div>
                    <div className="py-1 sm:py-1" aria-hidden="true">
                        <div className="hidden sm:block sm:py-1">
                            <div className="border-t border-gray-200"></div>
                        </div>
                    </div>
                    <ProfileForm data={data} updateData={updateData}/>
                    <div className="py-2 sm:py-5" aria-hidden="true">
                        <div className="hidden sm:block sm:py-5">
                            <div className="border-t border-gray-200"></div>
                        </div>
                    </div>
                    <SocialLinksForm data={data} updateData={updateData}/>
                    <div className="py-2 sm:py-5" aria-hidden="true">
                        <div className="hidden sm:block sm:py-5">
                            <div className="border-t border-gray-200"></div>
                        </div>
                    </div>
                    <LinksForm data={{ls: data.ls || []}} updateData={updateData}/>
                </div>
            </div>
            {transactionHash ?
                <TransactionVisualizer
                    isSigningTransaction={isSigningTransaction}
                    transactionHash={transactionHash}
                    onClose={() => {
                        setTransactionHash(null)
                    }}
                /> : <></>
            }
            <Preview data={data} template={template}/>
        </div>
    );
}

export default MintPage;