import React from 'react';
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const drawerWidth = 240;

// Tipos de páginas
export type PageKey =
  | 'estudantes'
  | 'professores'
  | 'escolas'
  | 'gremios' 

// Props do componente
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setCurrentPage: (page: PageKey) => void;
  currentPage: PageKey;
  direction: 'ltr' | 'rtl';
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open
    ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
}));

const mainMenu: { key: PageKey; label: string; icon: string }[] = [
  { key: 'estudantes', label: 'Estudantes', icon: '📥' },
  { key: 'professores', label: 'Professores', icon: '⭐' },
  { key: 'escolas', label: 'Escolas', icon: '📧' },
  { key: 'gremios', label: 'Gremios', icon: '📝' },
];

// const secondaryMenu: typeof mainMenu = [
//   { key: 'allMail', label: 'All Mail', icon: '📬' },
//   { key: 'trash', label: 'Trash', icon: '🗑️' },
//   { key: 'spam', label: 'Spam', icon: '🚫' },
// ];

export default function Sidebar({
  open,
  onClose,
  setCurrentPage,
  currentPage,
  direction,
}: SidebarProps) {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={onClose}>
          {direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>

      <Divider />
      <List>
        {mainMenu.map(({ key, label, icon }) => (
          <ListItem key={key} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={currentPage === key}
              onClick={() => setCurrentPage(key)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <span>{icon}</span>
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      {/* <List>
        {secondaryMenu.map(({ key, label, icon }) => (
          <ListItem key={key} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={currentPage === key}
              onClick={() => setCurrentPage(key)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <span>{icon}</span>
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Drawer>
  );
}
