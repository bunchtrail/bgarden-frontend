import React from 'react';
import { tableClasses } from '../../styles/global-styles';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <table className={`${tableClasses.table} ${className}`} {...props}>
      {children}
    </table>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = '',
}) => {
  return <thead className={className}>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = '',
}) => {
  return <tbody className={className}>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
}) => {
  return <tr className={`${tableClasses.row} ${className}`}>{children}</tr>;
};

interface TableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  className?: string;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <th className={`${tableClasses.header} ${className}`} {...props}>
      {children}
    </th>
  );
};

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <td className={`${tableClasses.cell} ${className}`} {...props}>
      {children}
    </td>
  );
};

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${tableClasses.container} ${className}`}>{children}</div>
  );
};

interface TableActionCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableActionCell: React.FC<TableActionCellProps> = ({
  children,
  className = '',
}) => {
  return (
    <td
      className={`${tableClasses.cell} ${tableClasses.actionCell} ${className}`}
    >
      {children}
    </td>
  );
};

export default {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableContainer,
  TableActionCell,
};
