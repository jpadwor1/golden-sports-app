import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { File } from '@prisma/client';

interface VideoThumbnailProps {
  videoFile: {
    key: string;
    downloadURL: string;
    groupId: string;
    fileType: string;
    fileName: string;
};
  className?: string;
  width: number;
  height: number;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoFile,
  className,
  width,
  height,
}) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (videoFile) {
      generateThumbnail(videoFile);
    }
  }, [videoFile]);

  useEffect(() => {
    if (thumbnail) {
        console.log(thumbnail);
        }
    
    }, [thumbnail]);

    const generateThumbnail = async (file: {
        key: string;
        downloadURL: string;
        groupId: string;
        fileType: string;
        fileName: string;
    }) => {
        const url = file.downloadURL;
        const video = document.createElement('video');
      
        video.onerror = () => {
          console.error('Error loading video file:', url);
        };
      
        video.onloadedmetadata = () => {
          video.currentTime = 0;
        };
      
        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg');
            setThumbnail(imageData);
          } catch (error) {
            console.error('Error generating thumbnail:', error);
          }
        };
        video.crossOrigin = "anonymous";
        video.src = url;
        video.load();
      };
  console.log(thumbnail);
  return (
    <div>
      {thumbnail && (
        <Image
          width={width}
          height={height}
          className={className}
          src={thumbnail}
          alt='Video Thumbnail'
        />
      )}
    </div>
  );
};

export default VideoThumbnail;
