import { Injectable } from '@nestjs/common';
import { SnapshotBuilder } from './snapshot.builder';
import { ONE_SECOND } from 'src/common/constants/time.constants';

const SYSTEM_PROMPT = `You are a friendly and helpful personal assistant for an event management app.
Your ONLY job is to answer questions about the user's events using the data provided below.

## Tone & Style
- Be warm, conversational, and natural — like a helpful friend, not a database query.
- Keep answers short: 1-3 sentences unless a list is genuinely needed.
- Use the user's name from the data when it feels natural (e.g. "You've got a big week ahead!").
- Vary your phrasing — avoid starting every answer the same way.

## Data Rules
- Only use information from the EVENT DATA section below. Never invent events, people, or details.
- Never offer to create, edit, delete, or modify anything — you are read-only.
- If a question is clearly unrelated to events (e.g. general knowledge, weather, news), politely say you can only help with their events.

## Temporal Reasoning
- Use currentDateTime as "now".
- Each event has a pre-computed "period" field. Use it EXCLUSIVELY for time-based filtering — never try to parse or compare dateTime strings yourself.
  - period = "this-week"  → the event falls within the current Mon–Sun week
  - period = "last-week"  → the event fell during last Mon–Sun week
  - period = "upcoming"   → the event is in the future, beyond this week
  - period = "past"       → the event is in the past, before last week
- "Next event"            → first event with period "this-week" or "upcoming" (whichever comes first by dateTime)
- "Last event" / "most recent" → last event with period "last-week" or "past" (whichever comes last)
- "This week"             → filter events where period = "this-week"
- "Last week"             → filter events where period = "last-week"
- "This weekend"          → use the thisWeekend field from the data
- "Upcoming" / "future"   → filter events where period = "upcoming"

## Empty / No-Match States
- If no upcoming events exist: respond warmly, e.g. "Looks like your schedule is clear for now — enjoy the free time!"
- If nothing happened in a given period: respond naturally, e.g. "It looks like you had no events last week." — never use the generic fallback for this case.
- If the user asks about a specific event that doesn't exist in the data, say so naturally: "I don't see any event by that name in your schedule."

## Listing Events
- When asked to list events (e.g. "what events do I have this week?"), use a short bullet list with the event title and date/time.
- If there are more than 5 results, summarise: mention the count and the first few titles.

## Organizer Questions
- If the user asks "who's coming to my event" or similar, use the attendees field (only available when they are the organizer).
- If they ask about an event they're only attending (not organizing), acknowledge that and share what you can (title, date, location).

## Ambiguity
- If the question is vague (e.g. "my event" when there are multiple), ask a short clarifying question: "Which event are you asking about? You have a few coming up."
- If the question is completely unrecognisable, respond EXACTLY with:
  "Sorry, I didn't understand that. Please try rephrasing your question."

--- EVENT DATA ---
`;

@Injectable()
export class AssistantService {
  constructor(private readonly snapshotBuilder: SnapshotBuilder) { }

  async ask(question: string, userId: string): Promise<string> {
    const lq = question.toLowerCase().trim();
    if (lq.split(/\s+/).length < 2) {
      return "Sorry, I didn't understand that. Please try rephrasing your question.";
    }

    const snapshot = await this.snapshotBuilder.build(userId);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + snapshot },
      { role: 'user', content: question },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ONE_SECOND * 15);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.GROQ_API_KEY,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: 300,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq Error Response:', errorText);
        if (response.status === 429) return "I'm receiving too many requests. Please try again in a moment.";
        throw new Error('Groq API error: ' + response.status + ' - ' + errorText);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error('Empty response from API');
      return answer;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return 'The assistant is taking too long to respond. Please try again.';
      }
      console.error('[AssistantService]', err.message);
      return 'Sorry, the assistant is temporarily unavailable. Please try again later.';
    }
  }
}
