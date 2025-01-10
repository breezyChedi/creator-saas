// /src/app/api/course/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/firebase/admin-config';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const db = getFirestore();

    // Check if we're fetching a specific course
    const { searchParams } = new URL(request.url);
    const courseTitle = searchParams.get('courseTitle');

    if (courseTitle) {
      // Fetch single course by title
      const coursesSnapshot = await db.collection('resources')
        .where('type', '==', 'course')
        .where('title', '==', courseTitle)
        .limit(1)
        .get();

      if (coursesSnapshot.empty) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const courseDoc = coursesSnapshot.docs[0];
      return NextResponse.json({ 
        course: {
          id: courseDoc.id,
          ...courseDoc.data()
        }
      });
    } else {
      // Fetch all courses from resources collection where type is 'course'
      const coursesSnapshot = await db.collection('resources')
        .where('type', '==', 'course')
        .get();
      
      const courses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json({ courses });
    }
  } catch (error) {
    console.error('Error fetching course(s):', error);
    return NextResponse.json(
      { error: 'Failed to fetch course(s)' },
      { status: 500 }
    );
  }
}