import {areAllSocialLinksEmpty, generateSocialIcons, Link, PreviewData} from "../utils";
import {Icon} from "@iconify-icon/react";
import * as React from "react";
import {LinkPreview} from "../Preview";

interface ProfileTemplateProps {
    data: PreviewData;
}

export const Template: React.FC<ProfileTemplateProps> = ({data}) => {

    const socialIcons = generateSocialIcons(data)
    const allSocialLinksAreEmpty = areAllSocialLinksEmpty(socialIcons);

    return (
        <main className="p-4 bg-white min-h-screen w-full space-y-8 pt-12 max-w-lg mx-auto">
            <div className="text-center">
                {data.photoUrl && (
                    <div className="h-20 w-20 rounded-full overflow-hidden ring ring-slate-200 mx-auto">
                        <img src={data.photoUrl} alt={data.name} className="h-full w-full object-cover"/>
                    </div>
                )}
                {data.name && <h1 className="text-2xl font-bold mt-4 text-slate-800">{data.name}</h1>}
                {data.about && <p className="text-sm mt-2 text-slate-600">{data.about}</p>}
            </div>
            {!allSocialLinksAreEmpty && (
                <div className="flex items-center justify-center flex-wrap">
                    {socialIcons.map(({key, icon, link}) =>
                            link && (
                                <span key={key} className="p-1">
                                    <a href={link} target="_blank" rel="noopener noreferrer"
                                       className="text-slate-600 hover:text-slate-800 transition-colors">
                                        <Icon icon={icon} width={24} height={24}/>
                                    </a>
                                </span>
                            )
                    )}
                </div>
            )}
            {data.ls && data.ls.length > 0 && (
                <ul className="space-y-2">
                    {data.ls.map((link: Link) => (
                        <li key={link.id || link.u}>
                            <a
                                href={link.u}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-100 bg-slate-50 transition-colors"
                            >
                                {link.i && (link.i.startsWith('http')) ? (
                                    <img src={link.i} alt={link.l} className="h-6 w-6"/>
                                ) : (
                                    <Icon icon={link.i} width={24} height={24}/>
                                )}
                                <span className="font-medium text-sm text-slate-800">
                                    {link.l}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};