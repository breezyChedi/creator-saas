import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const moduleIndex = searchParams.get('moduleIndex');
    const chapterIndex = searchParams.get('chapterIndex');

    if (!courseId || moduleIndex === null || chapterIndex === null) {
      return NextResponse.json(
        { error: 'Course ID, Module Index, and Chapter Index are required' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const courseRef = db.collection('resources').doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseData = courseDoc.data();
    const chapter = courseData?.modules[moduleIndex]?.chapters[chapterIndex];

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ chapter });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch chapter', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
        console.log("Starting POST request");
        const body = await request.json();
        console.log("Parsed request body:", body);
        
        const { courseId, moduleIndex, chapterIndex, updates } = body;
        console.log("Destructured values:", { courseId, moduleIndex, chapterIndex, updates });

      if (!courseId || moduleIndex === undefined || chapterIndex === undefined || !updates) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
  
      const db = getFirestore();
      const courseRef = db.collection('resources').doc(courseId);
  
      // First, get the current course data
      const courseDoc = await courseRef.get();
      if (!courseDoc.exists) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
  
      const courseData = courseDoc.data();
      const currentModule = courseData?.modules[moduleIndex];
      
      if (!currentModule) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 });
      }
  
      // Get the current chapter
      const currentChapter = currentModule.chapters[chapterIndex];
      if (!currentChapter) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
  
      // Merge the updates with the existing chapter data
      /*
      const updatedChapter = {
        ...currentChapter,
        content: updates.content !== undefined ? updates.content : currentChapter.content,
        files: updates.files !== undefined ? updates.files : currentChapter.files,
        quiz: updates.quiz !== undefined ? updates.quiz : currentChapter.quiz,
        vidUrl: updates.vidUrl !== undefined ? updates.vidUrl : currentChapter.vidUrl
      };*/

      const updatedChapter = {
        ...currentChapter
      };

      // Only update fields that exist in the updates object
      if ('files' in updates) updatedChapter.files = updates.files;
      if ('content' in updates) updatedChapter.content = updates.content;
      if ('quiz' in updates) updatedChapter.quiz = updates.quiz;
      if ('vidUrl' in updates) updatedChapter.vidUrl = updates.vidUrl;
  
      // Create a new chapters array with the updated chapter
      const updatedChapters = [...currentModule.chapters];
      updatedChapters[chapterIndex] = updatedChapter;
  
      // Create updated module that preserves all module properties
      const updatedModule = {
        ...currentModule,
        chapters: updatedChapters
      };

      const updatedModules = [...courseData.modules];
// Update the specific module
        updatedModules[moduleIndex] = updatedModule;

        console.log("update module ",updatedModule)
  
      // Update the entire module to preserve all its properties


      await courseRef.update({
        [`modules`]: updatedModules
      });
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Failed to update chapter', details: error.message },
        { status: 500 }
      );
    }
  }