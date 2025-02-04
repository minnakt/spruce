import { render, screen, userEvent, waitFor } from "test_utils";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from ".";

describe("historyTableIcon", () => {
  it("clicking on the icon performs an action", () => {
    const onClick = jest.fn();
    render(
      <HistoryTableIcon status={TaskStatus.Succeeded} onClick={onClick} />
    );
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    userEvent.click(icon);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("hovering over the icon when there no failing tests shouldn't open a tooltip", () => {
    render(<HistoryTableIcon status={TaskStatus.Succeeded} />);
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    userEvent.hover(icon);
    expect(screen.queryByText("test a")).not.toBeInTheDocument();
  });

  it("hovering over the icon when there are failing tests should open a tooltip", async () => {
    render(
      <HistoryTableIcon
        status={TaskStatus.Succeeded}
        failingTests={failingTests}
      />
    );
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    userEvent.hover(icon);
    await waitFor(() => {
      expect(screen.queryByText("test a")).toBeVisible();
    });
  });
});

const failingTests = [
  "test a",
  "test b",
  "test c",
  "test looooonnnnnnnng name",
  "some other test",
  "test name d",
];
