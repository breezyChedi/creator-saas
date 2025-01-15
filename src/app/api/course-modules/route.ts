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
  
      const db = getFirestore();
  
      // Fetch from Resources first (this will be our base data)
      const resourceRef = db.collection('resources').doc(courseId);
      const resourceDoc = await resourceRef.get();
  
      if (!resourceDoc.exists) {
        return NextResponse.json(
          { error: 'Course not found' }, 
          { status: 404 }
        );
      }
  
      // Get the base course data
      const courseData = resourceDoc.data();
  
      if (!courseData) {
        return NextResponse.json(
          { error: 'Invalid course data' },
          { status: 500 }
        );
      }
  
      // Try to fetch user progress data
      const userDataRef = db.collection('User_Data').doc(userId).collection('courses').doc(courseId);
      const userDataDoc = await userDataRef.get();
      const userData = userDataDoc.exists ? userDataDoc.data() : null;
  
      if (courseData?.modules) {
        courseData.modules = courseData.modules.map((module: any, index: number) => {
          // Get completion status from userData if it exists, otherwise initialize
          const userModule = userData?.modules?.[index];
          
          return {
            ...module,
            completed: userModule?.completed ?? false,
            current: userModule?.current ?? (index === 0),
            chapters: Array.isArray(module.chapters) 
              ? module.chapters.map((chapter: any, chapterIndex: number) => {
                  const chapterObj = typeof chapter === 'string' 
                    ? { name: chapter }
                    : chapter;
                  
                  // Get chapter completion status from userData if it exists
                  const userChapter = userModule?.chapters?.[chapterIndex];
  
                  return {
                    ...chapterObj,
                    completed: userChapter?.completed ?? false,
                    current: userChapter?.current ?? (index === 0 && chapterIndex === 0)
                  };
                })
              : []
          };
        });
      }
  
      // If user data doesn't exist, save the initialized data
      if (!userDataDoc.exists) {
        await userDataRef.set(courseData);
      }
  
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