// /api/course-modules/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'Course ID and User ID are required' }, 
        { status: 400 }
      );
    }

    // First try to fetch from User_Data
    const userDataRef = doc(db, 'User_Data', userId, 'courses', courseId);
    const userDataDoc = await getDoc(userDataRef);

    if (userDataDoc.exists()) {
      return NextResponse.json(userDataDoc.data());
    }

    // If not found, fetch from Resources
    const resourceRef = doc(db, 'resources', courseId);
    const resourceDoc = await getDoc(resourceRef);

    if (!resourceDoc.exists()) {
      return NextResponse.json(
        { error: 'Course not found' }, 
        { status: 404 }
      );
    }

    // Initialize user's course data
    const courseData = resourceDoc.data();
    // ... format course data for user ...

    return NextResponse.json(courseData);

  } catch (error) {
    console.error('Error fetching course modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course modules' }, 
      { status: 500 }
    );
  }
}