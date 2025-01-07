// DocumentView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Bookmark } from "lucide-react";
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

interface DocumentViewProps {
  fileUrl: string;
  title: string;
}

export const DocumentView = ({ fileUrl, title }: DocumentViewProps) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        // Get the download URL from Firebase Storage using the fileUrl
       // const storageRef = ref(storage, fileUrl);
      //  const url = await getDownloadURL(storageRef);
        setDocumentUrl(fileUrl);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (fileUrl) {
      fetchDocument();
    }
  }, [fileUrl]);

  const handleDownload = async () => {
    try {
     // const storageRef = ref(storage, fileUrl);
     // const url = await getDownloadURL(storageRef);
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="h-screen pt-16 px-6">
      <Card className="h-full">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title || 'Document Viewer'}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                Loading document...
              </div>
            ) : documentUrl ? (
              <iframe
                src={documentUrl}
                className="w-full h-full"
                title={title}
              />
            ) : (
              <div className="p-4">
                Failed to load document
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};