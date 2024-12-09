import React, { useState, useEffect } from 'react';
import cx from 'clsx';
import {
  Center,
  Text,
  Button,
  Stack,
  Table,
  ScrollArea,
  Group,
  keys,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import classes from './MainArea.module.css'; // Import the CSS file
import DefaultView from '../DefaultView.jsx';
import ExplorerBar from '../ExplorerBar/ExplorerBar.jsx';
import ObjectTable from '../ObjectTable/ObjectTable.jsx';

function MainComponent({ fileXML, fileOpened, handleOpenFile }) {
  const [activeSection, setActiveSection] = useState(null);

  // const groups = {
  //   panSystemGroups: ['GRP'],
  //   panInputs: ['BI', 'AI'],
  //   panOutputs: ['AO', 'BO', 'MO'],
  //   panValues: ['AV', 'BV', 'MV'],
  //   panLoops: ['LOOP'],
  //   panCalendars: ['CAL'],
  //   panMultipointTrendLogs: ['MTL'],
  //   panSingleTrendLogs: ['STL'],
  //   panPrograms: ['PRG'],
  //   panArrays: ['AY'],
  //   panTables: ['TBL'],
  //   panSmartSensor: ['SS'],
  //   panSchedules: ['SCHED'],
  // };

  const sections = [
    { key: 'panObjects', label: 'All Objects' },
    { key: 'panSystemGroups', label: 'System Groups' },
    { key: 'panInputs', label: 'Inputs' },
    { key: 'panOutputs', label: 'Outputs' },
    { key: 'panValues', label: 'Values' },
    { key: 'panLoops', label: 'Loops' },
    { key: 'panSchedules', label: 'Schedules' },
    { key: 'panCalendars', label: 'Calendars' },
    { key: 'panMultipointTrendLogs', label: 'Multipoint Trends' },
    { key: 'panSingleTrendLogs', label: 'Singlepoint Trends' },
    { key: 'panPrograms', label: 'Programs' },
    { key: 'panArrays', label: 'Arrays' },
    { key: 'panTables', label: 'Tables' },
  ];
  // const sections = [
  //   { key: 'panObjects', label: 'All Objects' },
  //   { key: 'panSystemGroups', label: 'System Groups', groupTypes: ['GRP'] },
  //   { key: 'panInputs', label: 'Inputs', groupTypes: ['BI', 'AI'] },
  //   { key: 'panOutputs', label: 'Outputs', groupTypes: ['AO', 'BO', 'MO'] },
  //   { key: 'panValues', label: 'Values', groupTypes: ['AV', 'BV', 'MV'] },
  // ];
  return (
    <div className={classes.mainarea}>
      {fileOpened ? (
        <TableScrollArea data={fileXML}></TableScrollArea>
      ) : (
        <div className={classes.leftarea}>
          <Stack p="md">
            <Text>You have not yet opened a file</Text>
            <Button onClick={() => handleOpenFile()}>Open File</Button>
          </Stack>
        </div>
      )}

      <div className={classes.rightarea}>
        <DefaultView />
      </div>
    </div>
  );
}

function TableScrollArea({ data }) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);

    const filteredData = data.filter(
      (item) =>
        item.objectName &&
        item.objectName.toLowerCase().includes(value.toLowerCase())
    );
    setSortedData(filteredData);
  };

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    setSortColumn(column);

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (!isNaN(aValue) && !isNaN(bValue)) {
        // Sort numbers
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === 'asc'
        ? aValue.localeCompare(bValue, undefined, { numeric: true })
        : bValue.localeCompare(aValue, undefined, { numeric: true });
    });
    setSortedData(sorted);
  };

  const rows = data.map((row) => (
    <Table.Tr key={row.name}>
      <Table.Td>{row.objectName}</Table.Td>
      <Table.Td>{row.panObj}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack h="100%" gap="xs">
      <TextInput
        placeholder="Search by Name"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={handleSearch}
      />
      <ScrollArea>
        <Table stickyHeader striped highlightOnHover bg="dark.8">
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                onClick={() => handleSort('objectName')}
                style={{ cursor: 'pointer' }}
              >
                Name{' '}
                {sortColumn === 'objectName' &&
                  (sortDirection === 'asc' ? '▲' : '▼')}
              </Table.Th>
              <Table.Th
                onClick={() => handleSort('panObj')}
                style={{ cursor: 'pointer' }}
              >
                Object{' '}
                {sortColumn === 'panObj' &&
                  (sortDirection === 'asc' ? '▲' : '▼')}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{item.objectName}</Table.Td>
                  <Table.Td>{item.panObj}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Center>
                    <Text>No results found</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}

export default MainComponent;
