import {motion, AnimatePresence, Variants} from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import {useEffect, useState, useCallback, useRef, useMemo} from "react";
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
    CircleFadingArrowUp, Check, Copy, FileText, Globe, Key, Link2
} from 'lucide-react'
import {Icon} from '@iconify-icon/react';
import Cropper from 'react-easy-crop'
import {Point, Area} from 'react-easy-crop/types'
import {decodeData, encodeData, extractDataFromURL, Link, PreviewData} from "./utils";
import {WalrusClient} from 'tuskscript'
import {useNetworkVariable} from "./networkConfig";
import {useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, useCurrentWallet} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {useLinkData} from "./link/useLinkData";
import {ConnectButton, Connector} from "@ant-design/web3";
import {isEqual} from 'lodash';
import {TransactionVisualizer} from "./TransactionVisualizer";
import {Template as SimpleTemplate} from "./template/Simple";
import {Template as DynamicTemplate} from "./template/Dynamic";
import {CustomDropdown, CustomInput} from "./CustomInput";
import {encode} from "js-base64";

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
        title: "Metadata link to Walrus Site",
        description: "Generate beautiful Walrus Site(future will support OG images) based on metadata to display your SBT, build on Sui of full-chain."
    }
]
const FeatureGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }>
            {children}
        </Tabs.Trigger>
    )
}

interface HomeSectionProps {
    setActiveSection: (section: string) => void
}

interface AccessMethodProps {
    title: string;
    description: string;
    demo: string;
    icon: React.ReactNode;
}

const AccessMethod: React.FC<AccessMethodProps> = ({ title, description, demo, icon }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(demo).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const visitLink = () => {
        window.open(demo, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:bg-opacity-30"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start space-x-4">
                <div className="text-3xl bg-blue-500 p-3 rounded-full text-white shadow-lg">{icon}</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
                    <p className="text-blue-100 mb-3">{description}</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={demo}
                            readOnly
                            className="w-full bg-blue-100 bg-opacity-50 text-sm text-blue-900 py-2 px-3 pr-48 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <div className="absolute right-1 top-1 flex space-x-2">
                            <button
                                onClick={visitLink}
                                className="bg-green-400 text-white px-3 py-1 rounded-md text-sm hover:bg-green-500 transition-colors duration-200"
                            >
                                Visit
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200"
                            >
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AccessMethods: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br opacity-40 from-blue-400 to-blue-500 rounded-lg shadow-lg p-8 mb-8 relative overflow-hidden"
        >
            {/* Underwater effect */}
            <div className="absolute inset-0 z-0">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-8 relative z-10">Four Ways to Access Your Link</h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
                initial="hidden"
                animate="show"
            >
                <AccessMethod
                    title="Your Account Address"
                    description="Use your Sui wallet address to view your link."
                    demo={`${window.location.origin}/#/0x540ba39b0328acd14e100a8af76b7880e336abe08f806ada5643085794bd8aab`}
                    icon={<Key className="w-8 h-8" />}
                />
                <AccessMethod
                    title="Link Object Address"
                    description="Access your link using its unique object address on the Sui network."
                    demo={`${window.location.origin}/#/0x1036af975664abdb2920efb767fb3f5df1f4b18f20946b5bd4d7cb935361a0d8`}
                    icon={<Link2 className="w-8 h-8" />}
                />
                <AccessMethod
                    title="Blockchain Domain"
                    description="Use your personalized .sui domain to view your link."
                    demo={`${window.location.origin}/#/mint.sui`}
                    icon={<Globe className="w-8 h-8" />}
                />
                <AccessMethod
                    title="SBT Link Content"
                    description="Access through the encoded link in your SBT's content."
                    demo={`${window.location.origin}/#/dynamic?data=eyJscyI6W3sibCI6Ik15IFdlYnNpdGUiLCJpIjoicGg6Z2xvYmUtZHVvdG9uZSIsInUiOiJodHRwczovL2V4YW1wbGUuY29tIn0seyJsIjoiQW1hem9uIHdpc2hsaXN0IiwiaSI6ImFudC1kZXNpZ246YW1hem9uLW91dGxpbmVkIiwidSI6Imh0dHBzOi8vYW1hem9uLmluIn0seyJsIjoiUmVhY3QgSlMiLCJpIjoiZ3JvbW1ldC1pY29uczpyZWFjdGpzIiwidSI6Imh0dHBzOi8vcmVhY3Rqcy5vcmcvIn0seyJsIjoiRG9uYXRlIGZvciBvdXIgY2F1c2UiLCJpIjoiaWNvbm9pcjpkb25hdGUiLCJ1IjoiaHR0cHM6Ly93aG8uaW50In0seyJsIjoiRG93bmxvYWQgbXkgcmVzdW1lIiwiaSI6InBoOmZpbGUtcGRmIiwidSI6Imh0dHBzOi8vZ29vZ2xlLmNvbSJ9XSwibiI6IkV4YW1wbGUg5rWL6K-V5LiA5LiLIiwiYiI6IkknbSBEZXZlbG9wZXIuIiwidSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9wbGFjZWhvbGRlci5zdmciLCJmIjoiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3VzZXJuYW1lIiwieCI6Imh0dHBzOi8veC5jb20vdXNlcm5hbWUiLCJpZyI6Imh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vdXNlcm5hbWUiLCJlIjoibWFpbEB1c2VybmFtZS5jYyIsImdoIjoiaHR0cHM6Ly9naXRodWIuY29tL3VzZXJuYW1lIiwidGciOiJodHRwczovL3QubWUvdXNlcm5hbWUiLCJ3IjoiKzkxODg4ODg4ODg4OCIsInkiOiJodHRwczovL3lvdXR1YmUuY29tL0B1c2VybmFtZSIsImxrIjoiaHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vdXNlcm5hbWUiLCJtIjoiaHR0cHM6Ly9tYXN0b2Rvbi5zb2NpYWwvQHVzZXJuYW1lIn0`}
                    icon={<FileText className="w-8 h-8" />}
                />
            </motion.div>
        </motion.div>
    );
};

function HomeSection({setActiveSection}: HomeSectionProps) {
    const [activeTab, setActiveTab] = useState('video')
    const [metadata, setMetadata] = useState({
        "ls": [
            {
                "l": "wrapper",
                "i": "ph:globe-duotone",
                "u": "https://wrapper.space"
            },
            {
                "i": "ph:globe-duotone",
                "l": "linkforge",
                "u": "https://linkforge.walrus.site"
            },
            {
                "i": "ph:globe-duotone",
                "l": "secretlink",
                "u": "https://secretlink.walrus.site"
            }
        ],
        "n": "Euraxluo",
        "b": "i am working for  `Wrapper Protocol` and `Linkforge`",
        "u": "https://aggregator-devnet.walrus.space/v1/Kb64CbtRLKKGXyuDpUGzyBE6pSWap62GzmE56l1X85U",
        "f": "",
        "x": "https://x.com/luo_eurax",
        "ig": "",
        "e": "euraxluo@outlook.com",
        "gh": "https://github.com/euraxluo",
        "tg": "https://t.me/euraxluo",
        "w": "",
        "y": "",
        "lk": "",
        "m": ""
    })
    const [sbtMetadata, setSbtMetadata] = useState({
            "objectId": "0x493e4f1f61028c4b846181ccb85a17f4195fbf37dc3a04393291608047e7f1b2",
            "display": {
                "creator": "0xbeecdd12658442fb256349b577c869083b516509891b2913742d99add93ac3d2",
                "description": "A soulbound token by 0xbeecdd12658442fb256349b577c869083b516509891b2913742d99add93ac3d2, marked euraxluo, named Euraxluo—an unbreakable, timeless reflection on the chain.",
                "identify": "euraxluo",
                "image_url": "https://aggregator-devnet.walrus.space/v1/Kb64CbtRLKKGXyuDpUGzyBE6pSWap62GzmE56l1X85U",
                "link": "https://52uzquxqktipwjlkcdmlvz249kqvpbrm9f27dcqpv81kqair46.walrus.site/#/dynamic?data=eyJscyI6W3sibCI6IndyYXBwZXIiLCJpIjoicGg6Z2xvYmUtZHVvdG9uZSIsInUiOiJodHRwczovL3dyYXBwZXIuc3BhY2UifSx7ImkiOiJwaDpnbG9iZS1kdW90b25lIiwibCI6Imxpbmtmb3JnZSIsInUiOiJodHRwczovL2xpbmtmb3JnZS53YWxydXMuc2l0ZSJ9LHsiaSI6InBoOmdsb2JlLWR1b3RvbmUiLCJsIjoic2VjcmV0bGluayIsInUiOiJodHRwczovL3NlY3JldGxpbmsud2FscnVzLnNpdGUifV0sIm4iOiJFdXJheGx1byIsImIiOiJpIGFtIHdvcmtpbmcgZm9yICBgV3JhcHBlciBQcm90b2NvbGAgYW5kIGBMaW5rZm9yZ2VgIiwidSI6Imh0dHBzOi8vYWdncmVnYXRvci1kZXZuZXQud2FscnVzLnNwYWNlL3YxL0tiNjRDYnRSTEtLR1h5dURwVUd6eUJFNnBTV2FwNjJHem1FNTZsMVg4NVUiLCJmIjoiIiwieCI6Imh0dHBzOi8veC5jb20vbHVvX2V1cmF4IiwiaWciOiIiLCJlIjoiZXVyYXhsdW9Ab3V0bG9vay5jb20iLCJnaCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9ldXJheGx1byIsInRnIjoiaHR0cHM6Ly90Lm1lL2V1cmF4bHVvIiwidyI6IiIsInkiOiIiLCJsayI6IiIsIm0iOiIifQ==",
                "name": "Euraxluo",
                "project_url": "https://52uzquxqktipwjlkcdmlvz249kqvpbrm9f27dcqpv81kqair46.walrus.site"
            }
        }
    )
    const linkData = useLinkData();
    const {data: metadataData} = useMemo(() => {
        if (linkData.linkData?.display?.link) {
            return extractDataFromURL(linkData.linkData.display.link);
        }
        return {template: "", data: null};
    }, [linkData.linkData?.display?.link]);

    useEffect(() => {
        if (metadataData) {
            // @ts-ignore
            setMetadata(metadataData);
        }
        if (linkData.linkData) {
            // @ts-ignore
            setSbtMetadata(linkData.linkData);
        }
    }, [metadataData, linkData]);

    // iframe 引用
    const iframeRef = useRef(null)
    useEffect(() => {
        // 当组件挂载时，立即加载 iframe
        if (iframeRef.current) {
            iframeRef.current.src = `https://secretlink.walrus.site/#/SpxDM37bkaF_fR8dDkPCHl4hGusvsDQBIzCu2myCn9w?mimetype=video/mp4`
        }
    }, [])
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
            <p className="text-xl text-center mb-8">
                Create stunning link-themed SBT with Walrus-Site and Onchain-Metadata for your with ease
            </p>

            <FeatureGrid/>
            <AccessMethods/>

            <Tabs.Root
                defaultValue="video"
                className="bg-white mb-4 text-gray-800 rounded-lg shadow-lg overflow-hidden"
                onValueChange={setActiveTab}
            >
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
                    <TabTrigger value="video" active={activeTab === 'video'}>
                        Video
                    </TabTrigger>
                    <TabTrigger value="preview" active={activeTab === 'preview'}>
                        Preview
                    </TabTrigger>
                    <TabTrigger value="metadata" active={activeTab === 'metadata'}>
                        Metadata
                    </TabTrigger>
                </Tabs.List>
                <div className="relative">
                    <Tabs.Content value="preview" asChild forceMount>
                        <div className={`p-4 ${activeTab !== 'preview' ? 'hidden' : ''}`}>
                            <AnimatePresence>
                                {activeTab === 'preview' && (
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.2}}
                                    >
                                        <div
                                            className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-4">
                                            <div className="w-full md:w-1/2">
                                                <div
                                                    className="bg-gray-100 p-2 rounded-lg shadow-inner h-[600px] overflow-hidden">
                                                    <iframe
                                                        src={`${sbtMetadata.display.link}`}
                                                        className="w-full h-full rounded-md shadow-sm"
                                                        title="Preview"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <div
                                                    className="bg-gray-800 p-4 rounded-lg shadow-lg h-[600px] overflow-hidden">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-white text-lg font-semibold">Metadata
                                                            Preview</h3>
                                                    </div>
                                                    <pre className="text-green-400 overflow-auto h-[calc(100%-2rem)]">
                                                      <code>{JSON.stringify(metadata, null, 2)}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="metadata" asChild forceMount>
                        <div className={`p-4 ${activeTab !== 'metadata' ? 'hidden' : ''}`}>
                            <AnimatePresence>
                                {activeTab === 'metadata' && (
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.2}}
                                    >
                                        <div className="flex flex-col space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Metadata Structure</h3>
                                                <p className="text-gray-600">
                                                    This is the complete metadata structure for your SBT (Soul Bound
                                                    Token). It
                                                    includes all the information about the token, including social
                                                    links, profile
                                                    data, and external links.
                                                </p>
                                            </div>
                                            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-white text-lg font-semibold">Full Metadata</h3>
                                                </div>
                                                <pre className="text-green-400 overflow-auto max-h-[600px]">
                                                    <code>{JSON.stringify(sbtMetadata, null, 2)}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="video" asChild forceMount>
                        <div className={`p-4 ${activeTab !== 'video' ? 'hidden' : ''}`}>
                            <div className="max-w-4xl mx-auto">
                                <div className="relative" style={{paddingTop: '56.25%'}}>
                                    <iframe
                                        ref={iframeRef}
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                        aria-hidden={activeTab !== 'video'}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                </div>
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
    const {linkData} = useLinkData();
    const currentAccount = useCurrentAccount();
    console.log(currentAccount)
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

    const buttonClasses = `
    flex items-center space-x-2 px-4 py-2 rounded-lg border-0
    bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400
    hover:from-blue-500 hover:via-cyan-100 hover:to-teal-500
    text-white font-medium text-sm
    shadow-lg shadow-cyan-900/30 hover:shadow-cyan-100/50
    transition-all duration-300 ease-in-out hover:scale-105`

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
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveSection('mint')}
                                className="hover:underline transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                            >
                                Mint
                            </button>
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

    const [amount, setAmount] = useState(1); // number of coin
    const [coinDecimals, setCoinDecimals] = useState(9);
    const [isSigningTransaction, setIsSigningTransaction] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);

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
    }, [extractedData]);
    useEffect(() => {
        if (extractedTemplate && !isEqual(extractedTemplate, template)) {
            setTemplate(extractedTemplate);
            setOriginalTemplate(extractedTemplate);
        }
    }, [extractedTemplate]);
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
    }, [extractedIdentify]);

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
        return Object.keys(data).filter(key => !isEqual(data[key], originalData[key]));
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
        const url = `${window.location.origin}/#/${template}?data=${encodeData(data)}`;
        // 检查是否支持 window.open
        if (window.open) {
            window.open(url, '_blank').focus();
        } else {
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
    const updateData = (newData) => {
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
                    <LinksForm data={data} updateData={updateData}/>
                </div>
            </div>
            {transactionHash ?
                <TransactionVisualizer
                    isSigningTransaction={isSigningTransaction}
                    transactionHash={transactionHash}
                    onClose={() => {
                        setTransactionHash('')
                    }}
                /> : <></>
            }
            <Preview data={data} template={template}/>
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
                    <LoaderPinwheel className="w-6 h-6 cursor-progress animate-spin"/>
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
                            <div className="mt-1 text-xs text-gray-600">
                                icon keys can be found in <br/>
                                <a className="underline" href="https://icon-sets.iconify.design/">
                                    https://icon-sets.iconify.design/
                                </a>
                            </div>
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
                                                                Icon
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
        updateData({[e.target.name]: e.target.value});
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
                        u: `https://aggregator-devnet.walrus.space/v1/${result.newlyCreated.blobObject.blobId as string}`
                    })
                } else if ('alreadyCertified' in result) {
                    updateData({
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
                    <div className="flex cursor-pointer items-center justify-center h-full">
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
                    className="hidden  cursor-pointer"
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
    template: string;
    data: PreviewData;
}

export function Preview({data, template}: PreviewProps) {
    const templateComponents = {
        simple: SimpleTemplate,
        dynamic: DynamicTemplate,
    };

    const SelectedTemplate = templateComponents[template as keyof typeof templateComponents];

    return (
        <div className="h-screen grid place-items-center relative">
            <motion.div
                className="w-[150px] h-[512px] md:w-[340px] md:h-[729px] overflow-hidden rounded-[3rem] ring-8 ring-slate-800 bg-white shadow-xl"
                initial={{scale: 0.9, y: 50}}
                animate={{scale: 1, y: 0}}
                transition={{type: "spring", stiffness: 260, damping: 20}}
            >
                <div className="h-full overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <SelectedTemplate data={data}/>;
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
