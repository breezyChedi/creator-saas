import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { db } from '@/firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
// Mock database for demo purposes


// interface Attachment {
//   name: string;
//   type: string;  // e.g., "PDF", "Code", "Video", "Document"
//   size?: number; // optional, in bytes
// }

// interface Resource {
//   // Required fields
//   id: string;          // Unique identifier
//   title: string;       // Title of the resource
//   type: string;        // Type of resource (Course, Book, Document, Video)
//   description: string; // Description of the resource
  
//   // Author/Source information
//   author: string;      // Author or creator
//   platform?: string;   // Platform where resource is hosted (e.g., Udemy, YouTube)
//   link?: string;       // URL to the resource
  
//   // Recommendation details
//   recommended?: string;  // Person who recommended the resource
  
//   // Content and progress tracking
//   attachments?: Attachment[];  // Array of related attachments
//   progress?: number;           // Progress percentage (0-100)
//   status?: "Completed" | "In Progress" | "Upcoming";
  
//   // Metadata
//   createdAt: Date;     // When the resource was added
//   updatedAt: Date;     // When the resource was last updated
  
//   // Optional learning path related fields
//   milestone?: string;  // Associated milestone/category
//   tasks?: string[];    // Related tasks or subtopics
// }


let resources = [
  {
    id: 1,
    title: "Advanced React Patterns",
    type: "Course",
    platform: "Udemy", 
    link: "https://udemy.com/react-patterns",
    recommended: "Sarah Wilson",
    description: "Deep dive into advanced React patterns and best practices",
    attachments: [
      { name: "Course Slides", type: "PDF", size: "2.4MB" },
      { name: "Exercise Files", type: "ZIP", size: "15MB" }
    ],
    progress: 45
  }
]

export async function GET() {
  try {
    // Get reference to the resources collection
    const resourcesRef = collection(db, 'resources')
    
    // Fetch all documents from the collection
    const querySnapshot = await getDocs(resourcesRef)
    
    // Convert the documents to an array of resources
    const resources = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  
  const newResource = {
    id: resources.length + 1,
    ...data
  }
  
  resources.push(newResource)
  
  return NextResponse.json(newResource, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const data = await request.json()
  const { id, ...updates } = data
  
  const index = resources.findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json(
      { error: 'Resource not found' },
      { status: 404 }
    )
  }

  resources[index] = {
    ...resources[index],
    ...updates
  }

  return NextResponse.json(resources[index])
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))

  const index = resources.findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json(
      { error: 'Resource not found' },
      { status: 404 }
    )
  }

  resources = resources.filter(r => r.id !== id)
  
  return NextResponse.json(
    { message: 'Resource deleted successfully' },
    { status: 200 }
  )
}