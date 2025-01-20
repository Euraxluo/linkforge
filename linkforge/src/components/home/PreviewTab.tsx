import { AnimatePresence, motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { Metadata } from "./TabSection";

export default function PreviewTab({ activeTab, metadata, sbtMetadata }: { activeTab: string, metadata: Metadata, sbtMetadata: Metadata }) {
    return (
        <Tabs.Content value="preview" asChild forceMount>
            <div className={`p-4 ${activeTab !== 'preview' ? 'hidden' : ''}`}>
                <AnimatePresence>
                    {activeTab === 'preview' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-4">
                                <div className="w-full md:w-1/2">
                                    <div className="bg-gray-100 p-2 rounded-lg shadow-inner h-[600px] overflow-hidden">
                                        <iframe
                                            src={sbtMetadata.display?.link}
                                            className="w-full h-full rounded-md shadow-sm"
                                            title="Preview"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-[600px] overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white text-lg font-semibold">Metadata Preview</h3>
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
    );
}