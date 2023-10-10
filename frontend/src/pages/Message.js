import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { Autocomplete, Badge, Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { format } from "timeago.js";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const Item2 = styled(Paper)(({ theme }) => ({
  backgroundColor: "#C5CAE9",
  ...theme.typography.body2,
  left: 0,
  padding: theme.spacing(1),
  textAlign: "left",
  color: "black",
  width: "fit-content",
  alignSelf: "start",
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  ...theme.typography.body2,
  right: 0,
  padding: theme.spacing(1),
  textAlign: "right",
  color: "white",
  width: "fit-content",
  alignSelf: "end",
}));

const Message = () => {
  const [chatRooms, setRooms] = useState([]);
  const [chatMsgs, setMsgs] = useState([]);
  const theme = useTheme();
  const [dense, setDense] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0); //current chatting user
  const [inputMsgText, setInputMsgText] = React.useState("");
  //const user_id = 62;
  const [user_id, setUserID] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [arr, setArr] = useState([]);
  const [chatUser, setChatUser] = useState("");
  const [token, setToken] = useCookies(["mytoken"]);
  const [searchUser, setSearchUser] = useState("");
  const { name } = useParams();

  useEffect(() => {
    //console.log(arr);
  }, [arr]);

  useEffect(() => {
    const getUserID = async () => {
      let response = await axios.get("http://127.0.0.1:8000/webapp/user/", {
        headers: {
          Accept: "application/json",
          Authorization: "Token " + token["mytoken"],
        },
      });
      setUserID(response.data[0].user_id);
    };

    const getChatRooms = async () => {
      let response = await axios.get("http://127.0.0.1:8000/webapp/chat/", {
        headers: {
          Accept: "application/json",
          Authorization: "Token " + token["mytoken"],
        },
      });
      setRooms(response.data);
    };
    const getAllUsers = async () => {
      let response = await axios.get("http://127.0.0.1:8000/webapp/chatuser/", {
        headers: {
          Accept: "application/json",
          Authorization: "Token " + token["mytoken"],
        },
      });
      setAllUsers(response.data);
    };
    getUserID();
    getChatRooms();
    getAllUsers();
  }, []);

  useEffect(() => {
    const countUnread = async () => {
      let arr = [];
      for (let i = 0; i < chatRooms.length; i++) {
        await axios
          .get("http://127.0.0.1:8000/webapp/message/", {
            headers: {
              Accept: "application/json",
              Authorization: "Token " + token["mytoken"],
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
      setArr(arr);
    };

    if (chatRooms.length > 0) countUnread();
  }, [chatRooms]);

  useEffect(() => {
    const onMsgRead = async () => {
      let data = new FormData();
      data.append("chat_id", selectedIndex);
      data.append("user_id", user_id);

      await axios
        .put("http://127.0.0.1:8000/webapp/message/", data, {
          headers: {
            Authorization: "Token " + token["mytoken"],
          },
        })
        .then((response) => {
          console.log("Chat messages read.");
        })
        .catch((error) => console.log(error));
    };

    const getChatMsgs = async () => {
      await axios
        .get("http://127.0.0.1:8000/webapp/message/", {
          headers: {
            Accept: "application/json",
            Authorization: "Token " + token["mytoken"],
          },
          params: {
            id: selectedIndex,
          },
        })
        .then((response) => {
          var data = response.data;
          setMsgs(response.data);
        })
        .catch((error) => console.log(error));
    };
    if (selectedIndex > 0) {
      onMsgRead();
      getChatMsgs();
    }
  }, [selectedIndex]);

  const handleListItemClick = (event, index, name) => {
    setSelectedIndex(index);
    setChatUser(name);
  };

  const handleSearchChatUser = (value) => {
    const createChatRoom = async (value) => {
      let data = new FormData();
      data.append("receiver_name", value);

      let response = await axios.post(
        "http://127.0.0.1:8000/webapp/chat/",
        data,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Token " + token["mytoken"],
          },
        }
      );
      chatRooms.push(response.data);
      console.log("after added new room", chatRooms);
      setSelectedIndex(response.data.room_id);
    };
    //window.location.reload();
    if (!value) {
      setChatUser("Tap a chat to start conversation...");
      setMsgs([]);
      window.location.reload();
    } else {
      setChatUser(value);
      let found = false;
      for (let i = 0; i < chatRooms.length; i++) {
        if (chatRooms[i].receiver_name === value) {
          setSelectedIndex(chatRooms[i].room_id);
          found = true;
          break;
        }
      }
      if (!found) {
        createChatRoom(value);
        window.location.reload();
        setSelectedIndex(chatRooms[chatRooms.length - 1].room_id);
      }
    }

  };

  const handleSendMessage = async (e) => {
    console.log("send button clicked");
    const onCreateMsg = async () => {
      let data = new FormData();
      data.append("chat_id", selectedIndex);
      data.append("sender_id", user_id);
      //data.append("attachment", uploadedFile?uploadedFile:null)
      //console.log('messagesent', inputMsgText);
      data.append("text", inputMsgText);

      await axios
        .post("http://127.0.0.1:8000/webapp/message/", data, {
          headers: {
            Authorization: "Token " + token["mytoken"],
          },
        })
        .then((response) => {
          setMsgs([...chatMsgs, response.data]);
        })
        .catch((error) => console.log(error));
    };

    onCreateMsg();
    setInputMsgText("");
    document.getElementById("chat-textfield").value = "";
  };

  return (
    <>
      <Grid container spacing={2} marginTop={-0.5}>
        <Grid
          item
          xs={3}
          height={window.innerHeight - 185}
          backgroundColor='"#FBFBFB"'
        >
          <Grid container direction={"row"}>
            <Typography
              variant="h5"
              fontWeight={500}
              marginLeft={theme.spacing(1)}
              marginTop={theme.spacing(3)}
              marginBottom={theme.spacing(3)}
              gutterBottom={true}
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              My Chats
            </Typography>
            <Autocomplete
              value={searchUser}
              onChange={(event, value) => handleSearchChatUser(value)}
              disablePortal
              id="combo-box-demo"
              options={allUsers.map((value, i) => value.username)}
              sx={{ width: "90%" }}
              renderInput={(params) => (
                <TextField {...params} label="Search user" />
              )}
            />
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box>
                <List
                  dense={dense}
                  sx={{ overflow: "auto", maxHeight: window.innerHeight - 135 }}
                >
                  {chatRooms.map((value, i) => (
                    <ListItemButton
                      key={i}
                      selected={selectedIndex === value.room_id}
                      onClick={(event) =>
                        handleListItemClick(
                          event,
                          value.room_id,
                          value.receiver_name
                        )
                      }
                      sx={{
                        "&:hover": {
                          backgroundColor: "#C5CAE9",
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <ListItemText
                        secondaryTypographyProps={{
                          margin: 1,
                          sx: {
                            whitespace: "noWrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                          color: theme.palette.text.secondary,
                        }}
                        primary={value.receiver_name}
                      />

                      {arr[i] > 0 ? (
                        <ListItemText
                          key={i}
                          primaryTypographyProps={{
                            variant: "caption",
                            textAlign: "right",
                          }}
                          primary={
                            <Badge
                              key={i}
                              badgeContent={arr[i]}
                              sx={{
                                "& .MuiBadge-badge": {
                                  right: 10,
                                  top: -6,
                                  border: `2px solid ${theme.palette.background.paper}`,
                                  padding: "0 4px",

                                  color: theme.palette.background.paper,
                                  backgroundColor: theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                        />
                      ) : null}
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem width={2} />
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2} marginTop={1} marginBottom={1}>
            <Grid item>
              <Typography variant="h6">
                {selectedIndex
                  ? chatUser
                  : "Tap a chat to start conversation..."}
              </Typography>
            </Grid>
          </Grid>
          <Divider flexItem />
          <Stack
            direction="column"
            sx={{
              overflowY: "scroll",
              maxHeight: window.innerHeight - 365,
              marginTop: 1,
            }}
          >
            {chatMsgs.map((value, i) =>
              value.sender_id === user_id ? (
                <Item key={i}>
                  <div>
                    <div>{value.text}</div>
                    <div>
                      <Typography variant="caption">
                        {format(value.createdDateTime)}
                      </Typography>
                    </div>
                  </div>
                </Item>
              ) : (
                <Item2 key={i}>
                  <div>
                    <div>{value.text}</div>
                    <div>
                      <Typography variant="caption">
                        {format(value.createdDateTime)}
                      </Typography>
                    </div>
                  </div>
                </Item2>
              )
            )}
          </Stack>
          {selectedIndex ? (
            <Grid item xs={9}>
              <Grid
                container
                spacing={0}
                justifyContent="flex-start"
                sx={{
                  bottom: 15,
                  position: "fixed",
                  padding: 0,
                }}
              >
                <Grid item xs={9}>
                  <TextField
                    id="chat-textfield"
                    autoComplete="off"
                    placeholder="Send a message ..."
                    sx={{
                      width: "90%",
                      "& .MuiOutlinedInput-notchedOutline legend": { display: "none", }
                    }}
                    autoFocus
                    onChange={(e) => {
                      setInputMsgText(e.target.value);
                    }}
                  />

                  <Fab
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      handleSendMessage(e.target.value);
                    }}
                    sx={{
                      left: 10,
                      right: 10,
                      color: theme.palette.common.white,
                    }}
                  >
                    <SendIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
