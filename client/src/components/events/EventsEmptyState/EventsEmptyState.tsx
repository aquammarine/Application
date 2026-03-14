import React from 'react';
import { TagChip } from '../../tags/TagChip/TagChip';
import { useTagsStore } from '../../../stores/tagsStore';

interface EventsEmptyStateProps {
    activeTags: string[];
    onRemoveTag: (tagId: string) => void;
    onClearFilters: () => void;
}

export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
    activeTags,
    onRemoveTag,
    onClearFilters
}) => {
    const { getTagById } = useTagsStore();

    if (activeTags.length > 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 text-lg font-medium mb-2">
                    No events match the selected tags.
                </p>
                <p className="text-gray-400 text-sm mb-6">
                    Try removing some filters to see more events.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {activeTags.map(tagId => {
                        const tag = getTagById(tagId);
                        return tag ? (
                            <TagChip
                                key={tagId}
                                tag={tag}
                                size="md"
                                onRemove={() => onRemoveTag(tagId)}
                            />
                        ) : null;
                    })}
                </div>
                <button
                    onClick={onClearFilters}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className="mt-8 py-12 text-center text-slate-500">
            No public events yet.
        </div>
    );
};
