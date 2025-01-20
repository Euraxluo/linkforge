import {PreviewData} from "@/lib/utils";
import {Template as SimpleTemplate} from "@/components/template/Simple";
import {Template as DynamicTemplate} from "@/components/template/Dynamic";
import {AnimatePresence, motion} from "framer-motion";
import * as React from "react";

interface PreviewProps {
    template: string;
    data: PreviewData;
}

function Preview({data, template}: PreviewProps) {
    const templateComponents = {
        simple: SimpleTemplate,
        dynamic: DynamicTemplate,
    };

    const SelectedTemplate = templateComponents[template as keyof typeof templateComponents];

    return (
        <div className="h-screen grid place-items-center relative">
            <motion.div
                className="w-[150px] h-[512px] md:w-[340px] md:h-[729px] overflow-hidden rounded-[3rem] ring-8 ring-slate-800 bg-white shadow-xl"
                initial={{scale: 0.9, y: 50}}
                animate={{scale: 1, y: 0}}
                transition={{type: "spring", stiffness: 260, damping: 20}}
            >
                <div className="h-full overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <SelectedTemplate data={data}/>;
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}


export default Preview;