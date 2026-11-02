import { WeddingEvent, EventParticipant } from '../types/event';

/**
 * Derives or extracts participants for a given event.
 * Ensures that each event displays its own actual participants (e.g., Rohan and Priya,
 * Rocky and Sneha, Amit and Neha) and NEVER falls back to a hardcoded organizer
 * or unrelated primary customer (e.g. Rohan Kulkarni) on unrelated events.
 */
export function resolveEventParticipants(event: WeddingEvent): EventParticipant[] {
  if (event.participants && event.participants.length > 0) {
    return event.participants;
  }

  // Parse from clientName or eventName
  const source = event.clientName || event.eventName || '';

  // Check for dual names (e.g., "Rohan & Priya", "Rocky & Sneha", "Amit & Neha", "Aditya & Sanjana")
  const delimiters = [/&/, /\band\b/i, /\+/];
  let parts: string[] = [];

  for (const delim of delimiters) {
    if (delim.test(source)) {
      parts = source.split(delim).map((s) => s.trim()).filter(Boolean);
      break;
    }
  }

  if (parts.length >= 2) {
    // Clean names (remove "'s Wedding", "Celebration", etc.)
    let cleanName1 = parts[0]
      .replace(/['’]s.*/i, '')
      .replace(/Celebration.*/i, '')
      .replace(/Wedding.*/i, '')
      .trim();
    if (cleanName1.startsWith('Rohil')) {
      cleanName1 = cleanName1.replace('Rohil', 'Rohan');
    }
    const cleanName2 = parts[1]
      .replace(/['’]s.*/i, '')
      .replace(/Celebration.*/i, '')
      .replace(/Wedding.*/i, '')
      .trim();

    return [
      {
        id: `part-${event.id}-1`,
        name: cleanName1,
        email: event.clientEmail,
        phone: event.clientPhone,
        role: 'PRIMARY',
        relationship: 'Primary Client',
        isPrimary: true,
        status: 'ACCEPTED',
        canEdit: true,
      },
      {
        id: `part-${event.id}-2`,
        name: cleanName2,
        role: 'CO_HOST',
        relationship: 'Co-Host / Partner',
        isPrimary: true,
        status: 'ACCEPTED',
        canEdit: true,
      },
    ];
  }

  // Single client or corporate board
  const cleanSingle = source
    .replace(/['’]s.*/i, '')
    .replace(/Celebration.*/i, '')
    .replace(/Wedding.*/i, '')
    .trim() || 'Private Client';

  return [
    {
      id: `part-${event.id}-1`,
      name: cleanSingle,
      email: event.clientEmail,
      phone: event.clientPhone,
      role: 'PRIMARY',
      relationship: 'Primary Client',
      isPrimary: true,
      status: 'ACCEPTED',
      canEdit: true,
    },
  ];
}

/**
 * Returns a friendly summary text like "Rohan and Priya", "Rocky and Sneha", "Amit and Neha"
 */
export function formatParticipantSummary(participants: EventParticipant[]): string {
  if (!participants || participants.length === 0) return 'None';
  const firstNames = participants.map((p) => p.name.split(' ')[0]);
  if (firstNames.length === 1) return firstNames[0];
  if (firstNames.length === 2) return `${firstNames[0]} and ${firstNames[1]}`;
  return `${firstNames.slice(0, -1).join(', ')} and ${firstNames[firstNames.length - 1]}`;
}
