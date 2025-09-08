"use client";

import React from "react";
import { Divider, Stack } from "@mui/joy";
import GroupsFaqsFilters from "@/components/GroupsFaqsFilters";
import useDebounce from "@/hooks/useDebounce";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { useSearchParams } from "next/navigation";
import { getGroupFaqs } from "@/services/querys/groupsFaqs";
import ListGroupFaqs from "./_components/ListGroupFaqs";
import { P, match } from "ts-pattern";
import EditGroupFaqModal from "./_components/EditGroupFaqModal";
import DeleteGroupFaqModal from "./_components/DeleteGroupFaqModal";
import AddGroupFaqModal from "./_components/AddGroupFaqModal";
import { useQuery } from "@tanstack/react-query";
import { initialFilters } from "./constants";
import AddFaqModal from "./_components/AddFaqModal";
import EditFaqModal from "./_components/ListFaqs/EditFaqModal";
import DeleteFaqModal from "./_components/ListFaqs/DeleteFaqModal";
import { GroupFaq } from "@/utils/types/faqs";

export default function FaqPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const searchParams = useSearchParams();

  const debounceFilters = useDebounce(filters);

  const { isLoading, data: groupsFaqs = [] } = useQuery({
    queryKey: ["getGroupFaqs", debounceFilters],
    queryFn: async () =>
      getGroupFaqs({debounceFilters,}),
  });


  const { action, groupFaqId, faqId } = React.useMemo(() => {
    const action = searchParams.get("action");
    
    const groupFaqId = searchParams.get("groupFaqId");
    const faqId = searchParams.get("faqId");

    return {
      action,
      groupFaqId,
      faqId,
    };
  }, [searchParams]);

  const selectedGroupFaq = React.useMemo(
    () => groupsFaqs.find((item) => item.id === Number(groupFaqId)),
    [groupsFaqs, groupFaqId]
  );

  const selectedFaq = React.useMemo(
    () => selectedGroupFaq?.faqs?.find((item) => item.id === Number(faqId)),
    [selectedGroupFaq, faqId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <GroupsFaqsFilters filters={filters} setFilters={setFilters} />
        <Stack spacing={2}>
          {isLoading ? (
            <LoadingData />
          ) : groupsFaqs.length <= 0 ? (
            <WithoutData />
          ) : (
            groupsFaqs?.map((groupFaqs: GroupFaq) => (
              <ListGroupFaqs groupFaqs={groupFaqs} key={groupFaqs.id} />
            ))
          )}
        </Stack>
      </Stack>
      {match({ action, selectedGroupFaq, selectedFaq })
        .with({ action: "add" }, () => <AddGroupFaqModal shouldOpen={true} />)
        .with(
          { action: "add-faq", selectedGroupFaq: P.not(undefined) },
          ({ selectedGroupFaq }) => (
            <AddFaqModal groupFaqs={selectedGroupFaq} shouldOpen={true} />
          )
        )
        .with(
          { action: "edit", selectedGroupFaq: P.not(undefined) },
          ({ selectedGroupFaq }) => (
            <EditGroupFaqModal shouldOpen={true} groupFaqs={selectedGroupFaq} />
          )
        )
        .with(
          {
            action: "edit-faq",
            selectedFaq: P.not(undefined),
            selectedGroupFaq: P.not(undefined),
          },
          ({ selectedFaq, selectedGroupFaq }) => (
            <EditFaqModal
              shouldOpen={true}
              faq={selectedFaq}
              groupFaq={selectedGroupFaq}
            />
          )
        )
        .with(
          { action: "delete", selectedGroupFaq: P.not(undefined) },
          ({ selectedGroupFaq }) => (
            <DeleteGroupFaqModal
              shouldOpen={true}
              groupFaqs={selectedGroupFaq}
            />
          )
        )
        .with(
          { action: "delete-faq", selectedFaq: P.not(undefined) },
          ({ selectedFaq }) => (
            <DeleteFaqModal shouldOpen={true} faq={selectedFaq} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
