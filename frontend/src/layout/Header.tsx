import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha, useTheme } from '@mui/material/styles';
import logo from '../assets/logo/logo.png';
import CustomButton from '../components/CustomButton';
import NotificationIcon from '../components/NotificationIcon';
import {UserAccountIcon} from '../components/UserAccountIcon';
import MessageIcon from '../components/MessageIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface Props {
  onSidebarOpen: () => void;
}

interface UserProps {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  is_freelancer: boolean;
  profile_image: string;
  user_id: number;
}

const Header = ({ onSidebarOpen }: Props): JSX.Element => {
  const theme = useTheme();
  const [user, setUser] = useState<UserProps[]>([]); 
	const [token, setToken, removeCookie] = useCookies(['mytoken']);
  const navigate = useNavigate();
  const fetchUser = () => {
    axios.get<UserProps[]>('http://127.0.0.1:8000/webapp/user', {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' + token['mytoken']
        },
    })
        .then((response) => {
            setUser(response.data);
        })
        .catch(error => { console.log(error) });
  };

  const logout = () => {
    removeCookie('mytoken',{path:'/'});
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <AppBar
        color='transparent'
        position='sticky'
        sx={{
          border: 0,
          padding: '10px 0',
          marginBottom: '5px',
          top: 'auto',
          boxShadow: '0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <Link href='/' sx={{ textDecoration: 'none' }}>
            {/* <IconButton size='large' disabled>
              <StormIcon 
                sx={{ 
                  color: theme.palette.primary.main, 
                  height: 40, 
                  width: 40 
                }} 
              />
              <Box sx={{ display: { md: 'inline', xs: 'none' } }}>
                <Typography 
                  variant='h6' 
                  sx={{ 
                    flexGrow: 1,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    marginLeft: '10px'
                  }}
                >
                  HireMe
                </Typography>
              </Box>
            </IconButton> */}
            <img src={logo} alt='logo' width={300} height={175}></img>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: { lg: 'flex', md: 'none', xs: 'none' }
            }}
          >
          <>
          {user.map((item, i) => ( 
            <>
            <CustomButton
              href='serviceListing'
              text='Service Listing'
            />
            {item.is_freelancer?            
            <CustomButton
              href='clientRequest'
              text='Client Request' //url
            />:
            <></>
            }
            {item.is_freelancer?<></>:
            <CustomButton
              href='myRequest'
              text='My Request'
            />
            }
            {item.is_freelancer?
            <CustomButton
              href='createService'
              text='Create Service'
            />
            :<></>}
            {item.is_freelancer?
            <CustomButton
              href='myService'
              text='My Service'
            />
            :<></>}
            </>
            ))} 
          </>
            <NotificationIcon/>
            {/* <MessageIcon/> */}
            {/* <UserAccountIcon/> */}
            <>
            {
            token['mytoken']?(
            <>
            {user.map((item, i) => (
              <>
              <span> {UserAccountIcon(item.profile_image)} </span> 
              <span>{item.username}</span>
              <Box marginLeft={2}>
              <span><LogoutIcon
                onClick={() => {logout(); navigate("/"); window.location.reload();} }
              /></span>
              </Box>
              </>  // can pull from api whenever the user is login 
              ))} 
            </>):
            <Button
            type="submit"
            variant="contained"
            // endIcon={<EditIcon />}
            href="/"
            sx={{
                // marginTop: theme.spacing(10),
                // marginRight: theme.spacing(10),
                marginLeft: theme.spacing(2),
                // float: 'right',
                color: theme.palette.background.default,
                borderRadius: 2,
            }}
            >
                Login
            </Button>
            }
            </>
             

          </Box>
          <Box
            sx={{
              display: { md: 'block', lg: 'none' }
            }}
            alignItems='center'
          >
            <Button
              onClick={() => onSidebarOpen()}
              aria-label='Menu'
              variant='outlined'
              sx={{
                borderRadius: 0,
                minWidth: 'auto',
                padding: 1,
                borderColor: alpha(theme.palette.divider, 0.2)
              }}
            >
              <MenuIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;