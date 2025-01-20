import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import TabTrigger from "@/components/home/TabTrigger";
import PreviewTab from "@/components/home/PreviewTab";
import MetadataTab from "@/components/home/MetadataTab";
import VideoTab from "@/components/home/VideoTab";

// 定义 Metadata 类型
interface Metadata {
    ls?: { l: string; i?: string; u: string; }[];
    n?: string;
    b?: string;
    u?: string;
    f?: string;
    x?: string;
    ig?: string;
    e?: string;
    gh?: string;
    tg?: string;
    w?: string;
    y?: string;
    lk?: string;
    m?: string;
    name?: string;
    description?: string;
    image?: string;
    attributes?: Record<string, string | number | boolean>;
    display?: {
        link: string;
        name?: string;
        creator?: string;
        description?: string;
        identify?: string;
        image_url?: string;
        project_url?: string;
    };
    objectId?: string;
}

export type { Metadata };

export default function TabSection({ metadata, sbtMetadata }: { metadata: Metadata, sbtMetadata: Metadata }) {
    const [activeTab, setActiveTab] = useState('video');

    return (
        <Tabs.Root
            defaultValue="video"
            className="from-blue-300 to-blue-700 shadow-lg mb-8 relative overflow-hidden bg-blue-300 bg-opacity-30 p-6 rounded-lg backdrop-blur-sm hover:shadow-xl"
            onValueChange={setActiveTab}
        >
            <Tabs.List
                className="flex mb-2 cursor-pointer bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg transition-all duration-300">
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
            <div className="relative bg-blue-100 bg-opacity-20 rounded-lg shadow-lg">
                <PreviewTab activeTab={activeTab} metadata={metadata} sbtMetadata={sbtMetadata} />
                <MetadataTab activeTab={activeTab} sbtMetadata={sbtMetadata} />
                <VideoTab activeTab={activeTab} />
            </div>
        </Tabs.Root>
    );
}