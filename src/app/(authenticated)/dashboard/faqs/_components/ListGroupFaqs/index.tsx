import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { GroupFaq } from "@/utils/types/faqs";
import useUser from "@/hooks/useUser";
import IconOpenModal from "@/components/IconOpenModal";
import ListFaqs from "../ListFaqs";

type ListGroupFaqsProps = {
  groupFaqs: GroupFaq;
};

export default function ListGroupFaqs({ groupFaqs }: ListGroupFaqsProps) {
  const amountOfResponses =
    groupFaqs?.faqs?.filter((item) => item.response !== "").length ?? 0;
  const amountOfQuestions =
    groupFaqs?.faqs?.filter((item) => item.question !== "").length ?? 0;

  const { isAdm } = useUser();

  return (
    <Accordion
      sx={{
        backgroundColor: "var(--faq-panel-bg)",
        borderRadius: "8px",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          marginTop: 2,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: "var(--faq-icon-color)", fontSize: "28px" }}
          />
        }
        disableRipple
        sx={{
          backgroundColor: "var(--faq-panel-bg)",
          flexDirection: "row-reverse",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "var(--faq-panel-bg-hover)",
          },
          "&.Mui-expanded": {
            backgroundColor: "var(--faq-panel-bg-hover)",
            minHeight: "48px",
          },
          py: 1,
          px: 2,
          ".MuiAccordionSummary-content": {
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 800, color: "var(--faq-text-color)" }}
        >
          {groupFaqs?.name}
        </Typography>

        <Box ml="auto" />

        <Stack direction="row" spacing={1} alignItems="center">
          <Badge
            badgeContent={`${amountOfResponses}/${amountOfQuestions}`}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "var(--faq-badge-bg)",
                color: "var(--faq-badge-text)",
                fontWeight: 600,
                borderRadius: "8px",
                border: "2px solid var(--faq-badge-border)",
              },
            }}
          >
            <QuizIcon sx={{ color: "var(--faq-icon-color)" }} />
          </Badge>

          {isAdm && (
            <>
              <IconOpenModal
                params={{ groupFaqId: groupFaqs?.id }}
                type="add-faq"
                sxoverride={{ color: "var(--faq-icon-color)" }}
                icon={<AddCircleOutlineIcon />}
                tooltip="Adicionar pergunta"
              />

              <IconOpenModal
                tooltip="Editar grupo"
                sxoverride={{ color: "var(--faq-icon-color)" }}
                params={{ groupFaqId: groupFaqs?.id }}
                type="edit"
              />

              <IconOpenModal
                tooltip="Deletar grupo"
                sxoverride={{ color: "var(--faq-icon-color)" }}
                params={{ groupFaqId: groupFaqs?.id }}
                type="delete"
              />
            </>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          backgroundColor: "var(--faq-panel-bg)",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          p: 0,
        }}
      >
        <Stack spacing={2} padding="10px">
          {groupFaqs?.faqs?.map((faq) => (
            <ListFaqs faq={faq} key={faq.id} groupFaqId={groupFaqs?.id} />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
