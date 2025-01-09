
// AudioView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Volume2, SkipBack, SkipForward, Play, Pause, Repeat } from "lucide-react";

interface AudioProps {
  title: string;
  url: string;
}

export const AudioView = ({url, title}: AudioProps) => {
  const [currentAudio, setCurrentAudio] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [audTitle, setTitle] = useState("")

  useEffect(() => {
    // Fetch audio data from API
    const fetchAudio = async () => {
      try {
        setCurrentAudio(url);
        setTitle(title)
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudio();
  }, []);

  return (
    <div className="h-screen pt-16 px-6">
      <Card className="h-full">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {audTitle || 'Audio Player'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-muted rounded-lg">
              {currentAudio?.coverArt && (
                <img
                  src={currentAudio.coverArt}
                  alt="Cover Art"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            
            <div className="w-full max-w-md">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Repeat className="h-4 w-4" />
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};