// src/components/Header.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../auth/AuthProvider';

interface HeaderProps extends MuiAppBarProps {
  open: boolean;
  onOpen: () => void;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {

  
  shouldForwardProp: (prop) => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({ open, onOpen }: HeaderProps) {


  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed" open={open} onOpen={function (): void {
      throw new Error('Function not implemented.');
    }}>
      <Toolbar className='flex items-center justify-between'>
        <div className='flex items-center justify-start'>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onOpen}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Painel de Gestão dos Grêmios
        </Typography>

        </div>
        <Avatar
          alt="Remy Sharp"
          src={user?.picture}
          sx={{ width: 45, height: 45 }}
        />
      </Toolbar>
    </AppBar>
  );
}
