import Alert from "@mui/joy/Alert";
import ReportIcon from "@mui/icons-material/Report";

export type AlertErrorProps = {
  error: string | undefined;
};

export default function AlertError({ error }: AlertErrorProps) {
  return (
    <>
      {!!error ? (
        <Alert variant="soft" color="primary" startDecorator={<ReportIcon />}>
          {error ?? "Não é possível fazer essa ação nesse momento"}
        </Alert>
      ) : null}
    </>
  );
}
