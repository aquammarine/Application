import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook to manage event tag filtering and URL synchronization.
 */
export const useEventFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read active tags from URL
    const activeTags = useMemo(() => {
        const raw = searchParams.get('tags');
        return raw ? raw.split(',').filter(Boolean) : [];
    }, [searchParams]);

    // Update active tags in the URL
    const handleFilterChange = useCallback((tagIds: string[]) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (tagIds.length > 0) {
                next.set('tags', tagIds.join(','));
            } else {
                next.delete('tags');
            }
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    /**
     * Toggles a tag in the filter.
     */
    const handleTagClick = useCallback((tagId: string) => {
        if (!activeTags.includes(tagId)) {
            handleFilterChange([...activeTags, tagId]);
        }
    }, [activeTags, handleFilterChange]);

    /**
     * Removes a tag from the filter.
     */
    const handleRemoveTag = useCallback((tagId: string) => {
        handleFilterChange(activeTags.filter(id => id !== tagId));
    }, [activeTags, handleFilterChange]);

    /**
     * Clears all filters.
     */
    const clearFilters = useCallback(() => {
        handleFilterChange([]);
    }, [handleFilterChange]);

    return {
        activeTags,
        handleFilterChange,
        handleTagClick,
        handleRemoveTag,
        clearFilters
    };
};
