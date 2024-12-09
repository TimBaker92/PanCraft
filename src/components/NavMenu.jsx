// src/components/NavMenu.jsx
import React from 'react';
import { Drawer, Button, Stack, Text } from '@mantine/core';

const NavMenu = ({ opened, onClose, title }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={title}
      padding="md"
      size="300px"
      position="left"
      withCloseButton
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      <Stack spacing="sm">
        <Button variant="subtle" fullWidth>
          {title} Option 1
        </Button>
        <Button variant="subtle" fullWidth>
          {title} Option 2
        </Button>
        <Button variant="subtle" fullWidth>
          {title} Option 3
        </Button>
      </Stack>
    </Drawer>
  );
};

export default NavMenu;
