import * as React from "react";
import {motion} from "framer-motion";
import {Icon} from "@iconify-icon/react";

interface SeaCreature {
    id: number
    icon: string
    x: number
    y: number
    size: number
}

const SeaCreature: React.FC<SeaCreature> = ({icon, x, y, size}) => {
    return (
        <motion.div
            className="absolute text-white opacity-30"
            style={{left: `${x}%`, top: `${y}%`}}
            animate={{
                x: [0, Math.random() * 20 - 10],
                y: [-10, Math.random() * 20 - 10],
                rotate: [0, Math.random() * 360],
            }}
            transition={{
                y: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                },
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
        >
            <Icon icon={icon} width={size} height={size}/>
        </motion.div>
    )
}

export default SeaCreature;