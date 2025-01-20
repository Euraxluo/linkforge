import {PreviewData} from "@/lib/utils";
import {useRef, useState} from "react";
import * as React from "react";
import {Icon} from "@iconify-icon/react";
import {X} from "lucide-react";

interface SocialMedia {
    key: string
    name: string
    icon: string
    placeholder: string
}

function SocialLinksForm({data, updateData}: {
    data: PreviewData,
    updateData: (data: Partial<PreviewData>) => void
}) {
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const clearButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const handleChange = (e: React.ChangeEvent) => {
        updateData({[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value});
    };

    const handleInputBlur = (name: string, e: React.FocusEvent) => {
        if (e.relatedTarget !== clearButtonRefs.current[name]) {
            setFocusedField(null)
        }
    }
    const clearInput = (name: string) => {
        updateData({[name]: ''});
    };
    const socialMedias: SocialMedia[] = [
        {
            key: 'f',
            name: 'Facebook',
            icon: "ph:facebook-logo-duotone",
            placeholder: 'https://fb.com/username',
        },
        {
            key: 'x',
            name: 'X',
            icon: "ph:x-logo-duotone",
            placeholder: 'https://x.com/username',
        },
        {
            key: 'ig',
            name: 'Instagram',
            icon: "ph:instagram-logo-duotone",
            placeholder: 'https://instagram.com/username',
        },
        {
            key: 'gh',
            name: 'Github',
            icon: "ph:github-logo-duotone",
            placeholder: 'https://github.com/username',
        },
        {
            key: 'tg',
            name: 'Telegram',
            icon: "ph:telegram-logo-duotone",
            placeholder: 'https://t.me/username',
        },
        {
            key: 'lk',
            name: 'LinkedIn',
            icon: "ph:linkedin-logo-duotone",
            placeholder: 'https://linkedin.com/in/username',
        },
        {
            key: 'e',
            name: 'Email',
            icon: "ph:envelope-duotone",
            placeholder: 'email@example.com',
        },
        {
            key: 'y',
            name: 'Youtube',
            icon: "ph:youtube-logo-duotone",
            placeholder: 'https://youtube.com/username',
        },
        {
            key: 'w',
            name: 'Whatsapp',
            icon: "ph:whatsapp-logo-duotone",
            placeholder: '+1234567890',
        },
        {
            key: 'm',
            name: 'Mastodon',
            icon: "ph:mastodon-logo-duotone",
            placeholder: 'https://mastodon.social/@username',
        }
    ]

    return (
        <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 bg-white px-4 py-4 sm:p-6">
                {socialMedias.map(sm => (
                    <div key={sm.key} className="mb-4">
                        <label htmlFor={sm.key} className="block text-sm font-normal text-gray-700 mb-1">
                            {sm.name}
                        </label>
                        <div className="mt-1 flex relative rounded-md shadow-sm">
                            <span
                                className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                                <Icon icon={sm.icon} width={20} height={20}></Icon>
                            </span>
                            <input
                                name={sm.key}
                                id={sm.key}
                                type="text"
                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={sm.placeholder}
                                value={(data[sm.key] as string) ?? ''}
                                onChange={handleChange}
                                onFocus={() => setFocusedField(sm.key)}
                                onBlur={(e) => handleInputBlur(sm.key, e)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                {focusedField === sm.key && data[sm.key] && (
                                    <button
                                        type="button"
                                        // 修复后的代码
                                        ref={(el: HTMLButtonElement | null) => {
                                            if (el !== null) {
                                                clearButtonRefs.current[sm.key] = el;
                                            }
                                        }}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs rounded text-blue-600 hover:text-blue-800 focus:outline-none"
                                        onClick={() => clearInput(sm.key)}>
                                        <X className="h-4 w-4 stroke-[4px]"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SocialLinksForm;