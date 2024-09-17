import * as React from 'react';
import {HashRouter, Route, Routes, useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LinkForge from "./Home";
import {decodeData, extractDataFromURL, PreviewData} from "./utils";
import {Template as SimpleTemplate} from "./template/Simple";
import {Template as DynamicTemplate} from "./template/Dynamic";
import {ErrorPage} from "./ErrorPage";

import {Suiet, SuiWeb3ConfigProvider} from '@ant-design/web3-sui';
import {NETWORK, networkConfig, useNetworkVariable} from "./networkConfig";
import {getNameRecord, getObjectDetail, getOwnedObjects} from "./client";
import {LinkData} from "./link/useLinkData";


export default function App() {
    return (
        <SuiWeb3ConfigProvider
            wallets={[Suiet()]}
            networkConfig={networkConfig}
            sns={true}
            autoConnect={true}
            defaultNetwork={NETWORK}
        >
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LinkForge/>}/>
                    <Route path="/:template" element={<TemplateWrapper/>}/>
                </Routes>
            </HashRouter>
        </SuiWeb3ConfigProvider>
    );
}


const TemplateWrapper: React.FC = () => {
    const location = useLocation();
    const {template} = useParams<{ template: string }>();
    const [decodedData, setDecodedData] = useState<PreviewData | null>(null);
    const [templateData, setTemplateData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const linkforgePackageId = useNetworkVariable("linkforgePackageId");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            console.log(template)
            if (template && template.endsWith('.sui')) {
                const nameRecord = await getNameRecord(template)
                // Method 1: Treat as owner's address
                const ownedObjectsResult = await getOwnedObjects({
                    owner: nameRecord.targetAddress,
                    limit: 1,
                    structType: `${linkforgePackageId}::link::Link`,
                    matchType: 'MatchAll',
                    showDisplay: true,
                });
                console.log(ownedObjectsResult)
                if (ownedObjectsResult.result.length === 1) {
                    const linkData: LinkData = {
                        objectId: ownedObjectsResult.result[0].data.objectId,
                        display: ownedObjectsResult.result[0].data.display.data,
                    };
                    if (linkData.display.link) {
                        const {template: extractedTemplate, data} = extractDataFromURL(linkData.display.link);
                        setDecodedData(data);
                        setTemplateData(extractedTemplate);
                    }
                    setIsLoading(false);
                    return;
                }
            } else if (template && template.startsWith('0x') && template.length === 66) {
                try {
                    // Method 1: Treat as owner's address
                    const ownedObjectsResult = await getOwnedObjects({
                        owner: template,
                        limit: 1,
                        structType: `${linkforgePackageId}::link::Link`,
                        matchType: 'MatchAll',
                        showDisplay: true,
                    });
                    console.log(ownedObjectsResult)
                    if (ownedObjectsResult.result.length === 1) {
                        const linkData: LinkData = {
                            objectId: ownedObjectsResult.result[0].data.objectId,
                            display: ownedObjectsResult.result[0].data.display.data,
                        };
                        if (linkData.display.link) {
                            const {template: extractedTemplate, data} = extractDataFromURL(linkData.display.link);
                            setDecodedData(data);
                            setTemplateData(extractedTemplate);
                        }
                        setIsLoading(false);
                        return;
                    }

                    // Method 2: Treat as SBT address
                    const objectDetail = await getObjectDetail({
                        id: template,
                        showContent: true,
                        showDisplay: true,
                    });

                    if (objectDetail && objectDetail.display && objectDetail.display.data.link) {
                        const {template: extractedTemplate, data} = extractDataFromURL(objectDetail.display.data.link);
                        setDecodedData(data);
                        setTemplateData(extractedTemplate);
                    } else {
                        throw new Error('No valid link data found');
                    }
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Failed to fetch data. Please try again.');
                }
            } else {
                // Original URL parameter parsing logic
                const searchParams = new URLSearchParams(location.search);
                const encodedData = searchParams.get('data');
                if (encodedData) {
                    try {
                        const decoded = decodeData(encodedData);
                        setDecodedData(decoded);
                        setTemplateData(template);
                    } catch (err) {
                        console.error('Error decoding data:', err);
                        setError('Failed to decode data. Please check the URL.');
                    }
                } else {
                    setError('No data provided in the URL.');
                }
            }

            setIsLoading(false);
        };
        fetchData().finally(() => setIsLoading(false));
    }, [location]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (!decodedData) {
        return <ErrorPage/>;
    }

    const templateComponents = {
        simple: SimpleTemplate,
        dynamic: DynamicTemplate,
    };
    const SelectedTemplate = templateComponents[templateData as keyof typeof templateComponents];

    if (!SelectedTemplate) {
        return <ErrorPage/>;
    }
    return <SelectedTemplate data={decodedData}/>;
};