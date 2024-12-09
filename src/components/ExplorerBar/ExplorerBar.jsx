import React, { useState, useEffect } from 'react';
import { NavLink } from '@mantine/core';

function ExplorerBar({ sections, activeSection, setActiveSection }) {
  return (
    <>
      {sections.map((section) => (
        <NavLink
          key={section.key}
          label={section.label}
          active={activeSection === section.key} // Set this dynamically if needed
          onClick={() => setActiveSection(section.key)}
        />
      ))}
    </>
  );
}

export default ExplorerBar;
