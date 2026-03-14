import { useTagsSelection } from '../../../hooks/useTagsSelection';
import { TagChip } from '../TagChip/TagChip';
import { TagDropdown } from '../TagDropdown';

interface TagsMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function TagsMultiSelect({ value, onChange, disabled }: TagsMultiSelectProps) {
  const { selectedTags, removeTag } = useTagsSelection(value, onChange, disabled);

  return (
    <div className="relative inline-block w-full">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(
            (tag) =>
              tag && (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  onRemove={disabled ? undefined : () => removeTag(tag.id)}
                />
              )
          )}
        </div>
      )}

      <TagDropdown
        value={value}
        onChange={onChange}
        disabled={disabled}
        max={5}
        className="w-full"
        fullWidthDropdown
      />
    </div>
  );
}
