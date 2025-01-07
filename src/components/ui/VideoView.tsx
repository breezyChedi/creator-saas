
// VideoView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Volume2, Settings, Maximize, Play, Pause } from "lucide-react";

interface VideoContentProps {
  title: string;
  url: string;
}

export const VideoView = ({url, title}: VideoContentProps) => {
  const [currentVideo, setCurrentVideo] = useState<string |null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [vidTitle, setTitle] = useState("")

  useEffect(() => {
    // Fetch video data from API
    const fetchVideo = async () => {
      try {
        console.log("url : ",url)
        setCurrentVideo(url);
        setTitle(title)
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, []);

  return (
    <div className="h-screen pt-16 px-6">
      <Card className="h-full">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {vidTitle || 'Video Player'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-black">
            <video
              src={currentVideo}
              className="w-full h-full"
              controls
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
