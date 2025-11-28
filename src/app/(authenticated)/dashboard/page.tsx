"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { searchImagemGrupoImagemHomeForHome } from "@/services/querys/imagem-grupo-imagem-home";

import "swiper/css";
import "swiper/css/effect-fade";

import "./styles.css";
import { Box } from "@mui/joy";

export default function DashboardPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<any>(null);

  const { data: imagens, isLoading } = useQuery({
    queryKey: ["imagensHome"],
    queryFn: searchImagemGrupoImagemHomeForHome,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const imageUrls = imagens
    ?.filter((img) => img.imagemBase64)
    .map((img) => `data:image/jpeg;base64,${img.imagemBase64}`) || [];

  const hasSomeImage = imageUrls.length > 0;

  const handleThumbnailClick = (idx: number) => {
    swiperRef.current?.swiper?.slideToLoop(idx);
    setActiveIndex(idx);
  };

  if (!isMounted || isLoading) {
    return null;
  }

  if (!hasSomeImage) {
    return null;
  }

  return (
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
          {imagens?.map((imagem, idx) => {
            const url = `data:image/jpeg;base64,${imagem.imagemBase64}`;
            const slideContent = (
              <Image
                priority
                src={url}
                alt={imagem.name || `Imagem Home ${idx + 1}`}
                quality={75}
                fill
                unoptimized
                style={{
                  objectFit: "cover",
                }}
              />
            );

            return (
              <SwiperSlide
                key={imagem.id || idx}
                className="swiper-slide"
                style={{ width: "100%", position: "relative" }}
              >
                {imagem.linkBotao ? (
                  <a
                    href={imagem.linkBotao}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {slideContent}
                  </a>
                ) : (
                  slideContent
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      <Box
        mt={2}
        display="flex"
        gap={1}
        flexWrap="wrap"
        justifyContent="center"
      >
        {imagens?.map((imagem, idx) => {
          const url = `data:image/jpeg;base64,${imagem.imagemBase64}`;
          return (
            <Box
              key={imagem.id || idx}
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
                alt={imagem.name || `Miniatura ${idx + 1}`}
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
          );
        })}
      </Box>
    </>
  );
}
