import { Button } from '../../common/Button';

const SUGGESTIONS = [
  "What's my next event?",
  "What events am I attending this week?",
  "List all events I organize",
  "Show my Tech events",
  "What happened last week?",
  "Who's coming to events I run?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-3">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((q) => (
          <Button
            key={q}
            type="button"
            variant="chip"
            onClick={() => onSelect(q)}
          >
            {q}
          </Button>
        ))}
      </div>
    </div>
  );
}
