import React from 'react';
import { Check, ChevronDown, Tag as TagIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useDropdown } from '../../../hooks/useDropdown';
import { useTagsSelection } from '../../../hooks/useTagsSelection';
import { Button } from '../../common/Button';

interface TagDropdownProps {
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  icon?: LucideIcon;
  max?: number;
  disabled?: boolean;
  className?: string;
  showCount?: boolean;
  fullWidthDropdown?: boolean;
}

const TagDropdown: React.FC<TagDropdownProps> = ({
  value,
  onChange,
  label = 'Add tags',
  icon: Icon,
  max = 0,
  disabled,
  className = '',
  showCount = false,
  fullWidthDropdown = false
}) => {
  const { isOpen, toggle, containerRef } = useDropdown<HTMLDivElement>();
  const { tags, isLoading, isMaxReached, toggleTag } =
    useTagsSelection(value, onChange, disabled, max);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <Button
        type="button"
        disabled={disabled || isLoading}
        onClick={toggle}
        variant="ghost"
        className={`
          flex items-center justify-between gap-2 px-3 py-2 text-sm text-left bg-white border rounded-xl transition-all w-full
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-gray-400 border-gray-300'}
          ${isOpen ? '!border-[#6366F0] !ring-4 !ring-[#6366F0]/5' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon size={18} className={value.length > 0 ? 'text-[#6366f1]' : 'text-slate-400'} />
          ) : (
            <TagIcon size={18} className="text-slate-400" />
          )}
          <span className={value.length > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500 font-medium'}>
            {isLoading ? 'Loading...' : label}
          </span>
          {showCount && value.length > 0 && (
            <span className="ml-1 bg-[#6366f1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
              {value.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && !disabled && (
        <div className={`absolute z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-72 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${fullWidthDropdown ? 'w-full' : 'w-64'}`}>
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex justify-between items-center bg-[#F9FAFB]">
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Select Tags</span>
            {value.length > 0 && (
              <button
                onClick={() => onChange([])}
                className="text-xs text-[#6366f1] hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto p-2">
            {tags.length === 0 && !isLoading && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center italic">No tags found</div>
            )}
            <div className="space-y-0.5">
              {tags.map((tag) => {
                const isSelected = value.includes(tag.id);
                const canSelect = isSelected || !isMaxReached;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    disabled={!canSelect}
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all
                      ${!canSelect ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-[#4B5563] hover:bg-gray-50 hover:text-[#111827]'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ring-2 ring-white ${isSelected ? 'ring-[#6366F0]/20' : ''}`}
                        style={{ backgroundColor: tag.colorHex ?? '#CBD5E1' }}
                      />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    {isSelected && (
                      <div className="bg-[#6366F0] rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { TagDropdown };
