import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Optional: simple sanity check
    if (!body.event_type || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('memory_events') // ← Make sure this table exists
      .insert([
        {
          event_type: body.event_type,
          description: body.description,
          metadata: body.metadata,
          importance: body.importance,
        },
      ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '⚡ Pulse logged.',
      data,
    });
  } catch (err: any) {
    console.error('🔥 API route error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
