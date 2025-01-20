import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function GotoMintButton() {
    return (
        <div className="flex justify-center mt-8">
            <Link
                href={"/mint"}
                className="group inline-flex items-center opacity-80 justify-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 hover:opacity-90 active:scale-60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
                Start Minting Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"/>
            </Link>
        </div>
    );
}