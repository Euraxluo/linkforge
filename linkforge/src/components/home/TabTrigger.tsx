import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";


interface TableActionProps {
    value: string;
    active: boolean;
    children: React.ReactNode
}

const TabTrigger: React.FC<TableActionProps> = ({value, active, children}: TableActionProps) => {
    return (
        <Tabs.Trigger
            value={value}
            className={`
                flex-1 text-center cursor-pointer px-4 py-2 transition-all duration-200 bg-opacity-60 hover:shadow-xl hover:bg-opacity-30
                ${active
                ? 'text-blue-600 font-semibold shadow-xl '
                : 'text-gray-100 hover:shadow-xl hover:bg-opacity-30'}`
            }>
            {children}
        </Tabs.Trigger>
    )
}

export default TabTrigger;