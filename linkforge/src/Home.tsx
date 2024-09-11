import {motion, AnimatePresence, Variants} from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import {useEffect, useState, useCallback, useRef} from "react";
import * as React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {
    Fish,
    Shell,
    Waves,
    ArrowRight,
    X,
    CirclePlus,
    GripVertical,
    LoaderPinwheel,
    CircleFadingArrowUp
} from 'lucide-react'
import {Icon} from '@iconify-icon/react';
import Cropper from 'react-easy-crop'
import {Point, Area} from 'react-easy-crop/types'
import {encodeData, generateSocialIcons, Link, PreviewData} from "./utils";
import {WalrusClient} from 'tuskscript'
import {useNetworkVariable} from "./networkConfig";
import {ConnectButton, Connector, NFTCard, NFTImage} from "@ant-design/web3";
import {useCurrentAccount, useSuiClient, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {getOwnedObjects} from "./client";
import UserWidget from "./link/avatar";
import {useLinkData} from "./link/useLinkData";

interface SeaCreature {
    id: number
    icon: string
    x: number
    y: number
    size: number
}

const SeaCreature: React.FC<SeaCreature> = ({icon, x, y, size}) => {
    return (
        <motion.div
            className="absolute text-white opacity-30"
            style={{left: `${x}%`, top: `${y}%`}}
            animate={{
                x: [0, Math.random() * 20 - 10],
                y: [-10, Math.random() * 20 - 10],
                rotate: [0, Math.random() * 360],
            }}
            transition={{
                y: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                },
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
        >
            <Icon icon={icon} width={size} height={size}/>
        </motion.div>
    )
}
const WaveBackground: React.FC = () => {
    return (
        <svg className="absolute inset-1 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path
                d="M0 50 Q250 0 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z"
                fill="rgba(255, 255, 255, 0.1)"
                animate={{
                    d: [
                        "M0 50 Q250 0 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z",
                        "M0 50 Q250 100 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 8,
                    ease: "easeInOut",
                }}
            />

            <motion.path
                d="M0 150 Q250 0 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z"
                fill="rgba(255, 255, 255, 0.1)"
                animate={{
                    d: [
                        "M0 150 Q250 60 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z",
                        "M0 150 Q250 150 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    ease: "easeInOut",
                }}
            />
        </svg>
    )
}

const features = [
    {
        icon: Waves,
        title: "Dynamic Links Generator",
        description: "Create unique links patterns as your SBT, link to OG images that update automatically."
    },
    {
        icon: Fish,
        title: "Link to Aquatic Creature",
        description: "Access underwater creatures as Sui object, Coral reef can link all objects together, startup on linkforge."
    },
    {
        icon: Shell,
        title: "Metadata as Dynamic OG",
        description: "Generate beautiful OG images based on metadata to display your SBT, build on Sui of full-chain."
    }
]
const FeatureGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="bg-white bg-opacity-40 p-6 rounded-lg backdrop-blur-sm
                     transform transition duration-300 ease-in-out
                     hover:skew-y-1 hover:scale-105 hover:shadow-lg hover:hue-rotate-15
                     active:scale-95
                     cursor-pointer"
                >
                    <feature.icon className="text-4xl mb-4"/>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                </div>
            ))}
        </div>
    )
}


interface TableActionProps {
    value: string;
    active: boolean;
    children: React.ReactNode
}

const TabTrigger: React.FC<TableActionProps> = ({value, active, children}: TableActionProps) => {
    return (
        <Tabs.Trigger
            value={value}
            className={`
        flex-1 px-4 py-2 text-center transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50
        ${active
                ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
        ${value === 'og' ? 'rounded-tl-lg' : 'rounded-tr-lg'}
      `}
        >
            {children}
        </Tabs.Trigger>
    )
}

interface HomeSectionProps {
    setActiveSection: (section: string) => void
}

function HomeSection({setActiveSection}: HomeSectionProps) {
    const [activeTab, setActiveTab] = useState('og')
    return (
        <motion.div
            key="home"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.5}}
        >
            <h1 className="text-5xl font-bold text-center mb-8">
                Forge Powerful Links as SBT
            </h1>
            <p className="text-xl text-center mb-12">
                Create stunning link-themed SBT with OG images and metadata for your with ease
            </p>

            <FeatureGrid/>

            <Tabs.Root
                defaultValue="og"
                className="bg-white mb-12 text-gray-800 rounded-lg shadow-lg overflow-hidden"
                onValueChange={setActiveTab}
            >
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
                    <TabTrigger value="og" active={activeTab === 'og'}>
                        OG Image Generator
                    </TabTrigger>
                    <TabTrigger value="nft" active={activeTab === 'nft'}>
                        NFT Metadata
                    </TabTrigger>
                </Tabs.List>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.2}}
                    >
                        <Tabs.Content value="og" className="p-4">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-1/2">
                                    <motion.h3
                                        className="text-lg font-semibold mb-2"
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.1}}
                                    >
                                        Create Eye-Catching OG Images
                                    </motion.h3>
                                    <motion.p
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.2}}
                                    >
                                        Design and generate Open Graph images that make your NFTs stand out on social
                                        media and marketplaces.
                                    </motion.p>
                                </div>
                                <motion.div
                                    className="w-1/2"
                                    initial={{opacity: 0, scale: 0.9}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{delay: 0.3}}
                                >
                                    <div className="bg-gray-200 p-4 rounded-lg">
                                        <div className="bg-white p-4 rounded shadow-inner">
                                            <div
                                                className="inline-flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full align-middle bg-violet-100 text-violet-500 text-3xl font-medium">
                                                NFT
                                            </div>
                                            <h4 className="text-lg font-bold mt-2">Amazing NFT Collection</h4>
                                            <p className="text-sm text-gray-600">Discover unique digital assets</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="nft" className="p-4">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-1/2">
                                    <motion.h3
                                        className="text-lg font-semibold mb-2"
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.1}}
                                    >
                                        Streamline NFT Metadata Creation
                                    </motion.h3>
                                    <motion.p
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.2}}
                                    >
                                        Easily generate and manage metadata for your NFT collections, ensuring
                                        compatibility with major marketplaces.
                                    </motion.p>
                                </div>
                                <motion.div
                                    className="w-1/2"
                                    initial={{opacity: 0, scale: 0.9}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{delay: 0.3}}
                                >
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify({
                      name: "Awesome NFT #1",
                      description: "A unique digital asset",
                      image: "https://example.com/nft1.png",
                      attributes: [
                          {trait_type: "Background", value: "Blue"},
                          {trait_type: "Eyes", value: "Green"},
                          {trait_type: "Mouth", value: "Smile"}
                      ]
                  }, null, 2)}
                </pre>
                                </motion.div>
                            </div>
                        </Tabs.Content>
                    </motion.div>
                </AnimatePresence>
            </Tabs.Root>

            <div
                className="text-center transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95">
                <button
                    onClick={() => setActiveSection('mint')}
                    className="px-6 py-3 bg-slate-50 text-purple-600 rounded-full text-lg font-semibold
                   hover:bg-blue-100 transition-colors duration-200
                   flex items-center justify-center mx-auto
                   focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                >
                    Start Minting Now
                    <ArrowRight className="ml-2"/>
                </button>
            </div>

        </motion.div>
    )
}

export default function LinkForge() {
    const [activeSection, setActiveSection] = useState('home')
    const [seaCreatures, setSeaCreatures] = useState<SeaCreature[]>([])
    useEffect(() => {
        const creatures = [
            {icon: "emojione-v1:fish", count: 30, minSize: 24, maxSize: 24},
            {icon: "openmoji:jellyfish", count: 10, minSize: 32, maxSize: 48},
            {icon: "emojione-v1:octopus", count: 10, minSize: 32, maxSize: 48},
            {icon: "openmoji:crab", count: 10, minSize: 24, maxSize: 48},
            {icon: "fa-solid:disease", count: 10, minSize: 24, maxSize: 48},
            {icon: "fluent-emoji:whale", count: 2, minSize: 48, maxSize: 192},
            {icon: "streamline-emojis:anchor", count: 1, minSize: 48, maxSize: 96},
        ]

        const newCreatures = creatures.flatMap(({icon, count, minSize, maxSize}) =>
            Array.from({length: count}, (_, i) => ({
                id: Math.random(),
                icon,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * (maxSize - minSize) + minSize,
            }))
        )
        setSeaCreatures(newCreatures)
    }, [])

    const {linkData} = useLinkData()
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 text-white relative overflow-hidden">
            {/*bg*/}
            <WaveBackground/>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {seaCreatures.map((creature) => (
                    <SeaCreature key={creature.id} {...creature} />
                ))}
            </div>
            <header className="bg-blue-600 bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex justify-between items-center">
                        {/*logo*/}
                        <div
                            className="text-2xl font-bold flex items-center transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
                            onClick={() => setActiveSection('home')}
                        >
                            <Icon icon="game-icons:coral"
                                  className="fill-emerald-400 mr-2 stroke-emerald-400 stroke-[10px] hover:stroke-emerald-400 hover:stroke-[4px]"/>
                            LinkForge
                        </div>

                        {/*menu*/}
                        <div className="space-x-4">

                            <button
                                onClick={() => setActiveSection('home')}
                                className="hover:underline transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveSection('mint')}
                                className="hover:underline transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                            >
                                Mint
                            </button>
                            <button
                                className="hover:underline transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                            >
                                <UserWidget
                                    customColors={{
                                        from: 'from-blue-600',
                                        to: 'to-yellow-500',
                                        text: 'text-white',
                                        hover: 'hover:from-blue-600 hover:to-yellow-600'
                                    }}
                                    size="sm"
                                    rounded="lg"
                                />
                            </button>


                            <Connector>
                                <ConnectButton
                                    avatar={{
                                        src: linkData?.display.image_url,
                                    }}
                                />
                            </Connector>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-2 py-4 relative z-10 min-h-[calc(100vh-64px-80px)]">
                <AnimatePresence mode="wait">
                    {activeSection === 'home' && (
                        <HomeSection setActiveSection={setActiveSection}/>
                    )}
                    {activeSection === 'mint' && (
                        <MintSection/>
                    )}
                </AnimatePresence>
            </main>

            <footer className="bg-blue-800 bg-opacity-50 backdrop-blur-md text-white mt-12 py-8 sticky bottom-0 z-40">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 LinkForge. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

function MintSection() {
    const [data, setData] = useState<PreviewData>({
        n: "",
        b: "",
        u: "",
        ls: [],
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

    const updateData = (newData) => {
        setData({...data, ...newData});
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
        const url = `${window.location.origin}/#/dynamic?data=${encodeData(data)}`;
        // 检查是否支持 window.open
        if (window.open) {
            window.open(url, '_blank').focus();
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert("Preview Link Copied to Clipboard,Please View in New Tab");
            });
        }
    };


    const [quantity, setQuantity] = useState(2); // number of red packets

    const [amount, setAmount] = useState(1); // number of coin
    const [coinType, setCoinType] = useState("0x2::sui::SUI");
    const [coinDecimals, setCoinDecimals] = useState(9);

    const client = useSuiClient();
    const currentAccount = useCurrentAccount();

    const linkforgePackageId = useNetworkVariable("linkforgePackageId");
    const linkforgeStoreObjectId = useNetworkVariable("linkforgeStoreObjectId");
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


    const forge = () => {
        if (!currentAccount) {
            alert("Please connect your wallet first.");
            return;
        }
        // 铸造,判断钱包是否正确链接,链接是否正确,是否有足够的余额
        const txb = new Transaction();
        txb.setGasBudget(1_000_000_000)
        txb.setSender(currentAccount?.address as string);
        // const [given_coin] = txb.splitCoins(txb.gas, [10 ** coinDecimals * amount]);
        txb.moveCall({
            arguments: [
                txb.pure.string(data.n),
                txb.pure.string(data.n),
                txb.pure.string(data.u),
                txb.pure.string(encodeData(data)),
                txb.object(linkforgeStoreObjectId),
            ],
            target: `${linkforgePackageId}::link::new`,
        });
        signAndExecuteTransaction(
            {
                transaction: txb,
            },
            {
                onSuccess: (result) => {
                    console.log('object changes', result.objectChanges);
                    alert(result.digest);
                },
            },
        );
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
                    <button
                        onClick={forge}
                        className="h-12 flex items-center space-x-2 px-4 border-r text-xs font-medium bg-white text-slate-700"
                    >
                        <span className="hidden md:block">Forge</span>
                        <Icon icon="icon-park:gavel" width={24} height={24}></Icon>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
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
                    <LinksForm data={data} updateData={updateData}/>
                </div>
            </div>
            <Preview data={data}/>
        </div>
    );
}

const EnhancedAddButton = ({onClick}: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false)

    const buttonVariants = {
        initial: {scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)'},
        hover: {scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'},
    }

    const iconVariants = {
        initial: {rotate: 0},
        hover: {rotate: 180},
    }

    const particleVariants = {
        initial: {opacity: 0, scale: 0},
        animate: {opacity: 1, scale: 1},
        exit: {opacity: 0, scale: 0},
    }

    return (
        <motion.button
            onClick={onClick}
            className="mt-4 relative flex justify-center items-center border-2 text-blue-500 border-blue-300 bg-white rounded-lg w-full py-3 overflow-hidden"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute inset-0 bg-blue-100"
                initial={{scaleX: 0}}
                animate={{scaleX: isHovered ? 1 : 0}}
                transition={{duration: 0.3}}
                style={{originX: 0}}
            />
            <motion.div className="relative z-10 flex items-center justify-center">
                <motion.div
                    variants={iconVariants}
                    transition={{duration: 0.3}}
                    style={{transformOrigin: 'center'}}
                >
                    <CirclePlus className="w-6 h-6"/>
                </motion.div>
            </motion.div>
            {isHovered && (
                <>
                    {[...Array(8)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute w-2 h-2 bg-blue-300 rounded-full"
                            variants={particleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{duration: 0.5, delay: index * 0.05}}
                            style={{
                                top: `${50 + 40 * Math.sin((index / 8) * Math.PI * 2)}%`,
                                left: `${50 + 40 * Math.cos((index / 8) * Math.PI * 2)}%`,
                            }}
                        />
                    ))}
                </>
            )}
        </motion.button>
    )
}
const EnhancedUploadButton = ({onClick, uploading}: { onClick: () => void; uploading: boolean }) => {
    const [isHovered, setIsHovered] = useState(false)

    const buttonVariants = {
        initial: {scale: 1},
        hover: {scale: 1.05},
    }

    const waveVariants = {
        animate: {
            x: [0, -100],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 5,
                    ease: "linear",
                },
            },
        },
    }

    const glowVariants: Variants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    }

    const bubbleVariants = {
        initial: {y: 0, opacity: 0},
        animate: {y: -100, opacity: [0, 1, 0]},
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={uploading}
            className="relative flex  py-2 w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-75"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Ocean gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400"/>

            {/* Animated waves */}
            <motion.div
                className="absolute inset-0"
                variants={waveVariants}
                animate="animate"
            >
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJNMCAyMGMyMCAwIDIwLTE1IDQwLTE1czIwIDE1IDQwIDE1IDIwLTE1IDQwLTE1IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmUpIi8+PC9zdmc+')]"/>
            </motion.div>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 bg-white opacity-20 blur-md animate-glow"
                variants={glowVariants}
                animate="animate"
            />

            {/* Content */}
            <div
                className="relative z-10 flex items-center justify-center w-full h-full text-white font-semibold text-lg">
                {uploading ? (
                    <LoaderPinwheel className="w-6 h-6 animate-spin"/>
                ) : (
                    <CircleFadingArrowUp className="w-6 h-6"/>
                )}
                <span className="ml-2">{uploading ? 'Uploading...' : 'Upload'}</span>
            </div>

            {/* Bubble animation */}
            <AnimatePresence>
                {(isHovered || uploading) && (
                    <>
                        {[...Array(10)].map((_, index) => (
                            <motion.div
                                key={index}
                                className="absolute bottom-0 bg-white rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 10 + 5}px`,
                                    height: `${Math.random() * 10 + 5}px`,
                                }}
                                variants={bubbleVariants}
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </motion.button>
    )
}

function LinksForm({data, updateData}) {
    const handleChange = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...data.ls]
        newLinks[index][field] = value
        updateData({ls: newLinks})
    }

    const addLink = () => {
        updateData({ls: [...data.ls, {i: '', l: '', u: ''}]})
    }

    const removeLink = (index: number) => {
        const newLinks = [...data.ls]
        newLinks.splice(index, 1)
        updateData({ls: newLinks})
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const newLinks = Array.from(data.ls);
        const [reorderedItem] = newLinks.splice(result.source.index, 1);
        newLinks.splice(result.destination.index, 0, reorderedItem);

        updateData({ls: newLinks});
    };
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"links"}>
                    {(provided) => (
                        <div {...provided.droppableProps}
                             ref={provided.innerRef}
                        >
                            {data.ls.map((link, index) => (
                                <Draggable key={`link-${index}`} draggableId={`link-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="relative mb-6 group"
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="absolute top-2 -left-8 cursor-move"
                                            >
                                                <GripVertical className="h-6 w-6 text-slate-500"/>
                                            </div>
                                            <button
                                                onClick={() => removeLink(index)}
                                                className="hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-slate-300 text-slate-600 absolute -right-3 -top-3"
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`iconKey-${index}`}>
                                                                Icon Key (optional)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="icon"
                                                                id={`iconKey-${index}`}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                value={link.i}
                                                                onChange={(e) => handleChange(index, 'i', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`label-${index}`}>
                                                                Label
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id={`label-${index}`}
                                                                value={link.l}
                                                                onChange={(e) => handleChange(index, 'l', e.target.value)}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`url-${index}`}>
                                                                URL
                                                            </label>
                                                            <input
                                                                type="url"
                                                                id={`url-${index}`}
                                                                value={link.u}
                                                                onChange={(e) => handleChange(index, 'u', e.target.value)}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <EnhancedAddButton onClick={addLink}/>
        </div>
    )
}

interface SocialMedia {
    key: string
    name: string
    icon: string
    placeholder: string
}

function SocialLinksForm({data, updateData}: { data: PreviewData, updateData: (data: Partial<PreviewData>) => void }) {
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const clearButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const handleChange = (e) => {
        updateData({[e.target.name]: e.target.value});
    };

    const handleInputBlur = (name: string, e: React.FocusEvent) => {
        if (e.relatedTarget !== clearButtonRefs.current[name]) {
            setFocusedField(null)
        }
    }
    const clearInput = (name: string) => {
        updateData({[name]: ''});
    };
    const socialMedias: SocialMedia[] = [
        {
            key: 'f',
            name: 'Facebook',
            icon: "ph:facebook-logo-duotone",
            placeholder: 'https://fb.com/username',
        },
        {
            key: 'x',
            name: 'X',
            icon: "ph:x-logo-duotone",
            placeholder: 'https://x.com/username',
        },
        {
            key: 'ig',
            name: 'Instagram',
            icon: "ph:instagram-logo-duotone",
            placeholder: 'https://instagram.com/username',
        },
        {
            key: 'gh',
            name: 'Github',
            icon: "ph:github-logo-duotone",
            placeholder: 'https://github.com/username',
        },
        {
            key: 'tg',
            name: 'Telegram',
            icon: "ph:telegram-logo-duotone",
            placeholder: 'https://t.me/username',
        },
        {
            key: 'lk',
            name: 'LinkedIn',
            icon: "ph:linkedin-logo-duotone",
            placeholder: 'https://linkedin.com/in/username',
        },
        {
            key: 'e',
            name: 'Email',
            icon: "ph:envelope-duotone",
            placeholder: 'email@example.com',
        },
        {
            key: 'y',
            name: 'Youtube',
            icon: "ph:youtube-logo-duotone",
            placeholder: 'https://youtube.com/username',
        },
        {
            key: 'w',
            name: 'Whatsapp',
            icon: "ph:whatsapp-logo-duotone",
            placeholder: '+1234567890',
        },
        {
            key: 'm',
            name: 'Mastodon',
            icon: "ph:mastodon-logo-duotone",
            placeholder: 'https://mastodon.social/@username',
        }
    ]

    return (
        <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 bg-white px-4 py-4 sm:p-6">
                {socialMedias.map(sm => (
                    <div key={sm.key} className="mb-4">
                        <label htmlFor={sm.key} className="block text-sm font-normal text-gray-700 mb-1">
                            {sm.name}
                        </label>
                        <div className="mt-1 flex relative rounded-md shadow-sm">
                            <span
                                className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                                <Icon icon={sm.icon} width={20} height={20}></Icon>
                            </span>
                            <input
                                name={sm.key}
                                id={sm.key}
                                type="text"
                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={sm.placeholder}
                                value={data[sm.key] || ''}
                                onChange={handleChange}
                                onFocus={() => setFocusedField(sm.key)}
                                onBlur={(e) => handleInputBlur(sm.key, e)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                {focusedField === sm.key && data[sm.key] && (
                                    <button
                                        type="button"
                                        ref={el => clearButtonRefs.current[sm.key] = el}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs rounded text-blue-600 hover:text-blue-800 focus:outline-none"
                                        onClick={() => clearInput(sm.key)}>
                                        <X className="h-4 w-4 stroke-[4px]"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


function ProfileForm({data, updateData}: { data: PreviewData, updateData: (data: PreviewData) => void }) {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({...data, [e.target.name]: e.target.value});
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileUpload = (file: File) => {
        if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            alert('File size should not exceed 10MB');
        }
    };


    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleFileUpload(file)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };
    const handleUpload = async () => {
        if (!image || !croppedAreaPixels) {
            return;
        }

        const client = new WalrusClient();

        try {
            setUploading(true);
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);

            if (croppedImage) {
                const imageBlob = new Blob([croppedImage], {type: 'image/jpeg'});
                const result = await client.store(imageBlob, {contentType: 'image/jpeg'});
                if ('newlyCreated' in result) {
                    updateData({
                        ...data,
                        u: `https://aggregator-devnet.walrus.space/v1/${result.newlyCreated.blobObject.blobId as string}`
                    })
                } else if ('alreadyCertified' in result) {
                    updateData({
                        ...data,
                        u: `https://aggregator-devnet.walrus.space/v1/${result.alreadyCertified.blobId as string}`
                    })
                }

            }
        } catch (e: any) {
            console.error(e);
        } finally {
            setUploading(false);
            setImage(null); // Clear the image after upload
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    id="name"
                    name="n"
                    value={data.n}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About yourself</label>
                <textarea
                    id="about"
                    name="b"
                    value={data.b}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                    type="text"
                    id="photoUrl"
                    name="u"
                    value={data.u}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div
                className={`relative h-64 w-full mb-4 border-2 border-dashed rounded-lg ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDoubleClick={handleClick}
            >
                {image ? (
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            Drag and drop an image here, or double click to select a file
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                    }}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            {image && (
                <EnhancedUploadButton
                    onClick={handleUpload}
                    uploading={uploading}
                />
            )}
        </div>
    );
}

interface PreviewProps {
    data: PreviewData;
}

function Preview({data}: PreviewProps) {
    const socialIcons = generateSocialIcons(data);
    const allSocialLinksAreEmpty = socialIcons.every(icon => !icon.link);

    return (
        <motion.div
            className="h-screen grid place-items-center"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <motion.div
                className="w-[150px] h-[512px] md:w-[340px] md:h-[729px] overflow-hidden rounded-[3rem] ring-8 ring-slate-800 bg-white shadow-xl"
                initial={{scale: 0.9, y: 50}}
                animate={{scale: 1, y: 0}}
                transition={{type: "spring", stiffness: 260, damping: 20}}
            >
                <div className="h-full overflow-y-auto">
                    <main className="p-4 bg-white w-full space-y-8 pt-12 max-w-lg mx-auto min-h-full">
                        <motion.div
                            className="text-center"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2, duration: 0.5}}
                        >
                            {data.u && (
                                <motion.div
                                    className="h-20 w-20 rounded-full overflow-hidden ring ring-slate-200 mx-auto"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <img src={data.u} alt={data.n || 'Profile'}
                                         className="h-full w-full object-cover"/>
                                </motion.div>
                            )}
                            {data.n && (
                                <motion.h1
                                    className="text-2xl font-bold mt-4 text-slate-800"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.4, duration: 0.5}}
                                >
                                    {data.n}
                                </motion.h1>
                            )}
                            {data.b && (
                                <motion.p
                                    className="text-sm mt-2 text-slate-600"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.6, duration: 0.5}}
                                >
                                    {data.b}
                                </motion.p>
                            )}
                        </motion.div>
                        {!allSocialLinksAreEmpty && (
                            <motion.div
                                className="flex items-center justify-center flex-wrap"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.8, duration: 0.5}}
                            >
                                <AnimatePresence>
                                    {socialIcons.map(({key, icon, link}, index) =>
                                            link && (
                                                <motion.a
                                                    key={key}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1"
                                                    initial={{opacity: 0, scale: 0}}
                                                    animate={{opacity: 1, scale: 1}}
                                                    exit={{opacity: 0, scale: 0}}
                                                    transition={{delay: index * 0.1, duration: 0.3}}
                                                    whileHover={{scale: 1.2}}
                                                    whileTap={{scale: 0.8}}
                                                >
                                                    <Icon
                                                        icon={icon}
                                                        width={24}
                                                        height={24}
                                                        className="text-slate-600 hover:text-slate-800 transition-colors"
                                                    />
                                                </motion.a>
                                            )
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                        <motion.ul
                            className="space-y-2"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 1, duration: 0.5}}
                        >
                            <AnimatePresence>
                                {data.ls && data.ls.map((link, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{opacity: 0, x: -50}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: 50}}
                                        transition={{delay: index * 0.1, duration: 0.3}}
                                    >
                                        <motion.a
                                            href={link.u}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 p-3 rounded-xl hover:bg-slate-100 bg-slate-50 transition-colors"
                                            whileHover={{scale: 1.05, backgroundColor: "#f1f5f9"}}
                                            whileTap={{scale: 0.95}}
                                        >
                                            <div
                                                className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500">
                                                {link.i && link.i.startsWith('http') ? (
                                                    <img src={link.i} alt={link.l} className="h-6 w-6"/>
                                                ) : (
                                                    <Icon icon={link.i || 'mdi:link'} width={24} height={24}/>
                                                )}
                                            </div>
                                            <div className="w-full flex-grow min-w-0">
                                                <p className="font-medium text-sm leading-6 text-gray-900">{link.l}</p>
                                            </div>
                                        </motion.a>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    </main>
                </div>
            </motion.div>
        </motion.div>
    );
}

