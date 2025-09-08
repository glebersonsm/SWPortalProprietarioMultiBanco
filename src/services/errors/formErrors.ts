import { AxiosError } from "axios";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface ErrorResponse {
  errors?: string[];
}

type setFormErrorsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  error: AxiosError<ErrorResponse>;
  generalMessage: string;
  errorIsFirst?: boolean;
};

export const setFormErrors = <T extends FieldValues>({
  error,
  form,
  generalMessage,
  errorIsFirst = false,
}: setFormErrorsProps<T>) => {
  const errorMessage = error?.response?.data?.errors?.[errorIsFirst ? 0 : 1];
  const status = error?.response?.status;

  if (status === 500) {
    form.setError("root.generalError", {
      type: String(status),
      message: generalMessage,
    });
  } else {
    form.setError("root.generalError", {
      type: String(status),
      message: errorMessage,
    });
  }
};

export const onErrorHandler = <T extends FieldValues>({
  error,
  form,
  generalMessage,
}: setFormErrorsProps<T>) => {
  setFormErrors({
    error,
    form,
    generalMessage,
  });
};
