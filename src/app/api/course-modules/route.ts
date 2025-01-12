// /api/course-modules/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(request: Request) {
    console.log("Incoming request URL:", request.url);

  try 
  {
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    console.log("route course id: ", courseId)
    console.log("route user id: ", userId)

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

    if (courseData.modules) {
        courseData.modules = courseData.modules.map((module: any, index: number) => ({
          ...module,
          completed: false,
          current: index === 0, // Only first module gets current: true
          // If module has chapters, initialize their properties too
          chapters: module.chapters?.map((chapter: any, chapterIndex: number) => ({
            ...chapter,
            completed: false,
            current: index === 0 && chapterIndex === 0 // Only first chapter of first module gets current: true
          })) || []
        }));
      }
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