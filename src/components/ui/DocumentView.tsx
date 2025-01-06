// DocumentView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Bookmark } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  author: string;
  dateCreated: string;
  fileSize: string;
  format: string;
}

export const DocumentView = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch document data from API
    const fetchDocument = async () => {
      try {
        const response = await fetch('/api/resources?type=document');
        const data = await response.json();
        setCurrentDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, []);

  return (
    <div className="h-screen pt-16 px-6">
      <Card className="h-full">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {currentDocument?.title || 'Document Viewer'}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
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
            <div className="p-4">
              {currentDocument?.content}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
