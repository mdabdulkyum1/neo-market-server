import { ZodError, ZodIssue } from "zod";
import { IGenericErrorMessage, TErrorDetails, TGenericErrorResponse } from "../interface/error";
import { IGenericErrorResponse } from "../interface/common";

export const handleZodError2 = (err: ZodError): TGenericErrorResponse => {
  const messageParts: string[] = [];

  const errorDetails: TErrorDetails = {
    issues: err.issues.map((issue: ZodIssue) => {
      const path = issue.path[issue.path.length - 1];
      const safePath = typeof path === "symbol" ? String(path) : path;

      const msg =
        issue.message === "Expected number, received string"
          ? `${safePath} ${issue.message}`
          : issue.message;

      messageParts.push(msg);

      return {
        path: safePath,
        message: issue.message,
      };
    }),
  };

  return {
    statusCode: 400,
    message: messageParts.join(". "),
    errorDetails,
  };
};

// handleZodError corrected
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    const path = issue.path[issue.path.length - 1];
    const safePath = typeof path === "symbol" ? String(path) : path;

    return {
      path: safePath,
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
