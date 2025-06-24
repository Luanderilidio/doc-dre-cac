// src/MiniDrawer.tsx
import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material'; 
import Header from '../components/GremioAdmin/Header';
import Sidebar from '../components/GremioAdmin/Sidebar';
import ContentView from '../components/GremioAdmin/ContentView';
type PageKey =
  | 'inbox'
  | 'starred'
  | 'sendEmail'
  | 'drafts'
  | 'allMail'
  | 'trash'
  | 'spam';

export default function GremioAdmin() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<PageKey>('inbox');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} onOpen={() => setOpen(true)} />
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        direction={theme.direction}
      />
      <ContentView currentPage={currentPage} />
    </Box>
  );
}
