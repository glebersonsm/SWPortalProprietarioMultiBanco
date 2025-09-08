"use client";

import { Box, Divider, Stack } from "@mui/joy";
import React, { useState } from "react";
import ListGroupImages from "./_components/ListGroupImages";
import { GroupImages } from "@/utils/types/groupImages";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import AddGroupImagesModal from "./_components/AddGroupImages";
import EditGroupImagesModal from "./_components/EditGroupImages";
import DeleteGroupImagesModal from "./_components/DeleteGroupImages";
import AddImageModal from "./_components/AddImage";
import ShowImagesModal from "./_components/ShowImages";
import { useQuery } from "@tanstack/react-query";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { getGroupsImages } from "@/services/querys/groupImages";
import LoadingData from "@/components/LoadingData";
import { Pagination } from "@mui/material";
import WithoutData from "@/components/WithoutData";
import GroupImagesFilters from "./_components/GroupImagesFilters";
import DeleteImageModal from "./_components/DeleteImage";
import EditImages from "./_components/EditImages";

export default function ImagesPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const debounceFilters = useDebounce(filters);

  const { isLoading, data } = useQuery({
    queryKey: ["getGroupsImages", debounceFilters, page],
    queryFn: async () => getGroupsImages(debounceFilters, page),
  });

  const { groupsImages = [], lastPageNumber } = data ?? {};

  const { action, groupImagesId, imageId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const groupImagesId = searchParams.get("groupImagesId");
    const imageId = searchParams.get("imageId");

    return {
      groupImagesId,
      imageId,
      action,
    };
  }, [searchParams]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const selectedGroupImages = React.useMemo(
    () => groupsImages.find((item) => item.id === Number(groupImagesId)),
    [groupsImages, groupImagesId]
  );

  const selectedImage = React.useMemo(
    () =>
      selectedGroupImages?.images.find((item) => item.id === Number(imageId)),
    [selectedGroupImages, imageId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <GroupImagesFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : groupsImages.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              {groupsImages.map((groupImages: GroupImages) => (
                <ListGroupImages
                  key={groupImages.id}
                  groupImages={groupImages}
                />
              ))}
              <Box alignSelf="flex-end" marginTop="8px">
                <Pagination
                  variant="outlined"
                  size="large"
                  count={lastPageNumber}
                  onChange={handleChangePage}
                  page={page}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedGroupImages, selectedImage })
        .with({ action: "add" }, () => (
          <AddGroupImagesModal shouldOpen={true} />
        ))
        .with(
          { action: "edit", selectedGroupImages: P.not(undefined) },
          ({ selectedGroupImages }) => (
            <EditGroupImagesModal
              shouldOpen={true}
              groupImages={selectedGroupImages}
            />
          )
        )
        .with(
          { action: "show-images", selectedGroupImages: P.not(undefined) },
          ({ selectedGroupImages }) => (
            <ShowImagesModal
              shouldOpen={true}
              groupImages={selectedGroupImages}
            />
          )
        )
        .with(
          { action: "delete", selectedGroupImages: P.not(undefined) },
          ({ selectedGroupImages }) => (
            <DeleteGroupImagesModal
              shouldOpen={true}
              groupImages={selectedGroupImages}
            />
          )
        )
        .with(
          { action: "add-image", selectedGroupImages: P.not(undefined) },
          ({ selectedGroupImages }) => (
            <AddImageModal shouldOpen={true} groupImage={selectedGroupImages} />
          )
        )
        .with(
          {
            action: "delete-image",
            selectedImage: P.not(undefined),
            selectedGroupImages: P.not(undefined),
          },
          ({ selectedImage }) => (
            <DeleteImageModal shouldOpen={true} image={selectedImage} />
          )
        )
        //   .with(
        //   {
        //     action: "edit-image",
        //     selectedImage: P.not(undefined),
        //     selectedGroupImages: P.not(undefined),
        //   },
        //   ({ selectedImage, selectedGroupImages }) => (
        //     <EditImages shouldOpen={true} image={selectedImage} groupImages={selectedGroupImages}/>
        //   )
        // )
        .otherwise(() => null)}
    </>
  );
}
