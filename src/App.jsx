import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Tabs,
  Text,
  ActionIcon,
  rem,
  Flex,
  Space,
  AspectRatio,
  Box,
  Image,
  Center,
  Tooltip,
  Group,
  useMantineTheme,
  Menu,
  Button,
  darken,
  Container,
  Paper,
  px,
} from '@mantine/core';
import {
  IconPhoto,
  IconList,
  IconStackForward,
  IconSitemap,
  IconWaveSine,
  IconSettings,
  IconMinus,
  IconSquare,
  IconSquares,
  IconX,
  IconMaximize,
} from '@tabler/icons-react';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';
import unicornImage from './assets/unicorn1.png';
import unicornMenuImage from './assets/unicorn-ico-32.png';
import MainArea from './components/MainArea/MainArea.jsx';

const objTest = [
  {
    type: 'ANALOGVALUE',
    instance: '106',
    presentValue: '0.000000',
    objectName: 'F33-OAHU-1-CFG-WHL-HT-ON',
    description: '',
    range: '2',
    increment: '0.200000',
    unit: '2',
  },
  {
    type: 'ANALOGVALUE',
    instance: '107',
    presentValue: '1.000000',
    objectName: 'F33-OAHU-1-CFG-WHL-HT-OFF',
    description: '',
    range: '2',
    increment: '0.200000',
    unit: '2',
  },
  {
    type: 'ANALOGVALUE',
    instance: '108',
    presentValue: '8.333333',
    objectName: 'F33-OAHU-1-CFG-WHL-HT-OFF-DLY',
    description: '',
    range: '20',
    increment: '0.100000',
    unit: '20',
  },
  {
    type: 'ANALOGVALUE',
    instance: '110',
    presentValue: '0.000000',
    objectName: 'F33-OAHU-1-PRG-TOTAL-HR-EFF',
    description: '',
    range: '22',
    increment: '0.100000',
    unit: '22',
  },
  {
    type: 'ANALOGVALUE',
    instance: '111',
    presentValue: '37.948025',
    objectName: 'F33-OAHU-1-PRG-OA-ENTH-IN',
    description: '',
    range: '58',
    increment: '0.100000',
    unit: '58',
  },
  {
    type: 'ANALOGVALUE',
    instance: '112',
    presentValue: '38.806309',
    objectName: 'F33-OAHU-1-PRG-OA-ENTH-OUT',
    description: '',
    range: '58',
    increment: '0.100000',
    unit: '58',
  },
  {
    type: 'ANALOGVALUE',
    instance: '113',
    presentValue: '27.917185',
    objectName: 'F33-OAHU-1-PRG-EA-ENTH-IN',
    description: '',
    range: '58',
    increment: '0.100000',
    unit: '58',
  },
  {
    type: 'ANALOGVALUE',
    instance: '115',
    presentValue: '2.000000',
    objectName: 'F33-OAHU-1-PRG-ALARM-PRIORITY',
    description: '',
    range: '26',
    increment: '0.100000',
    unit: '26',
  },
];

function MenuBar({ windowFocused, handleOpenFile }) {
  // State for tracking which menu is open
  const [openedMenu, setOpenedMenu] = useState(null);
  // const [windowFocused, setWindowFocused] = useState(true);

  // windowFocused || setOpenedMenu(null);
  useEffect(() => {
    // const handleWindowBlur = () => {
    windowFocused || setOpenedMenu(null); // Close the menu when the window loses focus
    //   setWindowFocused(false);
    // };
    // const handleFocus = () => setWindowFocused(true);

    // window.addEventListener('blur', handleWindowBlur);
    // window.addEventListener('focus', handleFocus);

    // return () => {
    //   window.removeEventListener('blur', handleWindowBlur);
    //   window.removeEventListener('focus', handleFocus);
    // };
  }, [windowFocused]);

  // Handler to open a specific menu
  const handleMenuOpen = (menuName) => {
    setOpenedMenu(menuName);
  };

  // Handler to close the menu
  const handleMenuClose = () => {
    setOpenedMenu(null);
  };

  return (
    <Group gap={0}>
      <Menu
        shadow="md"
        width={200}
        position="bottom-start"
        opened={openedMenu === 'file'}
        onClose={handleMenuClose}
        onMouseEnter={() => openedMenu && setOpenedMenu('file')}
        styles={{
          item: {
            fontSize: '13px', // Smaller font size
            padding: '4px 8px', // Smaller padding
          },
        }}
      >
        <Menu.Target>
          <Button
            variant="subtle"
            size="compact-xs"
            color="gray"
            onClick={() => handleMenuOpen('file')}
            style={() => ({
              '--button-bg':
                openedMenu === 'file'
                  ? 'var(--mantine-color-gray-light-hover)'
                  : 'transparent',
              '--button-color': windowFocused
                ? 'var(--mantine-color-gray-3)'
                : 'var(--mantine-color-gray-6)',
            })}
            // bg={openedMenu === 'file' ? var('--mantine-color-gray-light-hover') }
            // style={{'--ai-hover': {openedMenu === 'file' ? 'red' : 'green' }}}
            // {openedMenu === 'file' ? 'red' : 'green' }
          >
            File
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>New File</Menu.Item>
          <Menu.Item onClick={handleOpenFile}>Open...</Menu.Item>
          <Menu.Item>Save</Menu.Item>
          <Menu.Item>Save As...</Menu.Item>
          <Menu.Divider />
          <Menu.Item>Exit</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu
        shadow="md"
        width={200}
        position="bottom-start"
        opened={openedMenu === 'edit'}
        onClose={handleMenuClose}
        onMouseEnter={() => openedMenu && setOpenedMenu('edit')}
        styles={{
          item: {
            fontSize: '13px', // Smaller font size
            padding: '4px 8px', // Smaller padding
          },
        }}
      >
        <Menu.Target>
          <Button
            variant="subtle"
            size="compact-xs"
            color="gray"
            onClick={() => handleMenuOpen('edit')}
            style={() => ({
              '--button-bg':
                openedMenu === 'edit'
                  ? 'var(--mantine-color-gray-light-hover)'
                  : 'transparent',
              '--button-color': windowFocused
                ? 'var(--mantine-color-gray-3)'
                : 'var(--mantine-color-gray-6)',
            })}
          >
            Edit
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Undo</Menu.Item>
          <Menu.Item>Redo</Menu.Item>
          <Menu.Divider />
          <Menu.Item>Cut</Menu.Item>
          <Menu.Item>Copy</Menu.Item>
          <Menu.Item>Paste</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu
        shadow="md"
        width={200}
        position="bottom-start"
        opened={openedMenu === 'help'}
        onClose={handleMenuClose}
        onMouseEnter={() => openedMenu && setOpenedMenu('help')}
        styles={{
          item: {
            fontSize: '13px', // Smaller font size
            padding: '4px 8px', // Smaller padding
          },
        }}
      >
        <Menu.Target>
          <Button
            variant="subtle"
            size="compact-xs"
            color="gray"
            onClick={() => handleMenuOpen('help')}
            style={() => ({
              '--button-bg':
                openedMenu === 'help'
                  ? 'var(--mantine-color-gray-light-hover)'
                  : 'transparent',
              '--button-color': windowFocused
                ? 'var(--mantine-color-gray-3)'
                : 'var(--mantine-color-gray-6)',
            })}
          >
            Help
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Documentation</Menu.Item>
          <Menu.Item>Support</Menu.Item>
          <Menu.Item>About</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

function TopBar({ handleOpenFile }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowFocused, setWindowFocused] = useState(true);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  useEffect(() => {
    const handleWindowBlur = () => {
      setWindowFocused(false);
    };
    const handleFocus = () => setWindowFocused(true);

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const theme = useMantineTheme();

  // Check initial maximize state
  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await window.electronAPI.isWindowMaximized();
      setIsMaximized(maximized);
    };
    checkMaximized();

    // Listen for maximize state changes
    window.electronAPI.onMaximizeChange(setIsMaximized);
    console.log('Maximized:', isMaximized);
  }, []);

  return (
    <Group
      spacing="sm"
      pl="md"
      bg="dark.7"
      style={{
        height: '100%',
        color: '#ecf0f1',
        WebkitAppRegion: 'drag', // Allow dragging
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Group gap={8} h={'100%'} style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Application Icon */}
        <Image
          radius="md"
          src={unicornMenuImage}
          height="60%"
          width="60%"
          style={{ userSelect: 'none' }}
        />
        <MenuBar
          windowFocused={windowFocused}
          handleOpenFile={handleOpenFile}
        />
      </Group>

      {/* Window Controls */}
      <Group gap={0} h={'100%'} style={{ WebkitAppRegion: 'no-drag' }}>
        <AspectRatio ratio={1.3} h="100%">
          <ActionIcon
            variant="subtle"
            h="100%"
            color="gray"
            radius={0}
            // style={{
            //   cursor: 'default',
            // }}
            style={() => ({
              cursor: 'default',
              '--ai-color': windowFocused
                ? 'var(--mantine-color-gray-3)'
                : 'var(--mantine-color-gray-6)',
            })}
            onClick={() => window.electronAPI.minimizeWindow()}
          >
            {/* <IconMinus size={16} strokeWidth="1.5" /> */}
            <VscChromeMinimize />
          </ActionIcon>
        </AspectRatio>
        <AspectRatio ratio={1.3} h="100%">
          <ActionIcon
            variant="subtle"
            h="100%"
            color="gray"
            radius={0}
            // style={{
            //   cursor: 'default',
            // }}
            style={() => ({
              cursor: 'default',
              '--ai-color': windowFocused
                ? 'var(--mantine-color-gray-3)'
                : 'var(--mantine-color-gray-6)',
            })}
            onClick={() => window.electronAPI.maximizeWindow()}
          >
            {isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
          </ActionIcon>
        </AspectRatio>

        <AspectRatio ratio={1.3} h="100%">
          <ActionIcon
            variant="subtle"
            h="100%"
            color="gray"
            radius={0}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            // style={{
            //   '--ai-hover': theme.colors.red[9],
            //   cursor: 'default',
            // }}
            style={() => ({
              '--ai-color':
                windowFocused || isCloseHovered
                  ? 'var(--mantine-color-gray-3)'
                  : 'var(--mantine-color-gray-6)',
              cursor: 'default',
              '--ai-hover': 'var(--mantine-color-red-9)',
            })}
            onClick={() => window.electronAPI.closeWindow()}
          >
            <VscChromeClose />
          </ActionIcon>
        </AspectRatio>
      </Group>
    </Group>
  );
}

const DefaultView = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ height: '100%', userSelect: 'none' }}
    >
      <Image src={unicornImage} alt="Unicorn Head" w={200} fit="contain" />
      <Text
        size="lg"
        weight={500}
        mt="md"
        style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        To open a file, please click the "Open File" button in the menu bar.
      </Text>
    </Flex>
  );
};

const ReorderView = () => {
  return (
    <Text size="xl" weight={700}>
      Reorder
    </Text>
  );
};

const SettingsView = () => {
  return (
    <Text size="xl" weight={700}>
      Settings
    </Text>
  );
};

// function UnicornHead() {
//   return (
//     <Box sx={{ width: '100px', height: '100px' }}>
//       <Image src={unicornImage} alt="Unicorn Head" width={400} height={400} />
//     </Box>
//   );
// }

function App() {
  const [activeView, setActiveView] = useState('animations');
  const [fileXML, setFileXML] = useState(null);
  const [fileOpened, setFileOpened] = useState(null);

  const handleOpenFile = async () => {
    // Call the exposed Electron function to open the file dialog
    const fileXMLRead = await window.electronAPI.openFile();
    setFileXML(fileXMLRead);
    setFileOpened(true);
  };

  const handleAnimationsClick = () => {
    setActiveView('animations');
  };

  const handleReorderClick = () => {
    setActiveView('reorder');
  };

  const handleSettingsClick = () => {
    setActiveView('settings');
  };

  return (
    <AppShell
      navbar={{
        width: 55,
        padding: 'md',
        height: '100vh',
        style: { backgroundColor: 'gray' },
      }}
      header={{ height: 35 }}
      main={
        {
          // height: '100vh',
          // style: { backgroundColor: 'gray' },
        }
      }
    >
      <AppShell.Header>
        <TopBar handleOpenFile={handleOpenFile} />
      </AppShell.Header>
      <AppShell.Navbar>
        <Flex
          direction="column"
          justify="space-between"
          style={{ height: '100%' }}
        >
          <Flex direction="column">
            <Tooltip
              label="Edit Animations"
              color="gray"
              position="right"
              withArrow
            >
              <AspectRatio ratio={1}>
                <ActionIcon
                  variant="subtle"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={handleAnimationsClick}
                  color={activeView === 'animations' ? 'blue.3' : 'gray.7'}
                  radius={0}
                >
                  <IconPhoto size="60%" strokeWidth="1.5" />
                </ActionIcon>
              </AspectRatio>
            </Tooltip>

            <Tooltip
              label="Reorder Objects"
              color="gray"
              position="right"
              withArrow
            >
              <AspectRatio ratio={1}>
                <ActionIcon
                  variant="subtle"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={handleReorderClick}
                  color={activeView === 'reorder' ? 'blue.3' : 'gray.7'}
                  radius={0}
                >
                  <IconList size="60%" strokeWidth="1.5" />
                </ActionIcon>
              </AspectRatio>
            </Tooltip>
          </Flex>
          <Flex direction="column">
            <Tooltip label="Settings" color="gray" position="right" withArrow>
              <AspectRatio ratio={1}>
                <ActionIcon
                  variant="subtle"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={handleSettingsClick}
                  color={activeView === 'settings' ? 'blue.3' : 'gray.7'}
                  radius={0}
                >
                  <IconSettings size="60%" strokeWidth="1.5" />
                </ActionIcon>
              </AspectRatio>
            </Tooltip>
          </Flex>
        </Flex>
      </AppShell.Navbar>
      <AppShell.Main>
        <MainArea
          fileXML={fileXML}
          fileOpened={fileOpened}
          handleOpenFile={handleOpenFile}
        ></MainArea>
        {/* {activeView === 'animations' && <DefaultView />} */}
        {/* {activeView === 'reorder' && <ReorderView />}
        {activeView === 'settings' && <SettingsView />} */}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
