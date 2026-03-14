import React from 'react';
import { TagChip } from '../../tags/TagChip/TagChip';
import type { EventTag } from '../../../types/tag';

interface EventTagListProps {
    tags?: EventTag[];
    onTagClick?: (tagId: string) => void;
    maxDisplay?: number;
    className?: string;
}

const EventTagList: React.FC<EventTagListProps> = ({
    tags,
    onTagClick,
    maxDisplay = 3,
    className = "flex flex-wrap gap-1 mt-2"
}) => {
    if (!tags || tags.length === 0) return null;

    const displayedTags = tags.slice(0, maxDisplay);
    const remainingCount = tags.length - maxDisplay;

    return (
        <div className={className}>
            {displayedTags.map(et => (
                <TagChip
                    key={et.tagId}
                    tag={et.tag}
                    size="sm"
                    onClick={() => {
                        onTagClick?.(et.tagId);
                    }}
                />
            ))}
            {remainingCount > 0 && (
                <span className="text-xs text-slate-400 self-center ml-1">
                    +{remainingCount} more
                </span>
            )}
        </div>
    );
};

export { EventTagList };
