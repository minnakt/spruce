import { MockedProvider } from "@apollo/client/testing";
import { VersionTaskDurationsQuery } from "gql/generated/types";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "test_utils";
import { TaskDurationTable } from "./TaskDurationTable";

describe("taskDurationTable", () => {
  it("renders all rows", () => {
    render(
      <MockedProvider>
        <TaskDurationTable tasks={tasks} loading={false} />
      </MockedProvider>
    );
    expect(screen.queryAllByDataCy("task-duration-table-row")).toHaveLength(2);
  });

  it("opens nested row on click", async () => {
    render(
      <MockedProvider>
        <TaskDurationTable tasks={tasks} loading={false} />
      </MockedProvider>
    );
    expect(screen.queryByDataCy("execution-task-row")).not.toBeVisible();
    const expandRowButton = within(
      screen.queryAllByDataCy("task-duration-table-row")[0]
    ).queryByRole("button");
    userEvent.click(expandRowButton);
    await waitFor(() => {
      expect(screen.queryByDataCy("execution-task-row")).toBeVisible();
    });
  });
});

const tasks: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
  {
    id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    status: "success",
    displayName: "check_codegen",
    buildVariantDisplayName: "Ubuntu 16.04",
    timeTaken: 6000,
    executionTasksFull: [
      {
        id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
        execution: 0,
        status: "success",
        displayName:
          "check_codegen_EXE_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_long_name",
        buildVariantDisplayName: "Ubuntu 16.04",
        timeTaken: 4000,
      },
    ],
    __typename: "Task",
  },
  {
    id: "spruce_ubuntu1604_compile_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    status: "success",
    displayName: "compile",
    buildVariantDisplayName: "Ubuntu 16.04",
    executionTasksFull: null,
    timeTaken: 10000,
    __typename: "Task",
  },
];
