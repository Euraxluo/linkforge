import * as React from 'react';
import {useEffect, useState} from 'react';
import {motion, useAnimation, AnimatePresence, useMotionValue, useTransform} from 'framer-motion';
import {Icon} from "@iconify-icon/react";
import {areAllSocialLinksEmpty, generateSocialIcons, Link, PreviewData} from "../utils";

interface ProfileTemplateProps {
    data: PreviewData;
}

export const Template: React.FC<ProfileTemplateProps> = ({data}) => {
    const socialIcons = generateSocialIcons(data);
    const allSocialLinksAreEmpty = areAllSocialLinksEmpty(socialIcons);
    const controls = useAnimation();
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    useEffect(() => {
        controls.start(i => ({
            opacity: 1,
            y: 0,
            transition: {delay: i * 0.1}
        }));
    }, [controls]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const {clientX, clientY} = e;
        const {left, top, width, height} = e.currentTarget.getBoundingClientRect();
        const x = clientX - left - width / 2;
        const y = clientY - top - height / 2;
        setMousePosition({x, y});
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <motion.div
            className="relative min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden flex items-center justify-center p-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    background: "url('https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png')",
                    backgroundSize: "40px 40px",
                    backgroundRepeat: "repeat",
                }}
                animate={{
                    backgroundPosition: [
                        "0% 0%",
                        "100% 100%",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 20,
                    ease: "linear",
                }}
            />

            <motion.div
                className="relative w-full max-w-lg"
                style={{
                    perspective: 1000,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.main
                    className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        rotateX: isHovering ? rotateX : 0,
                        rotateY: isHovering ? rotateY : 0,
                    }}
                    transition={{type: "spring", stiffness: 300, damping: 30}}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-30"
                        style={{
                            x: useTransform(mouseX, [-300, 300], [-15, 15]),
                            y: useTransform(mouseY, [-300, 300], [-15, 15]),
                        }}
                    />

                    <div className="relative p-8 space-y-8">
                        <motion.div
                            className="text-center"
                            initial={{opacity: 0, y: 50}}
                            animate={controls}
                            custom={0}
                        >
                            {data.u && (
                                <motion.div
                                    className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-purple-400 mx-auto"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <img src={data.u} alt={data.n} className="h-full w-full object-cover"/>
                                </motion.div>
                            )}
                            {data.n && (
                                <motion.h1
                                    className="text-3xl font-bold mt-4 text-gray-800"
                                    initial={{opacity: 0}}
                                    animate={controls}
                                    custom={1}
                                >
                                    {data.n}
                                </motion.h1>
                            )}
                            {data.b && (
                                <motion.p
                                    className="text-lg mt-2 text-gray-600"
                                    initial={{opacity: 0}}
                                    animate={controls}
                                    custom={2}
                                >
                                    {data.b}
                                </motion.p>
                            )}
                        </motion.div>

                        {!allSocialLinksAreEmpty && (
                            <motion.div
                                className="flex items-center justify-center flex-wrap"
                                initial={{opacity: 0, y: 20}}
                                animate={controls}
                                custom={3}
                            >
                                {socialIcons.map(({key, icon, link}, index) =>
                                        link && (
                                            <motion.div
                                                key={key}
                                                className="m-2"
                                                initial={{opacity: 0, scale: 0}}
                                                animate={{opacity: 1, scale: 1}}
                                                transition={{delay: index * 0.1}}
                                            >
                                                <motion.a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                                    whileHover={{scale: 1.2, rotate: 360}}
                                                    whileTap={{scale: 0.8}}
                                                >
                                                    <Icon icon={icon} width={24} height={24} className="text-gray-700"/>
                                                </motion.a>
                                            </motion.div>
                                        )
                                )}
                            </motion.div>
                        )}

                        {data.ls && data.ls.length > 0 && (
                            <motion.ul
                                className="space-y-4"
                                initial={{opacity: 0}}
                                animate={controls}
                                custom={4}
                            >
                                <AnimatePresence>
                                    {data.ls.map((link: Link, index) => (
                                        <motion.li
                                            key={link.u}
                                            initial={{opacity: 0, x: -50}}
                                            animate={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: 50}}
                                            transition={{delay: index * 0.1}}
                                        >
                                            <motion.a
                                                href={link.u}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                                                whileHover={{scale: 1.05, backgroundColor: "#e2e8f0"}}
                                                whileTap={{scale: 0.95}}
                                            >
                                                <div
                                                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                                                    {link.i && link.i.startsWith('http') ? (
                                                        <img src={link.i} alt={link.l} className="h-8 w-8"/>
                                                    ) : (
                                                        <Icon icon={link.i || 'mdi:link'} width={32} height={32}
                                                              className="text-white"/>
                                                    )}
                                                </div>
                                                <span className="font-medium text-lg text-gray-800">{link.l}</span>
                                            </motion.a>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </motion.ul>
                        )}
                    </div>
                </motion.main>
            </motion.div>
        </motion.div>
    );
};