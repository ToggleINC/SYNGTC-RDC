import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Gavel as GavelIcon,
  Map as MapIcon,
  Notifications as NotificationsIcon,
  ExitToApp as ExitToAppIcon,
  ArrowForward as ArrowForwardIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;
const collapsedWidth = 80;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
    { text: 'Criminels', icon: <PersonIcon />, path: '/criminels' },
    { text: 'Cas', icon: <GavelIcon />, path: '/cas' },
    { text: 'Cartographie', icon: <MapIcon />, path: '/carte' },
    { text: 'Alertes', icon: <NotificationsIcon />, path: '/alertes' },
    ...(user?.role && ['admin_pnc', 'admin_anr', 'admin_ministere'].includes(user.role)
      ? [
          { text: 'Administration', icon: <AdminPanelSettingsIcon />, path: '/admin' },
          { text: 'Backups', icon: <BackupIcon />, path: '/backups' },
        ]
      : []),
    { text: 'Mon Profil', icon: <SettingsIcon />, path: '/profil' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', String(newCollapsed));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin_ministere: 'Admin National',
      admin_pnc: 'Admin PNC',
      admin_anr: 'Admin ANR',
      superviseur: 'Superviseur',
      agent: 'Agent',
    };
    return roleMap[role] || role;
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        color: '#2d3436',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      {/* Header avec Logo */}
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #e0e0e0', position: 'relative' }}>
        <IconButton
          onClick={handleCollapseToggle}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#636e72',
            '&:hover': {
              bgcolor: '#f5f6fa',
            },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {!collapsed && (
          <>
            <Box
              sx={{
                width: 70,
                height: 70,
                mx: 'auto',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/logo-ministere.png"
                alt="Logo Ministère"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#2d3436', fontSize: '1.1rem' }}>
              SYNGTC-RDC
            </Typography>
            <Typography variant="caption" sx={{ color: '#636e72', fontSize: '0.7rem', lineHeight: 1.3, display: 'block', mb: 0.5 }}>
              Système National de Gestion et de Traçabilité des Criminels
            </Typography>
            <Typography variant="caption" sx={{ color: '#636e72', fontSize: '0.65rem', lineHeight: 1.3 }}>
              Ministère de l'Intérieur, Sécurité, Décentralisation et Affaires Coutumières
            </Typography>
          </>
        )}
        {collapsed && (
          <Box
            sx={{
              width: 50,
              height: 50,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/logo-ministere.png"
              alt="Logo Ministère"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
      </Box>

      {/* User Profile Section */}
      {!collapsed && (
        <Box
          sx={{
            mx: 2,
            mt: 2,
            mb: 2,
            p: 1.5,
            bgcolor: '#f5f6fa',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#00b894',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                mr: 1.5,
              }}
            >
              {user?.nom?.charAt(0)}
              {user?.prenom?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3436', fontSize: '0.85rem' }}>
                {user?.nom} {user?.prenom}
              </Typography>
              <Typography variant="caption" sx={{ color: '#636e72', fontSize: '0.7rem', display: 'block' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getRoleLabel(user?.role || '')}
            size="small"
            sx={{
              bgcolor: '#00b894',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.65rem',
              height: 18,
            }}
          />
        </Box>
      )}
      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#00b894',
              color: '#ffffff',
              fontWeight: 700,
            }}
          >
            {user?.nom?.charAt(0)}
            {user?.prenom?.charAt(0)}
          </Avatar>
        </Box>
      )}

      {/* Navigation Menu - Scrollable */}
      <List
        sx={{
          flex: 1,
          px: 1,
          py: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f5f6fa',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#b2bec3',
            borderRadius: '3px',
            '&:hover': {
              background: '#636e72',
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&.Mui-selected': {
                  bgcolor: '#00b894',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#00a085',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                },
                '&:hover': {
                  bgcolor: '#f5f6fa',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#ffffff' : '#636e72',
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? '#ffffff' : '#2d3436',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', flexShrink: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogout}
          sx={{
            bgcolor: '#d32f2f',
            color: '#ffffff',
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            '&:hover': {
              bgcolor: '#c62828',
            },
            minWidth: collapsed ? 0 : 'auto',
            px: collapsed ? 1 : 2,
          }}
          startIcon={!collapsed ? <ExitToAppIcon /> : undefined}
          endIcon={!collapsed ? <ArrowForwardIcon /> : undefined}
        >
          {collapsed ? <ExitToAppIcon /> : 'Déconnexion'}
        </Button>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid #e0e0e0', bgcolor: '#f5f6fa', flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: '#636e72', fontSize: '0.7rem' }}>
            Version 1.0.0
          </Typography>
          <Typography variant="caption" sx={{ color: '#636e72', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
            © 2025 MISDAC - RD Congo
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Menu Button */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` },
          ml: { sm: `${collapsed ? collapsedWidth : drawerWidth}px` },
          bgcolor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: '#2d3436' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#2d3436' }}>
            SYNGTC-RDC
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#ffffff',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? collapsedWidth : drawerWidth,
              bgcolor: '#ffffff',
              borderRight: '1px solid #e0e0e0',
              transition: 'width 0.3s ease',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` },
          bgcolor: '#f5f6fa',
          minHeight: '100vh',
          mt: { xs: 8, sm: 0 },
          transition: 'width 0.3s ease, margin 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

