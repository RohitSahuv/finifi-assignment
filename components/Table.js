import React, { useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './EntryForm';

const TableContainer = styled.div`
  border: 1px solid #eaf1fb;
  border-radius: 8px;
  width: 100%;
  overflow-x: auto;
  max-height: 50vh;
  overflow-y: scroll;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #eaf1fb;
  text-align: left;
  font-weight: 400;
  font-size: 14px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Tbody = styled.tbody`
  width: 100%;
`;

const Badge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case 'Awaiting Approval':
        return '#FDF3E4'; // Light Orange
      case 'Open':
        return '#E6F4F9'; // Light Blue
      case 'Approved':
        return '#E8F5E9'; // Light Green
      case 'Vendor not found':
        return '#FDECEA'; // Light Red
      case 'Processing':
        return '#EAF2FC'; // Light Blue
      case 'Paid':
        return '#EFE9F9'; // Light Purple
      default:
        return '#F1F1F1'; // Light Gray
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'Awaiting Approval':
        return '#D9822B'; // Dark Orange
      case 'Open':
        return '#2C88B6'; // Dark Blue
      case 'Approved':
        return '#388E3C'; // Dark Green
      case 'Vendor not found':
        return '#C33A29'; // Dark Red
      case 'Processing':
        return '#1C6CB8'; // Dark Blue
      case 'Paid':
        return '#5C4699'; // Dark Purple
      default:
        return '#6C757D'; // Dark Gray
    }
  }};
  border: 1px solid ${(props) => {
    switch (props.status) {
      case 'Awaiting Approval':
        return '#D9822B'; // Dark Orange
      case 'Open':
        return '#2C88B6'; // Dark Blue
      case 'Approved':
        return '#388E3C'; // Dark Green
      case 'Vendor not found':
        return '#C33A29'; // Dark Red
      case 'Processing':
        return '#1C6CB8'; // Dark Blue
      case 'Paid':
        return '#5C4699'; // Dark Purple
      default:
        return '#6C757D'; // Dark Gray
    }
  }};


`;

export const CustomTable = ({ columns, data, onSelectRow, customRender }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? data.map((row) => row.id) : []);
  };

  // Handle individual row selection
  const handleRowSelection = (id, e) => {
    const checked = e.target.checked;
    const updatedSelectedRows = checked
      ? [...selectedRows, id]
      : selectedRows.filter((rowId) => rowId !== id);

    setSelectedRows(updatedSelectedRows);
    if (onSelectRow) {
      onSelectRow(updatedSelectedRows);
    }
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <TableHeader key={index}>
                {col.key === 'checkbox' ? (
                  <Checkbox
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                ) : (
                  col.label
                )}
              </TableHeader>
            ))}
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.key === 'checkbox' ? (
                    <Checkbox
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => handleRowSelection(row.id, e)}
                    />
                  ) : col.key === 'status' ? (
                    <Badge status={row[col.key]}>{row[col.key]}</Badge>
                  ) : (
                    row[col.key] || '-'
                  )}
                </TableCell>
              ))}
              <TableCell>
                <StyledButton onClick={() => onSelectRow(row)}>
                  Edit
                </StyledButton>
              </TableCell>
            </TableRow>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
