import { AnimatePresence, motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { Metadata } from "./TabSection";

export default function MetadataTab({ activeTab, sbtMetadata }: { activeTab: string, sbtMetadata: Metadata }) {
    return (
        <Tabs.Content value="metadata" asChild forceMount>
            <div className={`p-4 ${activeTab !== 'metadata' ? 'hidden' : ''}`}>
                <AnimatePresence>
                    {activeTab === 'metadata' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Metadata Structure</h3>
                                    <p className="text-gray-600">
                                        This is the complete metadata structure for your SBT (Soul Bound Token). It
                                        includes all the information about the token, including social links, profile
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
    );
}