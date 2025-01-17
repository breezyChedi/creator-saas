import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, moduleIndex, chapterIndex, userId } = body;

    if (!courseId || moduleIndex === undefined || chapterIndex === undefined || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const userDataRef = db.collection('User_Data').doc(userId).collection('courses').doc(courseId);
    
    // Get current course data
    const courseDoc = await userDataRef.get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course progress not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    const updatedModules = [...courseData.modules];
    const currentModule = updatedModules[moduleIndex];

    // Mark current chapter as completed and not current
    currentModule.chapters[chapterIndex].completed = true;
    currentModule.chapters[chapterIndex].current = false;

    // Check if there's a next chapter in current module
    if (chapterIndex < currentModule.chapters.length - 1) {
      // Move to next chapter in same module
      currentModule.chapters[chapterIndex + 1].current = true;
    } else {
      // Current module is complete
      currentModule.completed = true;
      currentModule.current = false;

      // Check if there's a next module
      if (moduleIndex < updatedModules.length - 1) {
        // Move to first chapter of next module
        updatedModules[moduleIndex + 1].current = true;
        if (updatedModules[moduleIndex + 1].chapters.length > 0) {
          updatedModules[moduleIndex + 1].chapters[0].current = true;
        }
      }
    }

    // Update the course data in Firestore
    await userDataRef.update({
      modules: updatedModules
    });

    // Return the updated course data
    return NextResponse.json({
      success: true,
      updatedCourseData: {
        ...courseData,
        modules: updatedModules
      }
    });

  } catch (error: any) {
    console.error('Error in next-chapter:', error);
    return NextResponse.json(
      { error: 'Failed to progress to next chapter', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const moduleIndex = searchParams.get('moduleIndex');
    const chapterIndex = searchParams.get('chapterIndex');
    const userId = searchParams.get('userId');

    if (!courseId || !moduleIndex || !chapterIndex || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const userDataRef = db.collection('User_Data').doc(userId).collection('courses').doc(courseId);
    const courseDoc = await userDataRef.get();

    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course progress not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    const currentModule = courseData.modules[parseInt(moduleIndex)];
    
    // Return next chapter information
    const nextChapterInfo = {
      hasNextChapter: chapterIndex < currentModule.chapters.length - 1,
      hasNextModule: moduleIndex < courseData.modules.length - 1,
      nextChapterIndex: chapterIndex < currentModule.chapters.length - 1 ? 
        parseInt(chapterIndex) + 1 : null,
      nextModuleIndex: moduleIndex < courseData.modules.length - 1 ? 
        parseInt(moduleIndex) + 1 : null
    };

    return NextResponse.json(nextChapterInfo);

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get next chapter info', details: error.message },
      { status: 500 }
    );
  }
}