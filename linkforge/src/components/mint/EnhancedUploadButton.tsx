import {useState} from "react";
import {AnimatePresence, motion, Variants} from "framer-motion";
import {CircleFadingArrowUp, LoaderPinwheel} from "lucide-react";
import * as React from "react";

const EnhancedUploadButton = ({onClick, uploading}: { onClick: () => void; uploading: boolean }) => {
    const [isHovered, setIsHovered] = useState(false)

    const buttonVariants = {
        initial: {scale: 1},
        hover: {scale: 1.05},
    }

    const waveVariants = {
        animate: {
            x: [0, -100],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 5,
                    ease: "linear",
                },
            },
        },
    }

    const glowVariants: Variants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    }

    const bubbleVariants = {
        initial: {y: 0, opacity: 0},
        animate: {y: -100, opacity: [0, 1, 0]},
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={uploading}
            className="relative flex  py-2 w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-75"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Ocean gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400"/>

            {/* Animated waves */}
            <motion.div
                className="absolute inset-0"
                variants={waveVariants}
                animate="animate"
            >
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJNMCAyMGMyMCAwIDIwLTE1IDQwLTE1czIwIDE1IDQwIDE1IDIwLTE1IDQwLTE1IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmUpIi8+PC9zdmc+')]"/>
            </motion.div>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 bg-white opacity-20 blur-md animate-glow"
                variants={glowVariants}
                animate="animate"
            />

            {/* Content */}
            <div
                className="relative z-10 flex items-center justify-center w-full h-full text-white font-semibold text-lg">
                {uploading ? (
                    <LoaderPinwheel className="w-6 h-6 cursor-progress animate-spin"/>
                ) : (
                    <CircleFadingArrowUp className="w-6 h-6"/>
                )}
                <span className="ml-2">{uploading ? 'Uploading...' : 'Upload'}</span>
            </div>

            {/* Bubble animation */}
            <AnimatePresence>
                {(isHovered || uploading) && (
                    <>
                        {[...Array(10)].map((_, index) => (
                            <motion.div
                                key={index}
                                className="absolute bottom-0 bg-white rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 10 + 5}px`,
                                    height: `${Math.random() * 10 + 5}px`,
                                }}
                                variants={bubbleVariants}
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </motion.button>
    )
}

export default EnhancedUploadButton;