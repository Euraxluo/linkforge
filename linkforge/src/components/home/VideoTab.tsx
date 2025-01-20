import { useEffect, useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";

export default function VideoTab({ activeTab }: { activeTab: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.src = `https://secretlink.walrus.site/#/SpxDM37bkaF_fR8dDkPCHl4hGusvsDQBIzCu2myCn9w?mimetype=video/mp4`;
        }
    }, []);

    return (
        <Tabs.Content value="video" asChild forceMount>
            <div className={`p-4 ${activeTab !== 'video' ? 'hidden' : ''}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="relative" style={{ paddingTop: '56.25%' }}>
                        <iframe
                            ref={iframeRef}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope;picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                            aria-hidden={activeTab !== 'video'}
                        />
                    </div>
                </div>
            </div>
        </Tabs.Content>
    );
}