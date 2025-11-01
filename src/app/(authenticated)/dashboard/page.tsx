"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import useUser from "@/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import "./styles.css";
import { Box } from "@mui/joy";

export default function DashboardPage() {
  const { settingsParams } = useUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const imageUrls = Array.from({ length: 20 }, (_, i) => {
    const key = `homeImageUrl${i + 1}` as keyof typeof settingsParams;
    const value = settingsParams?.[key];
    return typeof value === "string" && value !== "" ? value : null;
  }).filter((url): url is NonNullable<typeof url> => url !== null);

  const hasSomeImage = imageUrls.length > 0;

  const handleThumbnailClick = (idx: number) => {
    swiperRef.current?.swiper?.slideToLoop(idx);
    setActiveIndex(idx);
  };

  return isMounted && hasSomeImage ? (
    <>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Swiper
            ref={swiperRef}
            spaceBetween={30}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop
            modules={[Autoplay, EffectFade]}
            className="swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            initialSlide={activeIndex}
          >
            {imageUrls.map((url, idx) => (
              <SwiperSlide
                key={idx}
                className="swiper-slide"
                style={{ width: "100%", position: "relative" }}
              >
                <Image
                  priority
                  src={url}
                  alt={`Imagem Home ${idx + 1}`}
                  quality={100}
                  fill
                  unoptimized
                  style={{
                    objectFit: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box
          mt={2}
          display="flex"
          gap={1}
          flexWrap="wrap"
          justifyContent="center"
        >
          {imageUrls.map((url, idx) => (
            <Box
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              sx={{
                cursor: "pointer",
                border:
                  idx === activeIndex ? "2px solid #007fff" : "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
                width: "60px",
                height: "30px",
              }}
            >
              <Image
                src={url}
                alt={`Miniatura ${idx + 1}`}
                width={60}
                height={30}
                unoptimized
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          ))}
        </Box>
    </>
  ) : null;
}
