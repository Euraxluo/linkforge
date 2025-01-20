"use client";
import SeaCreature from "@/components/layout/SeaCreature";
import WaveBackground from "@/components/layout/WaveBackground";
import {useEffect, useState} from "react";

function SiteBackground() {
    const [seaCreatures, setSeaCreatures] = useState<SeaCreature[]>([])
    useEffect(() => {
        const creatures = [
            {icon: "emojione-v1:fish", count: 30, minSize: 24, maxSize: 24},
            {icon: "openmoji:jellyfish", count: 10, minSize: 32, maxSize: 48},
            {icon: "emojione-v1:octopus", count: 10, minSize: 32, maxSize: 48},
            {icon: "openmoji:crab", count: 10, minSize: 24, maxSize: 48},
            {icon: "fa-solid:disease", count: 10, minSize: 24, maxSize: 48},
            {icon: "fluent-emoji:whale", count: 2, minSize: 48, maxSize: 192},
            {icon: "streamline-emojis:anchor", count: 1, minSize: 48, maxSize: 96},
        ]

        const newCreatures = creatures.flatMap(({icon, count, minSize, maxSize}) =>
            Array.from({length: count}, () => ({
                id: Math.random(),
                icon,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * (maxSize - minSize) + minSize,
            }))
        )
        setSeaCreatures(newCreatures)
    }, [])
    return (
        <>
            <WaveBackground/>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {seaCreatures.map((creature) => (
                    <SeaCreature key={creature.id} {...creature} />
                ))}
            </div>
        </>
    )
}

export default SiteBackground;