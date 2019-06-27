import React from "react";

import { DataTable } from "carbon-components-react";
const { TableRow, TableCell } = DataTable;

const PureBaseItem = ({ modifier, base, onRemove }) => {
  return (
    <TableRow>
      <TableCell>{base.id}</TableCell>
      <TableCell />
      <TableCell />
    </TableRow>
  );
};

export default PureBaseItem;
