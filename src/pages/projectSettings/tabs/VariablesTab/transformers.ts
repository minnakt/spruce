import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.Variables;

export const gqlToForm: GqlToFormFunction<Tab> = (data) => {
  if (!data) return null;

  const {
    vars: { adminOnlyVars, privateVars, vars },
  } = data;

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue: varValue || "{REDACTED}",
      isPrivate: privateVars.includes(varName),
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { vars: varsData }: FormState,
  id
) => {
  const vars = varsData.reduce(
    (acc, { varName, varValue, isPrivate, isAdminOnly, isDisabled }) => {
      if (!varName || !varValue) return acc;

      let val = varValue;
      if (isPrivate) {
        acc.privateVarsList.push(varName);
        // Overwrite {REDACTED} for variables that have been previously saved as private variables
        if (isDisabled) val = "";
      }
      if (isAdminOnly) {
        acc.adminOnlyVarsList.push(varName);
      }
      acc.vars[varName] = val;
      return acc;
    },
    {
      vars: {},
      privateVarsList: [],
      adminOnlyVarsList: [],
    }
  );
  return {
    projectRef: { id },
    vars,
  };
};
