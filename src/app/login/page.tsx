'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import {doc, setDoc} from 'firebase/firestore'
import { useRouter } from 'next/navigation';

function BrandSection() {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-blue-600 h-screen p-8">
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          {/* Replace with your actual logo */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-4xl font-bold">G</span>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Growth Creator</h1>
          <p className="text-xl text-blue-100 max-w-md">
            Transform your knowledge into a thriving digital business
          </p>
        </div>
        <div className="space-y-2 text-blue-100">
          <p>✓ Build and sell info products</p>
          <p>✓ Grow your audience</p>
          <p>✓ Analytics and insights</p>
        </div>
      </div>
    </div>
  );
}

function AuthSection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
  };

  const handleGoogleSignIn = async (e: any) => {
    try {
      const provider = new GoogleAuthProvider();

      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      provider.addScope('https://www.googleapis.com/auth/drive.readonly');
  
      // Optional: Request offline access (to get refresh token)
      provider.setCustomParameters({
      access_type: 'offline',
      prompt: 'consent'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

       // Get the ID token
       const credential = GoogleAuthProvider.credentialFromResult(result);
       const accessToken = credential?.accessToken;
      

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userDocRef = doc(db, 'User_Data', user.uid, 'profile', 'info')

      await setDoc(userDocRef, {
        email: user.email,
        fullname: user.displayName || '',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        accessToken
      }, { merge: true });
        
    const idToken = await result.user.getIdToken()
      
    
      // Send to your backend to set the cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })
      if (response.ok){
        router.push('/cohort');
      }

      } catch (error) {
        console.error('Error signing in with Google:', error);
      }
    }

  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 h-screen bg-gray-50 p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="text-center text-gray-500">
            Sign in to access your creator dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              Google
            </Button>
            <Button variant="outline">
              Twitter
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen">
      <BrandSection />
      <AuthSection />
    </div>
  );
}
