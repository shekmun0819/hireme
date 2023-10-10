import React, { useState, useEffect } from 'react';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import MessageIcon from '../components/MessageIcon';
const Notification = () => {

    const theme = useTheme();
    const [invisible, setInvisible] = useState(false);

    const [newNotification, setNewNotification] = useState([]);
	  const [token, setToken] = useCookies(['mytoken']);

    const handleBadgeVisibility = () => {
      if (newNotification.length > 0)
        setInvisible(false);
      else
        setInvisible(true);
    };

    const updateNotification = async () => {
      
      await axios.put('http://127.0.0.1:8000/webapp/notification/', newNotification, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token['mytoken']
        }
      })
      .then(response => {
        console.log('response', response)
      })
      .catch(error => {
        console.log(error)
      });
    };

    const fetchNewNotification = async () => {
      await axios.get('http://127.0.0.1:8000/webapp/new-notification', {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + token['mytoken']
        },
      })
        .then(response => {
          var data = response.data
          setNewNotification(data)
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
      fetchNewNotification()

      //fetch new notifications every 5 hour
      let interval = setInterval( async () => {
        await fetchNewNotification();
      }, 18000000);
      return () => {
        clearInterval(interval);
      };

    }, []);
  
    useEffect(() => {
      console.log('newNotification', newNotification)
      handleBadgeVisibility()
    }, [newNotification]);

    const [user_id, setUserID] = useState('')
    const [chatRooms, setRooms] = useState([]);
    const [unreadChat, setUnreadChat] = useState(0);

    useEffect(() => {
      const getUserID = async () => {
        let response = await axios
          .get("http://127.0.0.1:8000/webapp/user/", {
            headers: {
              Accept: "application/json",
              'Authorization': 'Token ' + token['mytoken']
            },
          })
         setUserID(response.data[0].user_id);
      };
  
      const getChatRooms = async () => {
        let response = await axios
          .get("http://127.0.0.1:8000/webapp/chat/", {
            headers: {
              Accept: "application/json",
              'Authorization': 'Token ' + token['mytoken']
            },
          })
          setRooms(response.data);
      };
      getUserID();
      getChatRooms();
    }, []);

    useEffect(() => {
      const countUnread = async () => {
        let arr = [];
        for (let i = 0; i < chatRooms.length; i++) {
          await axios
            .get("http://127.0.0.1:8000/webapp/message/", {
              headers: {
                Accept: "application/json",
                'Authorization': 'Token ' + token['mytoken']
              },
              params: {
                id: chatRooms[i].room_id,
              },
            })
            .then((response) => {
              var data = response.data;
              let unread = 0;
              for (let i = 0; i < data.length; i++) {
                if (data[i].is_read === false && data[i].sender_id !== user_id)
                  unread += 1;
              }
              arr[i] = unread;
            })
            .catch((error) => console.log(error));
        }
        setUnreadChat(arr.reduce((a, b) => a + b, 0));
      };
      if(chatRooms.length>0){
        countUnread();
      }
     }, [chatRooms]);

    return(
      <>
        <Badge badgeContent={newNotification.length > 0 ? newNotification.length : 0} color='secondary' invisible={invisible}
         sx={{
          "& .MuiBadge-badge": {
            right: 10,
            top: -6,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: "0 4px",
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.primary.main
          }
        }}
        >
          <NotificationsActive
            onClick={event => {
              updateNotification()
              fetchNewNotification()
              window.location.href='notification'
            }}
            sx=
            {{
              color: theme.palette.text.primary,
              fontSize:'30px',
              textTransform: 'uppercase',
              mx: 1.5,
              marginLeft: '15px',
              '&:active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Badge>
        <Badge badgeContent={unreadChat} color='secondary'
         sx={{
          "& .MuiBadge-badge": {
            right: 10,
            top: -6,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: "0 4px",
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.primary.main
          }
        }}
        >
          <MessageIcon
            onClick={event => {
              window.location.href='message'
            }}
            sx=
            {{
              color: theme.palette.text.primary,
              fontSize:'30px',
              textTransform: 'uppercase',
              mx: 1.5,
              marginLeft: '15px',
              '&:active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Badge>
      </>
    );
};
export default Notification;