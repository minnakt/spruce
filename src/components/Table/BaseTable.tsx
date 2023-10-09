import { css } from "@leafygreen-ui/emotion";
import {
  Cell,
  ExpandedContent,
  flexRender,
  HeaderCell,
  HeaderRow,
  type LGRowData,
  Row,
  Table,
  TableBody,
  type TableProps,
  TableHead,
} from "@leafygreen-ui/table/new";

type SpruceTableProps = {
  "data-cy-row"?: string;
  "data-cy-table"?: string;
  emptyComponent?: React.ReactNode;
};

export const BaseTable = <T extends LGRowData>({
  "data-cy-row": dataCyRow,
  "data-cy-table": dataCyTable,
  emptyComponent,
  table,
  ...args
}: SpruceTableProps & TableProps<T>) => (
  <Table data-cy={dataCyTable} table={table} {...args}>
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <HeaderRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <HeaderCell key={header.id} header={header}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {/* @ts-ignore-error */}
              {header.column.columnDef?.meta?.filterComponent?.({
                column: header.column,
              })}
              {/* @ts-ignore-error */}
              {header.column.columnDef?.meta?.sortComponent?.({
                column: header.column,
              })}
            </HeaderCell>
          ))}
        </HeaderRow>
      ))}
    </TableHead>
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <Row
          key={row.id}
          row={row}
          data-cy={dataCyRow}
          className={css`
            &[aria-hidden="false"] td > div {
              max-height: unset;
            }
          `}
        >
          {row.getVisibleCells().map((cell) => (
            <Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Cell>
          ))}
          {row.original.renderExpandedContent && <ExpandedContent row={row} />}
          {row.subRows &&
            row.subRows.map((subRow) => (
              <Row
                key={subRow.id}
                row={subRow}
                className={css`
                  &[aria-hidden="false"] td > div[data-state="entered"] {
                    max-height: unset;
                  }
                `}
              >
                {subRow.getVisibleCells().map((cell) => (
                  <Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Cell>
                ))}
              </Row>
            ))}
        </Row>
      ))}
    </TableBody>
    {table.getRowModel().rows.length === 0 &&
      (emptyComponent || "No data to display")}
  </Table>
);
