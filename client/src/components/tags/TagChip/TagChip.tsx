import { X } from 'lucide-react';
import type { Tag } from '../../../types/tag';

interface TagChipProps {
  tag: Tag;
  onRemove?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const TagChip: React.FC<TagChipProps> = ({ tag, onRemove, onClick, size = 'md' }) => {
  const bgColor = tag.colorHex ?? '#3B82F6';
  const textColor = '#FFFFFF';

  const sizeClasses = {
    sm: 'h-5 text-xs px-2',
    md: 'h-7 text-sm px-3',
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 rounded-full font-medium transition-opacity
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
      `}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span>{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export { TagChip };