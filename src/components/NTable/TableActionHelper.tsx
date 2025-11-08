import TableActionsCol from './TableActionsCol';

export const addActionsColumn = (columns) => {
  return [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <TableActionsCol row={row} />,
    }
  ];
};