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
    const { courseId, moduleIndex, chapterIndex, updates } = await request.json();

    if (!courseId || moduleIndex === undefined || chapterIndex === undefined || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const courseRef = db.collection('resources').doc(courseId);

    // Update the specific chapter with new content
    await courseRef.update({
      [`modules.${moduleIndex}.chapters.${chapterIndex}.content`]: updates.content,
      [`modules.${moduleIndex}.chapters.${chapterIndex}.files`]: updates.files,
      [`modules.${moduleIndex}.chapters.${chapterIndex}.quiz`]: updates.quiz
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update chapter', details: error.message },
      { status: 500 }
    );
  }
}