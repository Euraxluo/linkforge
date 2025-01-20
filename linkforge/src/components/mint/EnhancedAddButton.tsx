import {useState} from "react";
import {motion} from "framer-motion";
import {CirclePlus} from "lucide-react";
import * as React from "react";

const EnhancedAddButton = ({onClick}: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false)

    const buttonVariants = {
        initial: {scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)'},
        hover: {scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'},
    }

    const iconVariants = {
        initial: {rotate: 0},
        hover: {rotate: 180},
    }

    const particleVariants = {
        initial: {opacity: 0, scale: 0},
        animate: {opacity: 1, scale: 1},
        exit: {opacity: 0, scale: 0},
    }

    return (
        <motion.button
            onClick={onClick}
            className="mt-4 relative flex justify-center items-center border-2 text-blue-500 border-blue-300 bg-white rounded-lg w-full py-3 overflow-hidden"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute inset-0 bg-blue-100"
                initial={{scaleX: 0}}
                animate={{scaleX: isHovered ? 1 : 0}}
                transition={{duration: 0.3}}
                style={{originX: 0}}
            />
            <motion.div className="relative z-10 flex items-center justify-center">
                <motion.div
                    variants={iconVariants}
                    transition={{duration: 0.3}}
                    style={{transformOrigin: 'center'}}
                >
                    <CirclePlus className="w-6 h-6"/>
                </motion.div>
            </motion.div>
            {isHovered && (
                <>
                    {[...Array(8)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute w-2 h-2 bg-blue-300 rounded-full"
                            variants={particleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{duration: 0.5, delay: index * 0.05}}
                            style={{
                                top: `${50 + 40 * Math.sin((index / 8) * Math.PI * 2)}%`,
                                left: `${50 + 40 * Math.cos((index / 8) * Math.PI * 2)}%`,
                            }}
                        />
                    ))}
                </>
            )}
        </motion.button>
    )
}

export default EnhancedAddButton;