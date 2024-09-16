import { motion } from 'framer-motion'
import { areAllSocialLinksEmpty, generateSocialIcons, Link, PreviewData } from "../utils"
import { Icon } from "@iconify-icon/react"
import * as React from "react"

interface ProfileTemplateProps {
    data: PreviewData
}

export const Template: React.FC<ProfileTemplateProps> = ({ data }) => {
    const socialIcons = generateSocialIcons(data)
    const allSocialLinksAreEmpty = areAllSocialLinksEmpty(socialIcons)

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white min-h-screen w-full space-y-8 pt-12 max-w-lg mx-auto"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="text-center"
            >
                {data.u && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="h-20 w-20 rounded-full overflow-hidden ring ring-slate-200 mx-auto"
                    >
                        <img src={data.u} alt={data.n} className="h-full w-full object-cover" />
                    </motion.div>
                )}
                {data.n && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold mt-4 text-slate-800"
                    >
                        {data.n}
                    </motion.h1>
                )}
                {data.b && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm mt-2 text-slate-600"
                    >
                        {data.b}
                    </motion.p>
                )}
            </motion.div>
            {!allSocialLinksAreEmpty && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center flex-wrap"
                >
                    {socialIcons.map(({ key, icon, link }, index) =>
                            link && (
                                <motion.span
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="p-1"
                                >
                                    <motion.a
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-slate-800 transition-colors"
                                    >
                                        <Icon icon={icon} width={24} height={24} />
                                    </motion.a>
                                </motion.span>
                            )
                    )}
                </motion.div>
            )}
            {data.ls && data.ls.length > 0 && (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                >
                    {data.ls.map((link: Link, index: number) => (
                        <motion.li
                            key={link.u}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                        >
                            <motion.a
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                href={link.u}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-100 bg-slate-50 transition-colors"
                            >
                                {link.i && link.i.startsWith('http') ? (
                                    <img src={link.i} alt={link.l} className="h-6 w-6" />
                                ) : (
                                    <Icon icon={link.i} width={24} height={24} />
                                )}
                                <span className="font-medium text-sm text-slate-800">
                  {link.l}
                </span>
                            </motion.a>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </motion.main>
    )
}