// src/components/ContentView.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardAdminStudents from './CardAdminStudents';
import CardAdminInterlocutors from './CardAdminInterlocutors';
import CardAdminSchools from './CardAdminSchools';
import CardAdminGremios from './CardAdminGremio';
import AdminGremio from './CardAdminGremio2';

type PageKey =
  | 'estudantes'
  | 'professores'
  | 'escolas'
  | 'gremios' 

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

interface Props {
  currentPage: PageKey;
}

const pageComponents: Record<PageKey, JSX.Element> = {
  estudantes: <CardAdminStudents />,
  professores: <Typography variant="h5"><CardAdminInterlocutors /></Typography>,
  escolas: <Typography variant="h5"> <CardAdminSchools /></Typography>,
  gremios: <Typography variant="h5"><AdminGremio /></Typography>, 
};

export default function ContentView({ currentPage }: Props) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      {pageComponents[currentPage]}
    </Box>
  );
}
