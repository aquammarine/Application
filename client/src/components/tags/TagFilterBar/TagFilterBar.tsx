import React, { useEffect } from 'react';
import { useTagsStore } from '../../../stores/tagsStore';

interface TagFilterBarProps {
    activeTags: string[];
    onFilterChange: (tagIds: string[]) => void;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({ activeTags, onFilterChange }) => {
    const { tags, isLoading, fetchTags } = useTagsStore();

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleToggleTag = (tagId: string) => {
        if (activeTags.includes(tagId)) {
            onFilterChange(activeTags.filter(id => id !== tagId));
        } else {
            onFilterChange([...activeTags, tagId]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-2 items-center mb-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!isLoading && tags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 items-center mb-6">
            {tags.map(tag => {
                const isActive = activeTags.includes(tag.id);
                return (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        aria-pressed={isActive}
                        style={isActive ? { backgroundColor: tag.colorHex ?? '#3B82F6', color: '#fff' } : {}}
                        className={`
                            px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all
                            ${isActive
                                ? 'hover:opacity-80 shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-500'
                            }
                        `}
                    >
                        {tag.name}
                    </button>
                );
            })}

            {activeTags.length > 0 && (
                <button
                    onClick={() => onFilterChange([])}
                    className="text-sm text-gray-500 hover:text-gray-700 underline ml-1"
                >
                    Clear all
                </button>
            )}
        </div>
    );
};

export { TagFilterBar };
