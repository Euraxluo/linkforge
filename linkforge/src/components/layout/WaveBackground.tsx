import * as React from "react";
import {motion} from "framer-motion";

const WaveBackground: React.FC = () => {
    return (
        <svg className="absolute inset-1 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path
                d="M0 50 Q250 0 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z"
                fill="rgba(255, 255, 255, 0.1)"
                animate={{
                    d: [
                        "M0 50 Q250 0 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z",
                        "M0 50 Q250 100 500 50 T1000 50 T1500 50 T2000 50 V100 H0 Z",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 8,
                    ease: "easeInOut",
                }}
            />

            <motion.path
                d="M0 150 Q250 0 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z"
                fill="rgba(255, 255, 255, 0.1)"
                animate={{
                    d: [
                        "M0 150 Q250 60 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z",
                        "M0 150 Q250 150 500 150 T1000 150 T1500 150 T2000 150 V100 H0 Z",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    ease: "easeInOut",
                }}
            />
        </svg>
    )
}

export default WaveBackground