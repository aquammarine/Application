import React from 'react';
import { Button, Card, Error, FormField, Header, InfoItem, RadioGroup, TextArea } from '../../common';
import { TagsMultiSelect } from '../../tags/TagsMultiSelect/TagsMultiSelect';
import type { EventFormFieldValues } from '../../../types/events.type';
import { ArrowLeft } from 'lucide-react';

interface EventFormProps {
    title: string;
    subtitle: string;
    form: EventFormFieldValues;
    setForm: (form: EventFormFieldValues) => void;
    fieldErrors: Partial<Record<keyof EventFormFieldValues, string>>;
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    selectedTagIds: string[];
    setSelectedTagIds: (ids: string[]) => void;
    tagsError: string | null;
    storeError: string | null;
    submitButtonText: string;
    onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
    title,
    subtitle,
    form,
    setForm,
    fieldErrors,
    handleSubmit,
    isSubmitting,
    selectedTagIds,
    setSelectedTagIds,
    tagsError,
    storeError,
    submitButtonText,
    onCancel
}) => {
    return (
        <form
            className="flex flex-col justify-center items-center gap-6 my-6"
            onSubmit={handleSubmit}
        >
            <div className="w-full max-w-2xl">
                <Button type="button" variant="ghost" onClick={onCancel} icon={ArrowLeft}>
                    Back
                </Button>
            </div>
            <Card className="w-full max-w-2xl flex flex-col gap-8 p-8">
                <Header
                    title={title}
                    subtitle={subtitle}
                    variant="lg"
                    className="flex flex-col items-center self-start"
                />

                {fieldErrors.title && !form.title && <Error message={fieldErrors.title} />}
                {storeError && <Error message={storeError} />}
                {tagsError && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                        {tagsError}
                    </div>
                )}

                <FormField
                    id="title"
                    label="Event Title"
                    name="title"
                    type="text"
                    placeholder="e.g. Tech Conference 2024"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    error={fieldErrors.title}
                />
                <TextArea
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Describe what makes your event special..."
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    error={fieldErrors.description}
                />
                <div className="flex gap-2">
                    <FormField
                        id="date"
                        label="Date"
                        name="date"
                        type="date"
                        className="w-full"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        error={fieldErrors.date}
                    />
                    <FormField
                        id="time"
                        label="Time"
                        name="time"
                        type="time"
                        className="w-full"
                        required
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        error={fieldErrors.time}
                    />
                </div>
                <FormField
                    id="location"
                    label="Location"
                    name="location"
                    type="text"
                    placeholder="e.g. Convention Center, San Francisco"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    error={fieldErrors.location}
                />
                <div className="flex flex-col gap-2">
                    <FormField
                        id="capacity"
                        label="Capacity (optional)"
                        name="capacity"
                        type="number"
                        placeholder="Leave empty for unlimited"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                        error={fieldErrors.capacity}
                    />
                    <InfoItem
                        text={"Maximum number of participants. Leave empty or set to 0 for unlimited capacity."}
                    />
                </div>

                <div className="-mt-4 flex flex-col gap-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags <span className="text-gray-400 font-normal">(optional, max 5)</span>
                    </label>
                    <TagsMultiSelect
                        value={selectedTagIds}
                        onChange={setSelectedTagIds}
                    />
                </div>

                <RadioGroup
                    label="Visibility"
                    name="visibility"
                    options={[
                        { label: "Public - Anyone can see and join this event", value: "public" },
                        { label: "Private - Only invited people can see this event", value: "private" },
                    ]}
                    value={form.isPublic ? "public" : "private"}
                    onChange={(value) => setForm({ ...form, isPublic: value === "public" })}
                />
                <div className="flex gap-4 h-fit">
                    <Button
                        type="button"
                        variant="ghost"
                        className="border border-slate-200 bg-[#FCFCFD] w-full p-0"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full p-0"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : submitButtonText}
                    </Button>
                </div>
            </Card>
        </form>
    );
};

export { EventForm };
