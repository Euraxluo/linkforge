// 编码函数
export const encodeData = (obj: any) => {
    const jsonString = JSON.stringify(obj);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let base64 = btoa(String.fromCharCode.apply(null, utf8Bytes));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

// 解码函数
export const decodeData = (encodedData: string) => {
    // 添加回可能被移除的 '=' 填充
    encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    const pad = encodedData.length % 4;
    if (pad) {
        encodedData += '='.repeat(4 - pad);
    }

    const binaryString = atob(encodedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    return JSON.parse(jsonString);
};

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

export function extractDataFromURL(link: string): {
    template: string;
    data: PreviewData;
} {
    // Step 1: Extract the template
    const templateMatch = link.match(/#\/([^?]+)/);
    const template = templateMatch ? templateMatch[1] : 'default';

    // Step 2: Extract the data parameter
    const dataParam = link.split('data=')[1];
    if (!dataParam) {
        throw new Error('No data parameter found in the URL');
    }

    // Step 3: Parse the JSON
    try {
        const parsedData: PreviewData = decodeData(dataParam);
        return {
            template,
            data: parsedData
        };
    } catch (error) {
        throw new Error('Failed to parse JSON data');
    }
}

