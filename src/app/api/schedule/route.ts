
import { NextResponse } from 'next/server';
import {adminAuth}  from '@/firebase/admin-config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirestore} from 'firebase-admin/firestore'

import { cookies } from 'next/headers';
// Types
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'current' | 'upcoming' | 'completed';
  type: 'meeting' | 'task';
  attendees?: string[];
  location?: string;
}

// GET handler to fetch scheduled sessions
export async function GET(request: Request) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Verify the session cookie and get user claims
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;

      // Initialize Firestore
      const db = getFirestore();
      
      // Reference to the user's schedule document
      const scheduleRef = db.collection('User_Data').doc(userId).collection('schedule').doc('tasks');
      
      // Get tasks from Firestore
      const scheduleDoc = await scheduleRef.get();
      
      if (!scheduleDoc.exists) {
        // Create empty tasks document if it doesn't exist
        await scheduleRef.set({
          tasks: []
        });
        return NextResponse.json({ tasks: [] });
      }

      const scheduleData = scheduleDoc.data();
      if (!scheduleData || !scheduleData.tasks) {
        return NextResponse.json({ tasks: [] });
      }
      
      const tasks = scheduleData.tasks;
      return NextResponse.json({ tasks });

    } catch (authError) {
      console.error('Session verification failed:', authError);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to schedule new session
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Use adminAuth instead of auth
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;

      // Use adminAuth for getting user
      const userRecord = await adminAuth.getUser(userId);
      const googleEmail = userRecord.email;

      // Get request body
      const body = await request.json();

      if (!body.title || !body.dueDate || !body.type) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Initialize Admin Firestore
      const db = getFirestore();
      const scheduleRef = db.collection('User_Data').doc(userId).collection('schedule').doc('tasks');
      
      // Get current tasks
      const scheduleDoc = await scheduleRef.get();
      const currentTasks = scheduleDoc.exists ? scheduleDoc.data()?.tasks || [] : [];
      
      const newTask = {
        id: Date.now().toString(),
        title: body.title,
        description: body.description,
        dueDate: body.dueDate,
        priority: body.priority || 'medium',
        status: 'upcoming',
        type: body.type,
        attendees: body.attendees || [],
        location: body.location || ''
      };

      // Update using admin SDK
      await scheduleRef.set({
        tasks: [...currentTasks, newTask]
      }, { merge: true });

      return NextResponse.json({ task: newTask });

    } catch (authError) {
      console.error('Session verification failed:', authError);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler to update session details
export async function PATCH(request: Request) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Verify the session cookie and get user claims
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;

      const body = await request.json();
      const { taskId, updates } = body;

      if (!taskId || !updates) {
        return NextResponse.json(
          { error: 'Missing taskId or updates' },
          { status: 400 }
        );
      }

      // Initialize Admin Firestore
      const db = getFirestore();
      const scheduleRef = db.collection('User_Data').doc(userId).collection('schedule').doc('tasks');
      
      // Get current tasks
      const scheduleDoc = await scheduleRef.get();
      const tasks = scheduleDoc.exists ? scheduleDoc.data()?.tasks || [] : [];
      
      // Update specific task
      const updatedTasks = tasks.map((task: Task) => 
        task.id === taskId ? { ...task, ...updates } : task
      );

      // Update using admin SDK
      await scheduleRef.set({ tasks: updatedTasks }, { merge: true });

      return NextResponse.json({ 
        task: updatedTasks.find((t: Task) => t.id === taskId)
      });

    } catch (authError) {
      console.error('Session verification failed:', authError);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Verify the session cookie and get user claims
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      const userId = decodedClaims.uid;

      const url = new URL(request.url);
      const taskId = url.searchParams.get('taskId');

      if (!taskId) {
        return NextResponse.json(
          { error: 'Missing taskId' },
          { status: 400 }
        );
      }

      // Initialize Admin Firestore
      const db = getFirestore();
      const scheduleRef = db.collection('User_Data').doc(userId).collection('schedule').doc('tasks');
      
      // Get current tasks
      const scheduleDoc = await scheduleRef.get();
      const tasks = scheduleDoc.exists ? scheduleDoc.data()?.tasks || [] : [];
      
      // Remove task
      const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
      
      // Update using admin SDK
      await scheduleRef.set({ tasks: updatedTasks }, { merge: true });

      return NextResponse.json({ 
        message: 'Task deleted successfully' 
      });

    } catch (authError) {
      console.error('Session verification failed:', authError);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}