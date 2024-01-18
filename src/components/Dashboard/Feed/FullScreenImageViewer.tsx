import { File } from '@prisma/client';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

interface FullScreenImageViewerProps {
  images: File[];
  setFullscreenView: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullScreenImageViewer = ({
  images,
  setFullscreenView,
}: FullScreenImageViewerProps) => {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              {image.fileType.includes('video') ? (
                <video
                  src={image.url}
                  autoPlay
                  loop
                  muted
                  className='object-contain w-full h-full'
                />
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={image.url}
                  alt='Post Photo'
                  className='object-contain w-full h-full'
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FullScreenImageViewer;
