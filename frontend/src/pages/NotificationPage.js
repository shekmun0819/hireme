import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import {useCookies} from 'react-cookie';
import Typography from '@mui/material/Typography';

const NotificationPage = () => {

  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);
	const [token, setToken] = useCookies(['mytoken']);

  const fetchNotification = async () => {
    await axios.get('http://127.0.0.1:8000/webapp/notification', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      },
    })
      .then(response => {
				var data = response.data
        setNotifications(data)
			})
      .catch(error => console.log(error));
  };

  useEffect(() => {
		fetchNotification();
  }, []);

  useEffect(() => {
    console.log('notifications', notifications)
  }, [notifications]);
  
  return(
    <>
      <Typography
				variant='h4'
				align='center'
				fontWeight={700}
				marginTop={theme.spacing(5)}
				marginBottom={theme.spacing(5)}
				gutterBottom
				sx={{
						color: theme.palette.text.primary
				}}
			>
				Notifications
			</Typography>
      <div style={{ margin: 'auto', width: '50%' }}>
        { notifications && notifications.map((notification, i) => (
            <div className='row d-flex justify-content-center align-items-center mb-5 shadow bg-white rounded' key={i} style={{ padding: '20px' }}>
              <div className='col-md-2 col-12'>
                <NotificationsActive
                  sx=
                  {{
                    color: theme.palette.text.primary,
                    fontSize:'30px',
                    mx: 1.5,
                    marginLeft: '15px'
                  }}
                />
              </div>
              <div className='col-md-5 col-12'>
                <Typography
                  variant="subtitle1"
                >
                  {notification.message}
                </Typography>
              </div>
              <div className='col-md-5 col-12'>
                <Typography
                  variant="subtitle2"
                  color="#303F9F"
                >
                  <>
                    {new Date(notification.created_date).toUTCString()}
                  </>
                </Typography>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default NotificationPage;