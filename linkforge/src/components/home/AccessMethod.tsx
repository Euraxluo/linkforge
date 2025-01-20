"use client";
import * as React from "react";
import {motion} from "framer-motion";
import {FileText, Globe, Key, Link2} from "lucide-react";
import {useEffect, useState} from "react";

interface AccessMethod {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
}

const AccessMethod: React.FC<AccessMethod> = ({title, description, link, icon}) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const [url, setUrl] = useState('')

    useEffect(() => {
        setUrl(`${window.location.origin}${link}`)
    }, [link])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const visitLink = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            className="cursor-pointer bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:bg-opacity-30"
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.98}}
        >
            <div className="flex items-start space-x-4">
                <div className="text-3xl bg-blue-500 p-3 rounded-full text-white shadow-lg">{icon}</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
                    <p className="text-blue-100 mb-3">{description}</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={url}
                            readOnly
                            className="w-full bg-blue-100 bg-opacity-50 text-sm text-blue-900 py-2 px-3 pr-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="from-blue-300 to-blue-700  shadow-lg  mb-8 relative overflow-hidden bg-blue-300 bg-opacity-30 p-6 rounded-lg backdrop-blur-sm"
        >
            {/* Underwater effect */}
            <div className="absolute inset-0 z-0">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-8 relative z-10">Four Ways to Access Your
                Link</h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
                variants={{
                    hidden: {opacity: 0},
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
                    link={"/0x540ba39b0328acd14e100a8af76b7880e336abe08f806ada5643085794bd8aab"}
                    icon={<Key className="w-8 h-8"/>}
                />
                <AccessMethod
                    title="Link Object Address"
                    description="Access your link using its unique object address on the Sui network."
                    link={"/0x1036af975664abdb2920efb767fb3f5df1f4b18f20946b5bd4d7cb935361a0d8"}
                    icon={<Link2 className="w-8 h-8"/>}
                />
                <AccessMethod
                    title="Blockchain Domain"
                    description="Use your personalized .sui domain to view your link."
                    link={"/mint.sui"}
                    icon={<Globe className="w-8 h-8"/>}
                />
                <AccessMethod
                    title="SBT Link Content"
                    description="Access through the encoded link in your SBT's content."
                    link={"/dynamic?data=eyJscyI6W3sibCI6Ik15IFdlYnNpdGUiLCJpIjoicGg6Z2xvYmUtZHVvdG9uZSIsInUiOiJodHRwczovL2V4YW1wbGUuY29tIn0seyJsIjoiQW1hem9uIHdpc2hsaXN0IiwiaSI6ImFudC1kZXNpZ246YW1hem9uLW91dGxpbmVkIiwidSI6Imh0dHBzOi8vYW1hem9uLmluIn0seyJsIjoiUmVhY3QgSlMiLCJpIjoiZ3JvbW1ldC1pY29uczpyZWFjdGpzIiwidSI6Imh0dHBzOi8vcmVhY3Rqcy5vcmcvIn0seyJsIjoiRG9uYXRlIGZvciBvdXIgY2F1c2UiLCJpIjoiaWNvbm9pcjpkb25hdGUiLCJ1IjoiaHR0cHM6Ly93aG8uaW50In0seyJsIjoiRG93bmxvYWQgbXkgcmVzdW1lIiwiaSI6InBoOmZpbGUtcGRmIiwidSI6Imh0dHBzOi8vZ29vZ2xlLmNvbSJ9XSwibiI6IkV4YW1wbGUg5rWL6K-V5LiA5LiLIiwiYiI6IkknbSBEZXZlbG9wZXIuIiwidSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9wbGFjZWhvbGRlci5zdmciLCJmIjoiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3VzZXJuYW1lIiwieCI6Imh0dHBzOi8veC5jb20vdXNlcm5hbWUiLCJpZyI6Imh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vdXNlcm5hbWUiLCJlIjoibWFpbEB1c2VybmFtZS5jYyIsImdoIjoiaHR0cHM6Ly9naXRodWIuY29tL3VzZXJuYW1lIiwidGciOiJodHRwczovL3QubWUvdXNlcm5hbWUiLCJ3IjoiKzkxODg4ODg4ODg4OCIsInkiOiJodHRwczovL3lvdXR1YmUuY29tL0B1c2VybmFtZSIsImxrIjoiaHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vdXNlcm5hbWUiLCJtIjoiaHR0cHM6Ly9tYXN0b2Rvbi5zb2NpYWwvQHVzZXJuYW1lIn0"}
                    icon={<FileText className="w-8 h-8"/>}
                />
            </motion.div>
        </motion.div>
    );
};

export default AccessMethods;