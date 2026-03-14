import React from 'react';
import { TagChip } from '../TagChip/TagChip';
import { useTagsStore } from '../../../stores/tagsStore';
import { X } from 'lucide-react';

interface ActiveTagsListProps {
    activeTags: string[];
    onRemoveTag: (tagId: string) => void;
    onClearAll: () => void;
}

export const ActiveTagsList: React.FC<ActiveTagsListProps> = ({
    activeTags,
    onRemoveTag,
    onClearAll
}) => {
    const { getTagById } = useTagsStore();

    if (activeTags.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg mr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Filters</span>
                <span className="w-4 h-4 flex items-center justify-center bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md">
                    {activeTags.length}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {activeTags.map(tagId => {
                    const tag = getTagById(tagId);
                    return tag ? (
                        <TagChip
                            key={tagId}
                            tag={tag}
                            size="sm"
                            onRemove={() => onRemoveTag(tagId)}
                        />
                    ) : null;
                })}
            </div>

            <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
            >
                <X size={14} />
                <span>Clear all</span>
            </button>
        </div>
    );
};
