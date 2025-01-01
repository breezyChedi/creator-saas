

// firebase-admin-config.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'

// Import the service account file directly
import serviceAccount from '../firebase/service-account-key.json'

// const serviceAccount = {
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
// }

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount as any)
    })
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
    throw error
  }
}

export const adminAuth: Auth = getAuth()