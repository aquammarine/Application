import React from 'react';
import { TagChip } from "../../tags/TagChip/TagChip";
import type { EventTag } from "../../../types/tag";

interface EventTagsSectionProps {
    tags?: EventTag[];
}

const EventTagsSection: React.FC<EventTagsSectionProps> = ({ tags }) => {
    return (
        <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags && tags.length > 0
                    ? tags.map(et => <TagChip key={et.tagId} tag={et.tag} size="md" />)
                    : <span className="text-sm text-gray-400">No tags</span>
                }
            </div>
        </div>
    );
};

export { EventTagsSection };
