import type {Metadata} from "next";
import {siteConfig} from "@/config/site";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: `%s | ${siteConfig.name}`,
        default: siteConfig.name,
    },
    description: siteConfig.description,
    icons: {
        icon: '/logo.svg',
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
        ;
}


