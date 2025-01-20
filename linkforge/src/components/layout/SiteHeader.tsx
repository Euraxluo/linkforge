"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from '@iconify-icon/react';
import SiteConnectButton from "@/components/layout/SiteConnectButton";
import MobileMenu from "@/components/layout/SiteMobileMenu";
import {siteConfig} from "@/config/site";

const menuItems = siteConfig.siteMenu;

const NavLink = ({href, children}: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            className={`hover:underline transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 ${
                isActive ? "text-cyan-300" : "text-white"
            }`}
            href={href}
        >
            {children}
        </Link>
    );
};

function SiteHeader() {
    return (
        <header className="bg-blue-600 bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex justify-between items-center">
                    <Link href="/"
                          className="text-2xl font-bold flex items-center transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
                        <Icon
                            icon="game-icons:coral"
                            className="fill-emerald-400 mr-2 stroke-emerald-400 stroke-[10px] hover:stroke-emerald-400 hover:stroke-[4px]"
                        />
                        LinkForge
                    </Link>
                    <div className="hidden md:flex space-x-4 items-center">
                        {menuItems.map((item, index) => (
                            <NavLink key={index} href={item.href}>
                                {item.label}
                            </NavLink>
                        ))}
                        <SiteConnectButton/>
                    </div>
                    <div className="md:hidden flex items-center">
                        <SiteConnectButton/>
                        <MobileMenu menuItems={menuItems}/>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default SiteHeader;