import { AliasFormType, ProjectType } from "../utils";
import { sectionHasError } from "./getErrors";

const callSectionHasError = ({
  versionControlEnabled,
  projectType,
  override,
  aliases,
  repoAliases,
}) =>
  sectionHasError(versionControlEnabled, projectType)(
    override,
    aliases,
    repoAliases,
    "myFieldName"
  );

describe("an attached project", () => {
  const baseArgs = {
    versionControlEnabled: true,
    projectType: ProjectType.AttachedProject,
    override: true,
    aliases: [],
    repoAliases: [],
  };

  describe("when aliases are not defined for the project", () => {
    it("returns a warning when version config is enabled", () => {
      expect(callSectionHasError(baseArgs)).toStrictEqual({
        "ui:warnings": [
          "This feature will only run if a myFieldName is defined in the project, repo, or Evergreen configuration file.",
        ],
      });
    });

    it("returns an error when version config is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
        })
      ).toStrictEqual({
        "ui:errors": [
          "A myFieldName must be specified for this feature to run.",
        ],
      });
    });
  });

  describe("when aliases are defined for the project", () => {
    it("returns an empty object", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          aliases: [{} as AliasFormType],
        })
      ).toStrictEqual({});
    });
  });

  describe("when aliases are not defined for the project or repo", () => {
    it("returns a warning when version config is enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          override: false,
        })
      ).toStrictEqual({
        "ui:warnings": [
          "This feature will only run if a myFieldName is defined in the project, repo, or Evergreen configuration file.",
        ],
      });
    });

    it("returns a warning when version config is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
          override: false,
        })
      ).toStrictEqual({
        "ui:warnings": [
          "This feature will only run if a myFieldName is defined in the project or repo.",
        ],
      });
    });
  });
});

describe("a repo", () => {
  const baseArgs = {
    versionControlEnabled: true,
    projectType: ProjectType.Repo,
    override: true,
    aliases: [],
    repoAliases: [],
  };

  it("returns an empty object when an alias is defined", () => {
    expect(
      callSectionHasError({
        ...baseArgs,
        aliases: [{} as AliasFormType],
      })
    ).toStrictEqual({});
  });

  describe("when an alias is not defined", () => {
    it("returns a warning when version control is enabled", () => {
      expect(callSectionHasError(baseArgs)).toStrictEqual({
        "ui:warnings": [
          "This feature will only run if a myFieldName is defined in the repo or Evergreen configuration file.",
        ],
      });
    });

    it("returns an error when version control is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
        })
      ).toStrictEqual({
        "ui:errors": [
          "A myFieldName must be specified for this feature to run.",
        ],
      });
    });
  });
});