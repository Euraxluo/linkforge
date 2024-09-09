import {encode, decode} from "js-base64";

export const encodeData = (obj) => {
    return encode(JSON.stringify(obj));
};

export const decodeData = (base64) => JSON.parse(decode(base64));


export interface Link {
    id?: number
    u: string;
    l: string;
    i?: string;
}

export interface PreviewData {
    ls?: Link[],
    name?: string,
    about?: string,
    photoUrl?: string,
    Facebook?: string,
    X?: string,
    Instagram?: string,
    Email?: string,
    Github?: string,
    Telegram?: string,
    Whatsapp?: string,
    Youtube?: string,
    LinkedIn?: string,
    Mastodon?: string,
}


export function generateSocialIcons(data: PreviewData): { key: string; icon: string; link: string | null }[] {
    return [
        {key: 'Facebook', icon: "ph:facebook-logo-duotone", link: data.Facebook || null},
        {key: 'X', icon: "ph:x-logo-duotone", link: data.X || null},
        {key: 'Instagram', icon: "ph:instagram-logo-duotone", link: data.Instagram || null},
        {key: 'Github', icon: "ph:github-logo-duotone", link: data.Github || null},
        {key: 'Telegram', icon: "ph:telegram-logo-duotone", link: data.Telegram || null},
        {key: 'LinkedIn', icon: "ph:linkedin-logo-duotone", link: data.LinkedIn || null},
        {key: 'Email', icon: "ph:envelope-duotone", link: data.Email ? `mailto:${data.Email}` : null},
        {key: 'Youtube', icon: "ph:youtube-logo-duotone", link: data.Youtube || null},
        {
            key: 'Whatsapp',
            icon: "ph:whatsapp-logo-duotone",
            link: data.Whatsapp ? `https://wa.me/${data.Whatsapp}` : null
        },
        {
            key: 'Mastodon',
            icon: "ph:mastodon-logo-duotone",
            link: data.Mastodon ? `https://mastodon.social/@${data.Mastodon}` : null
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