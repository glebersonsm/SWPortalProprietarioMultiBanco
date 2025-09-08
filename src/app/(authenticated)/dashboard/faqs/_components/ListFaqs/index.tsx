import IconOpenModal from "@/components/IconOpenModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { Faq } from "@/utils/types/faqs";
import useUser from "@/hooks/useUser";
import EditIcon from "@mui/icons-material/Edit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

type ListFaqsProps = {
  faq: Faq;
  groupFaqId: number;
};

export default function ListFaqs({ faq, groupFaqId }: ListFaqsProps) {
  const { isAdm } = useUser();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Accordion
        key={faq.id}
      disableGutters
      elevation={0}
      square={false}
      sx={{
        background: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
        borderRadius: "12px",
        boxShadow: "0 4px 20px var(--card-shadow-color, rgba(3, 87, 129, 0.15)), 0 2px 8px var(--card-shadow-color, rgba(44, 162, 204, 0.1))",
        border: "1px solid var(--card-border-color, rgba(44, 162, 204, 0.2))",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:before": { display: "none" },
        "&.Mui-expanded": { 
          marginTop: 2,
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px var(--card-shadow-color-expanded, rgba(3, 87, 129, 0.25)), 0 4px 16px var(--card-shadow-color-expanded, rgba(44, 162, 204, 0.15))"
        },
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 6px 24px var(--card-shadow-color-hover, rgba(3, 87, 129, 0.2)), 0 3px 12px var(--card-shadow-color-hover, rgba(44, 162, 204, 0.12))"
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ 
          color: "white",
          fontSize: "1.5rem",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          transition: "all 0.3s ease"
         }} />}
        disableRipple
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          flexDirection: "row-reverse",
          borderRadius: "12px 12px 0 0",
          minHeight: "64px !important",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { 
            background: "rgba(255, 255, 255, 0.15)",
            transform: "scale(1.01)"
          },
          "&.Mui-expanded": {
            borderRadius: "12px 12px 0 0",
            background: "rgba(255, 255, 255, 0.2)"
          },
          py: 2,
          px: 3,
          ".MuiAccordionSummary-content": {
            flexDirection: "row",
            alignItems: "center",
            margin: "0 !important"
          },
          ".MuiAccordionSummary-expandIconWrapper": {
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.4,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            flex: 1,
            "&:hover": {
              transform: "translateX(4px)",
              textShadow: "0 3px 6px rgba(0,0,0,0.4)"
            }
          }}
          dangerouslySetInnerHTML={{ __html: faq.question }}
        />

        <Box ml="auto" />

        <Stack marginLeft="auto" direction="row" alignItems="center">
          {faq.question !== "" && (
            <Stack marginRight="5px" marginLeft="5px">
              <QuestionAnswerIcon sx={{ color: "var(--faq-icon-color)" }} />
            </Stack>
          )}
          {isAdm && (
            <>
              <IconOpenModal
                params={{ groupFaqId, faqId: faq.id }}
                type="edit-faq"
                sxoverride={{ color: "var(--faq-icon-color)" }}
                icon={<EditIcon />}
              />
              <IconOpenModal
                params={{ groupFaqId, faqId: faq.id }}
                type="delete-faq"
                sxoverride={{ color: "var(--faq-icon-color)" }}
                icon={<DeleteIcon />}
              />
            </>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "0 0 12px 12px",
          border: "1px solid var(--card-border-color, rgba(44, 162, 204, 0.1))",
          borderTop: "none",
          px: 3,
          py: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
          }
        }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" ml={2}>
          <Typography
            sx={{
              color: "var(--faq-response-text)",
              fontWeight: 700,
              mr: 1,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            R:
          </Typography>
          <Typography
            sx={{
              color: "var(--color-secondary)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: 1.7,
              textAlign: "justify",
              "& p": {
                margin: "0 0 12px 0",
                "&:last-child": { margin: 0 }
              },
              "& strong": {
                color: "var(--color-primary)",
                fontWeight: 600
              },
              "& a": {
                color: "var(--color-primary)",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline"
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: faq.response }}
          />
        </Box>
      </AccordionDetails>
      </Accordion>
    </Box>
  );
}
