import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { propertyId } = await request.json()

  revalidatePath('/properties')
  if (propertyId) {
    revalidatePath(`/properties/${propertyId}`)
  }
  revalidatePath('/')

  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
