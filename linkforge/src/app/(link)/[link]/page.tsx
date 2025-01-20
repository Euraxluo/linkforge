"use client";
import TemplatePage from "@/components/template/TemplatePage";

interface PageProps {
    params: { link: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({params, searchParams}: PageProps) {
    console.log(params.link);
    console.log(searchParams);
    return (
        <TemplatePage/>
    );
}
