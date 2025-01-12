// /api/course-modules/route.ts
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminAuth } from '@/firebase/admin-config'; // Make sure this is properly configured

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    console.log("route course id: ", courseId);
    console.log("route user id: ", userId);

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'Course ID and User ID are required' }, 
        { status: 400 }
      );
    }

    // Use admin SDK
    const db = getFirestore();

    // First try to fetch from User_Data
    const userDataRef = db.collection('User_Data').doc(userId).collection('courses').doc(courseId);
    const userDataDoc = await userDataRef.get();

    if (userDataDoc.exists) {
      return NextResponse.json(userDataDoc.data());
    }

    // If not found, fetch from Resources
    const resourceRef = db.collection('resources').doc(courseId);
    const resourceDoc = await resourceRef.get();

    if (!resourceDoc.exists) {
      return NextResponse.json(
        { error: 'Course not found' }, 
        { status: 404 }
      );
    }

    // Initialize user's course data
    const courseData = resourceDoc.data();

    if (!courseData) {
        return NextResponse.json(
          { error: 'Invalid course data' },
          { status: 500 }
        );
      }

      if (courseData?.modules) {
        courseData.modules = courseData.modules.map((module: any, index: number) => ({
          ...module,
          completed: false,
          current: index === 0,
          chapters: Array.isArray(module.chapters) 
            ? module.chapters.map((chapter: any, chapterIndex: number) => {
                // If chapter is a string (just the name), convert it to an object
                const chapterObj = typeof chapter === 'string' 
                  ? { name: chapter }
                  : chapter;
      
                return {
                  ...chapterObj,
                  completed: false,
                  current: index === 0 && chapterIndex === 0
                };
              })
            : []
        }));
      }

    // Save initialized data to user's collection
    await userDataRef.set(courseData);

    return NextResponse.json(courseData);

  } catch (error: any) {
    console.error('Detailed error in course modules:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch course modules', details: error.message }, 
      { status: 500 }
    );
  }
}