import { Input, Header } from "../../components/common";
import { Search, Filter } from "lucide-react";
import { EventList } from "../../components/events/EventList";
import { useState, useEffect } from "react";
import { TagDropdown } from "../../components/tags/TagDropdown";
import { useEventsStore } from "../../stores/events.store";
import { useEventFilters } from "../../hooks/useEventFilters";
import { EventsEmptyState } from "../../components/events/EventsEmptyState/EventsEmptyState";
import { ActiveTagsList } from "../../components/tags/ActiveTagsList/ActiveTagsList";

const Events: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { events, fetchAllEvents, isLoading } = useEventsStore();

    const {
        activeTags,
        handleFilterChange,
        handleTagClick,
        handleRemoveTag,
        clearFilters
    } = useEventFilters();

    useEffect(() => {
        fetchAllEvents(activeTags);
    }, [activeTags, fetchAllEvents]);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-8 flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                </div>
            );
        }

        if (filteredEvents.length === 0) {
            return (
                <EventsEmptyState
                    activeTags={activeTags}
                    onRemoveTag={handleRemoveTag}
                    onClearFilters={clearFilters}
                />
            );
        }

        return (
            <EventList
                searchQuery={searchQuery}
                activeTags={activeTags}
                onTagClick={handleTagClick}
            />
        );
    };

    return (
        <div className="pb-20">
            <Header title="Discover Events" subtitle="Find and join exciting events happening around you" className="mt-10" />

            <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-full max-w-md">
                        <Input
                            placeholder="Search events..."
                            icon={Search}
                            className="!rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <TagDropdown
                        value={activeTags}
                        onChange={handleFilterChange}
                        label="Filter"
                        icon={Filter}
                        showCount
                    />
                </div>

                <ActiveTagsList
                    activeTags={activeTags}
                    onRemoveTag={handleRemoveTag}
                    onClearAll={clearFilters}
                />
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export { Events };