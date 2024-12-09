// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Flex, UnstyledButton, Tooltip, Stack, Box } from '@mantine/core';
import { IconFile, IconSearch, IconSettings } from '@tabler/icons-react';
// import NavMenu from './NavMenu.jsx';

const Sidebar = () => {
  const [fileMenuOpened, setFileMenuOpened] = useState(false);
  const [searchMenuOpened, setSearchMenuOpened] = useState(false);

  return (
    <>
      <Flex></Flex>
    </>
  );
};

export default Sidebar;
