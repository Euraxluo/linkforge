import {useState} from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {MenuIcon, X} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import Link from 'next/link';

interface MenuItem {
    label: string;
    href: string;
}

interface MobileMenuProps {
    menuItems: MenuItem[];
}

function MobileMenu({menuItems}: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.div
                    className="ml-2 p-1 rounded-md bg-blue-500 text-white cursor-pointer"
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <AnimatePresence initial={false} mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{rotate: -90, opacity: 0}}
                                animate={{rotate: 0, opacity: 1}}
                                exit={{rotate: 90, opacity: 0}}
                                transition={{duration: 0.2}}
                            >
                                <X className="h-6 w-6"/>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{rotate: 90, opacity: 0}}
                                animate={{rotate: 0, opacity: 1}}
                                exit={{rotate: -90, opacity: 0}}
                                transition={{duration: 0.2}}
                            >
                                <MenuIcon className="h-6 w-6"/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="sr-only">Toggle navigation menu</span>
                </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="bg-blue-600 bg-opacity-90 text-white">
                <motion.div
                    className="grid gap-4 py-6"
                    initial={{opacity: 0, x: 50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{staggerChildren: 0.1, delayChildren: 0.2}}
                >
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                        >
                            <Link
                                href={item.href}
                                className="block py-2 px-4 text-lg hover:bg-blue-700 rounded transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}

export default MobileMenu;