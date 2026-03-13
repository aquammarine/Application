import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditEventForm } from "../../hooks/useEditEventForm";
import { useEventsStore } from "../../stores/events.store";
import { EventForm } from "../../components/events/EventForm";

const EditEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { error: storeError } = useEventsStore();
    const {
        form,
        setForm,
        fieldErrors,
        handleSubmit,
        isSubmitting,
        isLoading,
        selectedTagIds,
        setSelectedTagIds,
        tagsError
    } = useEditEventForm(id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!id) {
        return <div className="text-red-500 text-center py-10">Event ID is required</div>;
    }

    return (
        <EventForm
            title="Edit Event"
            subtitle="Update your event details"
            form={form}
            setForm={setForm}
            fieldErrors={fieldErrors}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            selectedTagIds={selectedTagIds}
            setSelectedTagIds={setSelectedTagIds}
            tagsError={tagsError}
            storeError={storeError}
            submitButtonText="Update Event"
            onCancel={() => navigate(-1)}
        />
    );
};

export { EditEvent };
