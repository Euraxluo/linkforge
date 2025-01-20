import * as React from 'react';
import {useEffect, useState} from "react";
import {useParams, useSearchParams} from 'next/navigation';
import {useNetworkVariable} from "@/config/networkConfig";
import {LinkData} from "@/lib/link/useLinkData";
import {getNameRecord, getObjectDetail, getOwnedObjects} from "@/lib/client";
import {decodeData, extractDataFromURL, PreviewData} from "@/lib/utils";
import {Template as SimpleTemplate} from "@/components/template/Simple";
import {Template as DynamicTemplate} from "@/components/template/Dynamic";
import ErrorPage from "@/components/template/ErrorPage";

const TemplatePage: React.FC = () => {
    const params = useParams();
    const search = useSearchParams();
    const link = params.link as string;
    const [decodedData, setDecodedData] = useState<PreviewData | null>(null);
    const [templateData, setTemplateData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const linkforgePackageId = useNetworkVariable("linkforgePackageId");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            if (link && link.endsWith('.sui')) {
                try {
                    const nameRecord = await getNameRecord(link);
                    if (!nameRecord) {
                        throw new Error(`No valid sns ${link} found`);
                    }
                    const ownedObjectsResult = await getOwnedObjects({
                        owner: nameRecord.targetAddress,
                        limit: 1,
                        structType: `${linkforgePackageId}::link::Link`,
                        matchType: 'MatchAll',
                        showDisplay: true,
                    });

                    if (ownedObjectsResult.result.length === 1 && ownedObjectsResult.result[0]?.data?.objectId && ownedObjectsResult.result[0]?.data?.display?.data) {
                        const linkData: LinkData = {
                            objectId: ownedObjectsResult.result[0].data.objectId,
                            display: ownedObjectsResult.result[0].data.display.data as LinkData['display']
                        };
                        if (linkData.display.link) {
                            const {template: extractedTemplate, data} = extractDataFromURL(linkData.display.link);
                            setDecodedData(data);
                            setTemplateData(extractedTemplate);
                        }
                    } else {
                        throw new Error('No valid link data found');
                    }
                } catch (err) {
                    console.error('Error fetching data for .sui domain:', err);
                    setError('Failed to fetch data for .sui domain. Please try again.');
                }
            } else if (link && link.startsWith('0x') && link.length === 66) {
                try {
                    // Method 1: Treat as owner's address
                    const ownedObjectsResult = await getOwnedObjects({
                        owner: link,
                        limit: 1,
                        structType: `${linkforgePackageId}::link::Link`,
                        matchType: 'MatchAll',
                        showDisplay: true,
                    });

                    if (ownedObjectsResult.result.length === 1 && ownedObjectsResult.result[0]?.data?.objectId && ownedObjectsResult.result[0]?.data?.display?.data) {
                        const linkData: LinkData = {
                            objectId: ownedObjectsResult.result[0].data.objectId,
                            display: ownedObjectsResult.result[0].data.display.data as LinkData['display']
                        };
                        if (linkData.display.link) {
                            const {template: extractedTemplate, data} = extractDataFromURL(linkData.display.link);
                            setDecodedData(data);
                            setTemplateData(extractedTemplate);
                        }
                    } else {
                        // Method 2: Treat as SBT address
                        const objectDetail = await getObjectDetail({
                            id: link,
                            showContent: true,
                            showDisplay: true,
                        });

                        if (objectDetail && objectDetail.display && objectDetail.display.data?.link) {
                            const {
                                template: extractedTemplate,
                                data
                            } = extractDataFromURL(objectDetail.display.data.link);
                            setDecodedData(data);
                            setTemplateData(extractedTemplate);
                        } else {
                            throw new Error('No valid link data found');
                        }
                    }
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Failed to fetch data. Please try again.');
                }
            } else {
                // Assume it's encoded data in the URL
                try {
                    const data = search.get('data');
                    if (!data) {
                        throw new Error('No data parameter found');
                    }
                    const decoded = decodeData(data);
                    setDecodedData(decoded);
                    setTemplateData(link);
                } catch (err) {
                    console.error('Error decoding data:', err);
                    setError('Failed to decode data. Please check the URL.');
                }
            }

            setIsLoading(false);
        };

        fetchData();
    }, [link, linkforgePackageId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !decodedData) {
        return <ErrorPage error={error || 'No data available'}/>;
    }

    const templateComponents = {
        simple: SimpleTemplate,
        dynamic: DynamicTemplate,
    };

    const SelectedTemplate = templateComponents[templateData as keyof typeof templateComponents];

    if (!SelectedTemplate) {
        return <ErrorPage error={`Invalid template ${templateData}`}/>;
    }

    return <SelectedTemplate data={decodedData}/>;
};

export default TemplatePage;