// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDailyStats } from '@/lib/queryTracker'

// Naye alag dashboard domain ko allow karne ke liye.
// .env mein set karein: DASHBOARD_ORIGIN=https://your-dashboard.vercel.app
const ALLOWED_ORIGIN = process.env.DASHBOARD_ORIGIN || '*'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Browser CORS preflight ke liye zaroori
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!process.env.ADMIN_DASHBOARD_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_DASHBOARD_PASSWORD not configured on server.' },
      { status: 500, headers: corsHeaders }
    )
  }

  if (password !== process.env.ADMIN_DASHBOARD_PASSWORD) {
    return NextResponse.json(
      { error: 'Incorrect password.' },
      { status: 401, headers: corsHeaders }
    )
  }

  const stats = await getDailyStats(30) // last 30 days
  const today = stats[stats.length - 1]
  const totalThisMonth = stats.reduce((sum, day) => sum + day.count, 0)

  return NextResponse.json(
    { stats, today, totalThisMonth },
    { headers: corsHeaders }
  )
}