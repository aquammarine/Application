import { useNavigate } from "react-router-dom";
import { useCreateEventForm } from "../../hooks/useCreateEventForm";
import { useEventsStore } from "../../stores/events.store";
import { EventForm } from "../../components/events/EventForm";

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const { error: storeError } = useEventsStore();
    const {
        form,
        setForm,
        fieldErrors,
        handleSubmit,
        isSubmitting,
        selectedTagIds,
        setSelectedTagIds,
        tagsError
    } = useCreateEventForm();

    return (
        <EventForm
            title="Create Event"
            subtitle="Fill in the details to create an amazing event"
            form={form}
            setForm={setForm}
            fieldErrors={fieldErrors}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            selectedTagIds={selectedTagIds}
            setSelectedTagIds={setSelectedTagIds}
            tagsError={tagsError}
            storeError={storeError}
            submitButtonText="Create Event"
            onCancel={() => navigate(-1)}
        />
    );
};

export { CreateEvent };
