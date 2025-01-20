'use client';

import { useEffect, useMemo, useState } from "react";
import { useLinkData } from "@/lib/link/useLinkData";
import { extractDataFromURL } from "@/lib/utils";
import { motion } from "framer-motion";
import Header from "@/components/home/HomeHeader";
import FeatureGrid from "@/components/home/FeatureGrid";
import AccessMethods from "@/components/home/AccessMethod";
import TabSection, { Metadata } from "@/components/home/TabSection";
import GotoMintButton from "@/components/home/GotoMintButton";

function HomePage() {
    const [metadata, setMetadata] = useState({
        "ls": [
            {
                "l": "wrapper",
                "i": "ph:globe-duotone",
                "u": "https://wrapper.space"
            },
            {
                "i": "ph:globe-duotone",
                "l": "linkforge2",
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
    } as Metadata);
    const [sbtMetadata, setSbtMetadata] = useState<Metadata>({
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
    });
    const linkData = useLinkData();
    const { data: metadataData } = useMemo(() => {
        if (linkData.linkData?.display?.link) {
            return extractDataFromURL(linkData.linkData.display.link);
        }
        return { template: "", data: null };
    }, [linkData.linkData?.display?.link]);

    useEffect(() => {
        if (metadataData) {
            setMetadata(metadataData);
        }
        if (linkData.linkData) {
            setSbtMetadata(linkData.linkData);
        }
    }, [metadataData, linkData]);

    return (
        <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <Header />
            <FeatureGrid />
            <AccessMethods />
            <TabSection metadata={metadata as Metadata} sbtMetadata={sbtMetadata as Metadata} />
            <GotoMintButton />
        </motion.div>
    );
}

export default HomePage;