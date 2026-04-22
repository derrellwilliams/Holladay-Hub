import Link from 'next/link';
import { Meeting } from '@/lib/db';
import { getTypeColor, cleanMeetingType } from '@/lib/meetingColors';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Unknown date';
  if (/^[A-Za-z]/.test(dateStr)) return dateStr;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getTopics(summary: string): string[] {
  // Extract top-level bullets from "Key Topics Discussed" section
  const match = summary.match(/key topics discussed[^\n]*\n([\s\S]*?)(?=\n\d+\.\s|\n#{1,6}\s|\n\*\*\d+\.)/i);
  if (match) {
    const topics = match[1]
      .split('\n')
      .filter(l => /^[-*•]\s/.test(l.trim()))
      .map(l => l.replace(/^[-*•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1').trim())
      .filter(Boolean)
      .slice(0, 3);
    if (topics.length > 0) return topics;
  }

  // Fallback: grab first 3 non-empty, non-header lines
  return summary
    .split('\n')
    .map(l => l.replace(/^[-*•#>\d.]+\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\|/g, '').trim())
    .filter(l => l.length > 20 && !/^(meeting type|date|time|location|presiding|field|structured summary)/i.test(l))
    .slice(0, 3);
}

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const topics = getTopics(meeting.summary);
  const label = cleanMeetingType(meeting.meeting_type);

  return (
    <Link href={`/meetings/${meeting.id}`} className="block group">
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-600 transition-all duration-200 p-5 h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(meeting.meeting_type)}`}>
            {label}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{formatDate(meeting.meeting_date)}</span>
        </div>
        <ul className="flex-1 space-y-1">
          {topics.map((topic, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              {topic.replace(/^[-–—]\s*/, '')}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700">
          Read full summary
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
