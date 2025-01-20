import {Fish, Shell, Waves} from "lucide-react";
import * as React from "react";

const featureGrid = [
    {
        icon: Waves,
        title: "Dynamic Links Generator",
        description: "Create unique links patterns as your SBT, link to OG images that update automatically."
    },
    {
        icon: Fish,
        title: "Link to Aquatic Creature",
        description: "Access underwater creatures as Sui object, Coral reef can link all objects together, startup on linkforge2."
    },
    {
        icon: Shell,
        title: "Metadata link to Walrus Site",
        description: "Generate beautiful Walrus Site(future will support OG images) based on metadata to display your SBT, build on Sui of full-chain."
    }
]
const FeatureGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featureGrid.map((feature, index) => (
                <div
                    key={index}
                    className="bg-white bg-opacity-40 p-6 rounded-lg backdrop-blur-sm
                     transform transition duration-300 ease-in-out
                     hover:skew-y-1 hover:scale-105 hover:shadow-lg hover:hue-rotate-15
                     active:scale-95
                     cursor-pointer"
                >
                    <feature.icon className="text-4xl mb-4"/>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                </div>
            ))}
        </div>
    )
}

export default FeatureGrid;