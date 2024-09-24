"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ClassNames from "embla-carousel-class-names";
interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  { value: "2.5", label: "HOURS ADMINS SAVE WEEKLY" },
  { value: "100+", label: "COUNTRIES WITH SPOND USERS" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
  { value: "$8.6m+", label: "PLACEHOLDER METRIC" },
];

const MetricsCarousel: React.FC = () => {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
      }}
      className=""
      orientation="vertical"
      plugins={[ClassNames({ snapped: "is-snapped" })]}
    >
      <CarouselContent className="max-h-[300px] pointer-events-none">
        {metrics.map((metric, index) => (
          <CarouselItem className="embla__slide embla__class-names" key={index}>
            <div className="bg-[#00B3B6] p-6 rounded-lg">
              <div className="text-5xl font-bold text-white">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {metric.label}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="text-black" />
      <CarouselPrevious className="text-black" />
    </Carousel>
  );
};

export default MetricsCarousel;
