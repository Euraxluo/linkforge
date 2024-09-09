import * as React from "react";
import {useState, useEffect} from 'react';
import {Icon} from "@iconify-icon/react";

interface LinkPreviewProps {
    url: string;
    fallbackIcon: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({url, fallbackIcon}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                // Use a service like microlink.io to generate previews
                const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`);
                const data = await response.json();
                if (data.status === 'success' && data.data.screenshot) {
                    setPreviewUrl(data.data.screenshot.url);
                }
            } catch (error) {
                console.error('Error fetching link preview:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreview();
    }, [url]);

    if (isLoading) {
        return (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <Icon icon="mdi:loading" className="text-gray-400" width={24} height={24}/>
            </div>
        );
    }

    if (previewUrl) {
        return (
            <img
                src={previewUrl}
                alt={`Preview of ${url}`}
                className="w-12 h-12 object-cover rounded-lg"
                onError={() => setPreviewUrl(null)}
            />
        );
    }

    return (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon icon={fallbackIcon || 'mdi:link'} className="text-gray-600" width={24} height={24}/>
        </div>
    );
};

