import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import useAssistantStore from '../../../stores/assistantStore';
import type { Message } from '../../../stores/assistantStore';
import { SuggestedQuestions } from '../SuggestedQuestions/SuggestedQuestions';
import { Button } from '../../common/Button';

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      <div
        className={`px-4 py-2 max-w-[85%] ${isUser
          ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm'
          }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
      </div>
      <span className="text-xs text-gray-400 mt-1 mx-2">{timeString}</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start mb-4">
      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-0" />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75" />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
      </div>
    </div>
  );
}

export function AssistantPanel() {
  const { messages, isLoading, error, ask, retry, clearError } = useAssistantStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (input.trim().length < 2 || isLoading) return;
    const q = input.trim();
    setInput('');
    await ask(q);
  };

  const handleSelect = async (question: string) => {
    setInput('');
    await ask(question);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={handleSelect} />
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-orange-50 border-t border-orange-200 flex items-center justify-between">
          <span className="text-sm text-orange-700">{error}</span>
          <div className="flex gap-2">
            <Button onClick={retry} variant="ghost" className="text-sm text-orange-700 hover:text-orange-800 underline p-0 h-auto font-normal">Retry</Button>
            <Button onClick={clearError} variant="ghost" className="text-orange-400 hover:text-orange-600 p-0 h-auto" aria-label="Clear error">✕</Button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 p-3 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your events..."
          disabled={isLoading}
          rows={1}
          maxLength={500}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
                     max-h-24 overflow-y-auto"
          aria-label="Ask about your events"
          aria-describedby="char-count"
        />
        {input.length > 400 && (
          <span id="char-count" className="text-xs text-gray-400 self-end pb-2">
            {input.length}/500
          </span>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || input.trim().length < 2}
          variant="primary"
          className="p-2 !rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end border-none"
          aria-label="Send question"
        >
          <SendHorizontal className="w-5 h-5 flex-shrink-0" />
        </Button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {messages[messages.length - 1]?.role === 'assistant'
          ? messages[messages.length - 1].text : ''}
      </div>
    </div>
  );
}
