"use client";

import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import useCloseModal from "@/hooks/useCloseModal";
import { Box, Stack, Typography, IconButton, Button } from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GroupImages } from "@/utils/types/groupImages";
import Image from "next/image";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ShowImagesModalProps = {
  shouldOpen: boolean;
  groupImages: GroupImages;
};

export default function ShowImagesModal({
  shouldOpen,
  groupImages,
}: ShowImagesModalProps) {
  const closeModal = useCloseModal();
  const [zoomModalOpen, setZoomModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [imagePosition, setImagePosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleOpenZoom = (index: number) => {
    setSelectedImageIndex(index);
    setZoomModalOpen(true);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleCloseZoom = () => {
    setZoomModalOpen(false);
    handleResetZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Modal open={shouldOpen} onClose={closeModal}>
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: "85vw", md: "75vw", lg: "65vw" },
          height: { xs: "90vh", sm: "85vh", md: "80vh" },
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid var(--gallery-border-color)",
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Stack alignItems="center" justifyContent="center" width="100%">
            <Typography
              level="title-lg"
              fontWeight="700"
              textAlign="center"
              sx={{
                wordBreak: "break-word",
                color: "var(--color-title)",
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                mb: 1,
              }}
            >
              Galeria de Imagens
            </Typography>
            <Typography
              level="body-sm"
              textAlign="center"
              sx={{
                color: "text.secondary",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {groupImages.name}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            p: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: "column",
            background: "var(--gallery-details-gradient)",
            borderRadius: "12px",
            margin: "0 8px 8px 8px",
          }}
        >
          <Box 
            sx={{ 
              flex: 1,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              border: "1px solid var(--gallery-border-color)",
              "& .swiper": {
                borderRadius: "12px",
              },
              "& .swiper-button-next, & .swiper-button-prev": {
                color: "var(--color-primary)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  transform: "scale(1.1)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
                "&::after": {
                  fontSize: "18px",
                  fontWeight: "bold",
                },
              },
              "& .swiper-pagination-bullet": {
                backgroundColor: "var(--gallery-pagination-bullet)",
                opacity: 1,
                width: "12px",
                height: "12px",
                transition: "all 0.3s ease",
              },
              "& .swiper-pagination-bullet-active": {
                backgroundColor: "var(--gallery-pagination-active)",
                transform: "scale(1.2)",
                boxShadow: "0 2px 8px var(--gallery-pagination-bullet)",
              },
            }}
          >
            <Swiper
              navigation
              pagination={{ clickable: true }}
              modules={[Pagination, Navigation]}
              style={{ height: "100%" }}
              spaceBetween={0}
              slidesPerView={1}
              loop={groupImages.images.length > 1}
            >
              {groupImages.images.map((image, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    background: "#ffffff",
                  }}
                >
                  <Stack
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography
                      level="title-md"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginBottom: 1,
                      }}
                    >
                      {image.name}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={800}
                        height={600}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                      <IconButton
                        onClick={() => handleOpenZoom(index)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: 'primary.main',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <FullscreenIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </DialogContent>
      </ModalDialog>
      </Modal>

      {/* Modal de Zoom */}
      <Modal open={zoomModalOpen} onClose={handleCloseZoom}>
        <ModalDialog
          sx={{
            width: '95vw',
            height: '95vh',
            maxWidth: 'none',
            maxHeight: 'none',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              p: 2,
            }}
          >
            <Typography level="title-md" sx={{ color: 'white' }}>
              {groupImages.images[selectedImageIndex]?.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ZoomOutIcon />
              </IconButton>
              <Button
                onClick={handleResetZoom}
                size="sm"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                {Math.round(zoomLevel * 100)}%
              </Button>
              <IconButton
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                onClick={handleCloseZoom}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              p: 0,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Box
              ref={imageRef}
              sx={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                transformOrigin: 'center center',
              }}
            >
              <Image
                src={groupImages.images[selectedImageIndex]?.url || ''}
                alt={groupImages.images[selectedImageIndex]?.name || ''}
                width={1200}
                height={800}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
