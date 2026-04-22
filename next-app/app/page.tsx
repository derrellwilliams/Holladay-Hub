import { Suspense } from 'react';
import { getMeetings, getMeetingTypes, getMeetingYears, getMeetingMonths } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import MeetingCard from '@/components/MeetingCard';
import SearchBar from '@/components/SearchBar';

interface SearchParams {
  type?: string;
  search?: string;
  year?: string;
  month?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type, search, year, month } = await searchParams;

  const [meetings, types, years, months] = await Promise.all([
    Promise.resolve(getMeetings(type, search, year, month)),
    Promise.resolve(getMeetingTypes()),
    Promise.resolve(getMeetingYears()),
    Promise.resolve(getMeetingMonths()),
  ]);

  return (
    <div className="flex gap-8 px-6 py-8 min-h-screen">
      <Suspense>
        <Sidebar
          types={types}
          years={years}
          months={months}
          selectedType={type ?? ''}
          selectedYear={year ?? ''}
          selectedMonth={month ?? ''}
        />
      </Suspense>

      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meeting Minutes</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} found
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Suspense>
              <SearchBar defaultValue={search ?? ''} />
            </Suspense>
          </div>
        </div>

        {meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No meetings found</h3>
            <p className="text-gray-500 max-w-sm">
              {type || search || year || month
                ? 'Try adjusting your filters or search query.'
                : 'Run the scraper to populate the database with meeting summaries.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
