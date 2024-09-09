import {encode, decode} from "js-base64";

export const encodeData = (obj) => {
    return encode(JSON.stringify(obj));
};

export const decodeData = (base64) => JSON.parse(decode(base64));


export interface Link {
    u: string;
    l: string;
    i?: string;
}

export interface PreviewData {
    ls?: Link[],
    n?: string,
    b?: string,
    u?: string,
    f?: string,
    x?: string,
    ig?: string,
    e?: string,
    gh?: string,
    tg?: string,
    w?: string,
    y?: string,
    lk?: string,
    m?: string,
}


export function generateSocialIcons(data: PreviewData): { key: string; icon: string; link: string | null }[] {
    return [
        {key: 'Facebook', icon: "ph:facebook-logo-duotone", link: data.f || null},
        {key: 'X', icon: "ph:x-logo-duotone", link: data.x || null},
        {key: 'Instagram', icon: "ph:instagram-logo-duotone", link: data.ig || null},
        {key: 'Github', icon: "ph:github-logo-duotone", link: data.gh || null},
        {key: 'Telegram', icon: "ph:telegram-logo-duotone", link: data.tg || null},
        {key: 'LinkedIn', icon: "ph:linkedin-logo-duotone", link: data.lk || null},
        {key: 'Email', icon: "ph:envelope-duotone", link: data.e ? `mailto:${data.e}` : null},
        {key: 'Youtube', icon: "ph:youtube-logo-duotone", link: data.y || null},
        {
            key: 'Whatsapp',
            icon: "ph:whatsapp-logo-duotone",
            link: data.w ? `https://wa.me/${data.w}` : null
        },
        {
            key: 'Mastodon',
            icon: "ph:mastodon-logo-duotone",
            link: data.m ? `https://mastodon.social/@${data.m}` : null
        },
    ];
}

export function areAllSocialLinksEmpty(socialIcons: { key: string; link: string | null }[]): boolean {
    return socialIcons.every(icon => {
        if (icon.key === 'Email') {
            return !icon.link;
        } else if (icon.key === 'Whatsapp') {
            return !icon.link;
        }
        return !icon.link;
    });
}