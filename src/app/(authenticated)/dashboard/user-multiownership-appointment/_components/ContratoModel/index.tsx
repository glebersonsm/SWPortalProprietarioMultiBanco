import { useQuery } from "@tanstack/react-query";
import { Espanhol } from "./espanhol";
import { Portuques } from "./portuques";
import { getInfoContracts } from "@/services/querys/user-multiownership-contracts";

interface Props {
  coteId: number;
  open: boolean;
  roomCondominiumId: number;
  periodCoteAvailabilityId: number;
  handleClose: VoidFunction;
  handleSubmitClose: () => void;
  language?: number;
}

export function ContratoModel({ coteId, language, ...props }: Props) {
  const { data } = useQuery({
    queryKey: ["getFreepoolContract", { coteId }],
    queryFn: () =>
      getInfoContracts({
        CotaOrContratoId: coteId,
        UhCondominioId: props.roomCondominiumId,
        PeriodoCotaDisponibilidadeId: props.periodCoteAvailabilityId,
      }),
  });

  switch (language) {
    case 0:
      return <Portuques data={data} {...props} />;
    case 1:
      break;
    case 2:
      return <Espanhol data={data} {...props} />;
  }
}
