"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureCarouselProps {
  features: Feature[];
}

const FeatureCarousel = ({ features }: FeatureCarouselProps) => {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      className="w-full max-w-xs md:max-w-2xl mx-auto"
    >
      <CarouselContent>
        {features.map((feature, index) => (
          <CarouselItem className="md:basis-1/3" key={index}>
            <Card className="h-[315px]">
              <CardContent className="flex flex-col items-center p-6">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeatureCarousel;
