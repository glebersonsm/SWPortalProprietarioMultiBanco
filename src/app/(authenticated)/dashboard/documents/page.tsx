"use client";

import * as React from "react";
import { Divider, Stack } from "@mui/joy";
import ListGroupOfDocuments from "./_components/ListGroupOfDocuments";
import GroupOfDocumentsFilters from "./_components/GroupOfDocumentsFilters";
import { useQuery } from "@tanstack/react-query";
import { getGroupsDocuments } from "@/services/querys/groupsDocuments";
import { useSearchParams } from "next/navigation";
import AddGroupOfDocsModal from "./_components/AddGroupOfDocsModal";
import EditGroupOfDocsModal from "./_components/EditGroupOfDocsModal";
import { match, P } from "ts-pattern";
import { initialFilters } from "./constants";
import DeleteGroupOfDocsModal from "./_components/DeleteGroupOfDocsModal";
import AddDocumentsModal from "./_components/AddDocumentsModal";
import EditDocumentModal from "./_components/ListDocuments/EditDocumentModal";
import DeleteDocumentModal from "./_components/ListDocuments/DeleteDocumentModal";
import HistoryModal from "./_components/ListDocuments/HistoryModal";
import LoadingData from "@/components/LoadingData";
import useDebounce from "@/hooks/useDebounce";
import { GroupOfDocs } from "@/utils/types/documents";
import WithoutData from "@/components/WithoutData";

export default function DocumentsPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const searchParams = useSearchParams();

  const debounceFilters = useDebounce(filters);

  const { isLoading, data: groupsDocuments = [] } = useQuery({
    queryKey: ["getGroupsDocuments", debounceFilters],
    queryFn: async () => getGroupsDocuments(debounceFilters),
  });

  const { action, groupDocumentId, documentId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const groupDocumentId = searchParams.get("groupDocumentId");
    const documentId = searchParams.get("documentId");

    return {
      groupDocumentId,
      action,
      documentId,
    };
  }, [searchParams]);

  const selectedGroupOfDocument = React.useMemo(
    () => groupsDocuments.find((item) => item.id === Number(groupDocumentId)),
    [groupsDocuments, groupDocumentId]
  );

  const selectedDocument = React.useMemo(
    () =>
      selectedGroupOfDocument?.documents.find(
        (item) => item.id === Number(documentId)
      ),
    [selectedGroupOfDocument, documentId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <GroupOfDocumentsFilters value={filters} setValue={setFilters} />
        <Stack spacing={2}>
          {isLoading ? (
            <LoadingData />
          ) : groupsDocuments.length === 0 ? (
            <WithoutData />
          ) : (
            groupsDocuments.map((groupDocuments: GroupOfDocs) => (
              <ListGroupOfDocuments
                groupDocuments={groupDocuments}
                key={groupDocuments.id}
              />
            ))
          )}
        </Stack>
      </Stack>
      {match({ action, selectedGroupOfDocument, selectedDocument })
        .with({ action: "add" }, () => (
          <AddGroupOfDocsModal shouldOpen={true} />
        ))
        .with(
          { action: "edit", selectedGroupOfDocument: P.not(undefined) },
          ({ selectedGroupOfDocument }) => (
            <EditGroupOfDocsModal
              shouldOpen={true}
              groupDocuments={selectedGroupOfDocument}
            />
          )
        )
        .with(
          { action: "delete", selectedGroupOfDocument: P.not(undefined) },
          ({ selectedGroupOfDocument }) => (
            <DeleteGroupOfDocsModal
              shouldOpen={true}
              groupDocuments={selectedGroupOfDocument}
            />
          )
        )
        .with(
          { action: "add-document", selectedGroupOfDocument: P.not(undefined) },
          ({ selectedGroupOfDocument }) => (
            <AddDocumentsModal
              shouldOpen={true}
              groupDocuments={selectedGroupOfDocument}
            />
          )
        )
        .with(
          {
            action: "edit-document",
            selectedDocument: P.not(undefined),
          },
          ({ selectedDocument }) => (
            <EditDocumentModal shouldOpen={true} document={selectedDocument} />
          )
        )
        .with(
          {
            action: "delete-document",
            selectedDocument: P.not(undefined),
          },
          ({ selectedDocument }) => (
            <DeleteDocumentModal
              shouldOpen={true}
              document={selectedDocument}
            />
          )
        )
        .with(
          {
            action: "history",
            selectedDocument: P.not(undefined),
          },
          ({ selectedDocument }) => (
            <HistoryModal shouldOpen={true} document={selectedDocument} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
