import { NextRequest, NextResponse } from 'next/server';
import { getMeetings } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type') || undefined;
  const search = searchParams.get('search') || undefined;
  const year = searchParams.get('year') || undefined;
  const month = searchParams.get('month') || undefined;

  try {
    const meetings = getMeetings(type, search, year, month);
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to load meetings' }, { status: 500 });
  }
}
