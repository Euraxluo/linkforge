import {useState, useCallback} from 'react'
import {useCurrentAccount} from "@mysten/dapp-kit"
import {useLinkData} from './useLinkData'
import {encodeData} from "../utils";

export type ThemePreset = 'default' | 'neon' | 'pastel' | 'dark'

interface UserWidgetProps {
    onConnect?: () => void
    className?: string
    theme?: ThemePreset
    customColors?: {
        from: string
        to: string
        text: string
        hover: string
    }
    size?: 'sm' | 'md' | 'lg'
    showAvatar?: boolean
    showName?: boolean
    rounded?: 'full' | 'lg' | 'md'
}

const themePresets: Record<ThemePreset, UserWidgetProps['customColors']> = {
    default: {
        from: 'from-purple-500',
        to: 'to-pink-500',
        text: 'text-white',
        hover: 'hover:from-purple-600 hover:to-pink-600',
    },
    neon: {
        from: 'from-green-400',
        to: 'to-blue-500',
        text: 'text-white',
        hover: 'hover:from-green-500 hover:to-blue-600',
    },
    pastel: {
        from: 'from-pink-300',
        to: 'to-purple-300',
        text: 'text-gray-800',
        hover: 'hover:from-pink-400 hover:to-purple-400',
    },
    dark: {
        from: 'from-gray-800',
        to: 'to-gray-900',
        text: 'text-gray-100',
        hover: 'hover:from-gray-900 hover:to-black',
    },
}

const sizeClasses = {
    sm: {
        container: 'h-8',
        avatar: 'w-6 h-6',
        text: 'text-xs',
    },
    md: {
        container: 'h-10',
        avatar: 'w-8 h-8',
        text: 'text-sm',
    },
    lg: {
        container: 'h-12',
        avatar: 'w-10 h-10',
        text: 'text-base',
    },
}

export default function UserWidget({
                                       onConnect,
                                       className = '',
                                       theme = 'default',
                                       customColors,
                                       size = 'md',
                                       showAvatar = true,
                                       showName = true,
                                       rounded = 'full',
                                   }: UserWidgetProps) {
    const [isHovered, setIsHovered] = useState(false)
    const currentAccount = useCurrentAccount()
    const {linkData} = useLinkData()

    const colors = customColors || themePresets[theme]
    const sizeClass = sizeClasses[size]

    const displayName = linkData?.display.name || (currentAccount?.address ? currentAccount?.address?.slice(0, 6) + "..." + currentAccount?.address?.slice(-4) : '') || "Connect Wallet"
    const imageUrl = linkData?.display.image_url

    const handleMouseEnter = useCallback(() => setIsHovered(true), [])
    const handleMouseLeave = useCallback(() => setIsHovered(false), [])

    return (
        <div
            className={`
        flex items-center space-x-2 bg-gradient-to-r ${colors.from} ${colors.to} ${colors.hover}
        px-3 py-1 rounded-${rounded} shadow-lg cursor-pointer
        transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl
        ${sizeClass.container} ${className}
      `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={currentAccount ? () => {
                if (window.open) {
                    window.open(linkData?.display.link, '_blank').focus();
                }
            } : onConnect}
        >
            {showAvatar && imageUrl && (
                <div
                    className={`
            bg-white p-0.5 rounded-full flex-shrink-0
            transition-all duration-500 ease-in-out
            ${isHovered ? 'rotate-360 scale-110' : 'rotate-0 scale-100'}
            ${linkData ? 'opacity-100' : 'opacity-0'}
          `}
                >
                    <div
                        className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white ${sizeClass.avatar}`}>
                        <img src={imageUrl} alt="User avatar" className="w-full h-full object-cover"/>
                    </div>
                </div>
            )}
            {showName && (
                <span
                    className={`
            font-bold ${colors.text} ${sizeClass.text}
            transition-all duration-300 ease-in-out
            ${isHovered ? 'translate-x-0.5' : 'translate-x-0'}
            truncate flex-grow
          `}
                >
          {displayName}
        </span>
            )}
            <span className={`sr-only ${colors.text}`}>
        {currentAccount ? 'User account' : 'Connect wallet'}
      </span>
        </div>
    )
}