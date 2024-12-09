import React, { useState, useEffect } from 'react';
import { Text, Flex, Image } from '@mantine/core';
import unicornImage from '../assets/unicorn1.png';

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

export default DefaultView;
