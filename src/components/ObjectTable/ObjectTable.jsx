import React, { useState, useEffect } from 'react';
import {
  Center,
  Text,
  Button,
  Stack,
  Table,
  ScrollArea,
  px,
} from '@mantine/core';
import classes from './ObjectTable.modules.css'; // Import the CSS file

const ObjectTable = ({ groupedData, groupKey }) => {
  const data = groupedData[groupKey] || [];

  if (data.length === 0) {
    return <p>No data available for this group.</p>;
  }

  const rows = data.map((element) => (
    <Table.Tr key={element.objectName}>
      <Table.Td>{element.objectName}</Table.Td>
      <Table.Td>{element.presentValue}</Table.Td>
      <Table.Td>{element.range}</Table.Td>
      <Table.Td>{element.type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      offsetScrollbars
      style={{
        height: `calc(100vh - ${px(35)}px)`,
      }}
    >
      <Table stickyHeader striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Unit</Table.Th>
            <Table.Th>Object</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
    // <Table>
    //   <thead>
    //     <tr>
    //       <th>Name</th>
    //       <th>Value</th>
    //       <th>Unit</th>
    //       <th>ObjectRef</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {data.map((item, index) => (
    //       <tr key={index}>
    //         <td>{item.objectName}</td>
    //         <td>{item.presentValue}</td>
    //         <td>{item.unit}</td>
    //         <td>{item.type}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </Table>
  );
};

export default ObjectTable;
