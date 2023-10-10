import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import StormIcon from '@mui/icons-material/Storm';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/logo/logo.png';
import CustomButton from '../components/CustomButton';

interface Props {
  onClose: () => void;
  open: boolean;
}

const Sidebar = ({ open, onClose }: Props): JSX.Element => {
  const theme = useTheme();
  
  return (
    <>
      <Drawer
        anchor='left'
        onClose={() => onClose()}
        open={open}
        variant='temporary'
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            width: 256
          }
        }}
      >
        <Box height='100%'>
          <Box width={1}>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <IconButton size='large' disabled>
              <img src={logo} alt='logo' width={180} height={105}></img>
              </IconButton>
            </Link>
          </Box>
          <Box padding={2}>
            <Box paddingY={2}>
              <CustomButton 
                href='serviceListing'
                text='Service Listing'
              />
              <Box paddingY={1}>
                <CustomButton 
                  href='clientRequest'
                  text='Client Request'
                />
              </Box>
              <Box paddingY={1}>
                <CustomButton 
                  href='myRequest'
                  text='My Request'
                />
              </Box>
              <Box paddingY={1}>
                <CustomButton 
                  href='createService'
                  text='Create Service'
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;