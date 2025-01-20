import {Link} from "@/lib/utils";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {GripVertical, X} from "lucide-react";
import * as React from "react";
import EnhancedAddButton from "@/components/mint/EnhancedAddButton";

function LinksForm({data, updateData}: { data: { ls: Link[] }, updateData: (data: { ls: Link[] }) => void }) {
    const handleChange = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...data.ls]
        newLinks[index][field] = value
        updateData({ls: newLinks})
    }

    const addLink = () => {
        updateData({ls: [...data.ls, {i: '', l: '', u: ''}]})
    }

    const removeLink = (index: number) => {
        const newLinks = [...data.ls]
        newLinks.splice(index, 1)
        updateData({ls: newLinks})
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newLinks = Array.from(data.ls);
        const [reorderedItem] = newLinks.splice(result.source.index, 1);
        newLinks.splice(result.destination.index, 0, reorderedItem);

        updateData({ls: newLinks});
    };
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"links"}>
                    {(provided) => (
                        <div {...provided.droppableProps}
                             ref={provided.innerRef}
                        >
                            <div className="mt-1 text-xs text-gray-600">
                                icon keys can be found in <br/>
                                <a className="underline" href="https://icon-sets.iconify.design/">
                                    https://icon-sets.iconify.design/
                                </a>
                            </div>
                            {data.ls.map((link, index) => (
                                <Draggable key={`link-${index}`} draggableId={`link-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="relative mb-6 group"
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="absolute top-2 -left-8 cursor-move"
                                            >
                                                <GripVertical className="h-6 w-6 text-slate-500"/>
                                            </div>
                                            <button
                                                onClick={() => removeLink(index)}
                                                className="hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-slate-300 text-slate-600 absolute -right-3 -top-3"
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`iconKey-${index}`}>
                                                                Icon
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="icon"
                                                                id={`iconKey-${index}`}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                value={link.i}
                                                                onChange={(e) => handleChange(index, 'i', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`label-${index}`}>
                                                                Label
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id={`label-${index}`}
                                                                value={link.l}
                                                                onChange={(e) => handleChange(index, 'l', e.target.value)}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700"
                                                                   htmlFor={`url-${index}`}>
                                                                URL
                                                            </label>
                                                            <input
                                                                type="url"
                                                                id={`url-${index}`}
                                                                value={link.u}
                                                                onChange={(e) => handleChange(index, 'u', e.target.value)}
                                                                className="w-full px-3 py-2 pr-8 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <EnhancedAddButton onClick={addLink}/>
        </div>
    )
}


export default LinksForm;