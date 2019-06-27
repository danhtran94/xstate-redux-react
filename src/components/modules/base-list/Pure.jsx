import React from "react";
import { states } from "./machine";

import { DataTable, Button } from "carbon-components-react";
const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableHeader,
  TableToolbar,
  TableToolbarContent
} = DataTable;

import BaseItem from "@/components/modules/base-item";

export const PureBaseList = ({ modifier, bases, onCreateBase }) => {
  const views = {
    [states.EMPTY]: (
      <Button onClick={onCreateBase} kind="primary">
        Create first base
      </Button>
    ),
    [states.ERROR]: <div>Error while fetching bases.</div>,
    [states.INIT]: <div>Waiting to validating.</div>,
    [states.LOADING]: <div>Loading...</div>,
    [states.SUCCESS]: (
      <div>
        <DataTable
          rows={bases}
          headers={[
            {
              key: "id",
              header: "id"
            },
            {
              key: "name",
              header: "name"
            },
            {
              key: "date",
              header: "date"
            }
          ]}
          render={({ rows, headers, getHeaderProps }) => (
            <TableContainer title="Bases">
              <TableToolbar>
                <TableToolbarContent>
                  <Button onClick={onCreateBase} size="small" kind="primary">
                    Create More
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header, idx) => (
                      <TableHeader key={idx} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((base, idx) => (
                    <BaseItem
                      name={`baseItem${idx}`}
                      key={idx}
                      idx={idx}
                      base={base}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      </div>
    )
  };

  return views[modifier];
};

export default PureBaseList;
