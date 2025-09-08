import React, { useState, useMemo, useCallback } from "react";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ReusableDataGrid from "@/components/ReusableDataGrid";
import IconOpenModal from "@/components/IconOpenModal";
import AlertDialogModal from "@/components/AlertDialogModal";
import { UserReserve } from "@/utils/types/user-time-sharing-reserves";
import { formatDate } from "@/utils/dates";
import { getReserveForEdit, cancelReserve } from "@/services/querys/user-time-sharing-reserves-edit";

interface ReservesDataGridProps {
  reserves: UserReserve[];
  loading?: boolean;
}

export default function ReservesDataGrid({ reserves, loading = false }: ReservesDataGridProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReserveNumber, setSelectedReserveNumber] = useState<number | null>(null);

  const handleEdit = useCallback((reserveNumber: number) => {
    router.push(`/dashboard/user-time-sharing-reserves/editar/${reserveNumber}`);
  }, [router]);

  const handleCancel = useCallback((reserveNumber: number) => {
    setSelectedReserveNumber(reserveNumber);
    setCancelModalOpen(true);
  }, []);

  const confirmCancel = async () => {
    if (!selectedReserveNumber) return;
    
    try {
      setLoadingAction(selectedReserveNumber.toString());
      const response = await cancelReserve(selectedReserveNumber);
      if (response.success) {
        toast.success("Reserva cancelada com sucesso!");
        // Recarregar a página ou atualizar os dados
        window.location.reload();
      } else {
        toast.error("Erro ao cancelar a reserva");
      }
    } catch (error) {
      toast.error("Erro ao cancelar a reserva");
    } finally {
      setLoadingAction(null);
      setCancelModalOpen(false);
      setSelectedReserveNumber(null);
    }
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedReserveNumber(null);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'reserveNumber',
      headerName: 'Reserva',
      width: 120,
      type: 'number',
    },
    {
      field: 'clientName',
      headerName: 'Nome do cliente',
      width: 200,
      flex: 1,
    },
    {
      field: 'confidential',
      headerName: 'Confid.',
      width: 80,
    },
    {
      field: 'hostType',
      headerName: 'Tipo hóspede',
      width: 120,
    },
    {
      field: 'hostName',
      headerName: 'Nome hóspede',
      width: 200,
      flex: 1,
    },
    {
      field: 'reserveStatus',
      headerName: 'Status reserva',
      width: 120,
    },
    {
      field: 'checkin',
      headerName: 'Checkin',
      width: 120,
      valueFormatter: (params) => formatDate(params),
    },
    {
      field: 'checkout',
      headerName: 'Checkout',
      width: 120,
      valueFormatter: (params) => formatDate(params),
    },
    {
      field: 'cancellationDate',
      headerName: 'Cancelada em',
      width: 180,
      valueFormatter: (params) => formatDate(params),
    },
    {
      field: 'adults',
      headerName: 'Adultos',
      width: 70,
      type: 'number',
    },
    {
      field: 'children1',
      headerName: 'Crianças 1',
      width: 80,
      type: 'number',
    },
    {
      field: 'children2',
      headerName: 'Crianças 2',
      width: 90,
      type: 'number',
    },
    {
      field: 'hotel',
      headerName: 'Hotel',
      width: 200,
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 200,
      getActions: (params) => {
        const isLoading = loadingAction === params.row.reserveNumber.toString();
        
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={
              <IconOpenModal
                params={{
                  idFrontReservations: params.row.idFrontReservations,
                }}
                type="show"
                tooltip="Ver detalhes"
              />
            }
            label="Ver detalhes"
            onClick={() => {}}
          />,
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Editar reserva">
                <EditIcon />
              </Tooltip>
            }
            label="Editar"
            onClick={() => handleEdit(params.row.reserveNumber)}
            disabled={isLoading}
          />,
        ];

        // Adiciona a ação de cancelar apenas se a reserva estiver confirmada
        if (params.row.reserveStatus.toString().includes("confirmada") || params.row.reserveStatus.toString().includes("confirmar")) {
          actions.push(
            <GridActionsCellItem
              key="cancel"
              icon={
                <Tooltip title="Cancelar reserva">
                  <CancelIcon />
                </Tooltip>
              }
              label="Cancelar"
              onClick={() => handleCancel(params.row.reserveNumber)}
              disabled={isLoading}
            />
          );
        }

        return actions;
      },
    },
  ], [loadingAction, handleEdit, handleCancel]);

  // Transformar os dados para incluir um id único para o DataGrid
  const rows = useMemo(() => 
    reserves.map((reserve) => ({
      ...reserve,
      id: reserve.idFrontReservations, // DataGrid precisa de um campo 'id' único
    })),
    [reserves]
  );

  return (
    <>
      <ReusableDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        height={600}
        density="compact"
        pagination={{
          enabled: false,
        }}
        export={{
          enabled: true,
          filename: 'reservas-time-sharing',
        }}
        toolbar={{
          enabled: true,
          showQuickFilter: true,
          title: "Reservas",
        }}

      />
      
      <AlertDialogModal
        openModal={cancelModalOpen}
        closeModal={closeCancelModal}
        onHandleAction={confirmCancel}
        title="Cancelar Reserva"
        message="Tem certeza que deseja cancelar esta reserva?"
        actionText="Cancelar Reserva"
        cancelActionText="Voltar"
      />
    </>
  );
}