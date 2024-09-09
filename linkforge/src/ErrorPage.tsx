import {Triangle} from "lucide-react";
import * as React from "react";

export const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center h-screen text-red-500">
            <div className="flex items-center justify-center min-h-screen ">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                    <Triangle className="mx-auto h-16 w-16 text-yellow-400"/>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">Error</h1>
                    <p className="mt-2 text-gray-600">No data available</p>
                    <p className="mt-4 text-sm text-gray-500">
                        Please check the URL and try again. If the problem persists, contact support.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    )
}


