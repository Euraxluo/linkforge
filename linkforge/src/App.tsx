import * as React from 'react';
import {HashRouter, Route, Routes, useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LinkForge from "./Home";
import {decodeData, PreviewData} from "./utils";
import {Template as SimpleTemplate} from "./template/Simple";
import {Template as DynamicTemplate} from "./template/Dynamic";
import {ErrorPage} from "./ErrorPage";

import {Suiet, SuiWeb3ConfigProvider} from '@ant-design/web3-sui';
import {NETWORK, networkConfig} from "./networkConfig";


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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const encodedData = searchParams.get('data');
        if (encodedData) {
            try {
                const decoded = decodeData(encodedData);
                setDecodedData(decoded);
            } catch (error) {
                console.error('Error decoding data:', error);
                setDecodedData(null);
            }
        }
        setIsLoading(false);
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
    const SelectedTemplate = templateComponents[template as keyof typeof templateComponents];

    if (!SelectedTemplate) {
        return <ErrorPage/>;
    }
    return <SelectedTemplate data={decodedData}/>;
};