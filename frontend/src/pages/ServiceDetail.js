import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { CardMedia, Typography, Button, Modal, Box, Grid, TextField, Alert, Snackbar, Link } from '@mui/material';
import MsgIcon from '@mui/icons-material/Message';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import {useCookies} from 'react-cookie';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 300, sm: 400, md: 700 },
  backgroundColor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const ServiceDetails = () => {

  var [serviceDetail, setServiceDetail] = useState();
  //const [alert, setAlert] = useState(false);
  const [serviceRemark, setServiceRemark] = useState(null);
  const [open, setOpen] = useState(false); //open book remark
  const [token, setToken] = useCookies(['mytoken']);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const { title } = useParams();
  const theme = useTheme();
  const [message, setMessage] = useState({
    status: '',
    statusText: ''
  });

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const fetchServiceDetail = () => {
    axios.get('http://127.0.0.1:8000/webapp/service-detail', {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        title: title
      }
    })
      .then(response => {
        //max display 4
        setServiceDetail(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  };

  const submitBooking = async () => {
    let data = new FormData();
    console.log(serviceRemark)
    console.log(serviceDetail.service_id)

    data.append("serviceRemark", serviceRemark)
    data.append("serviceID", serviceDetail?.service_id)

    await axios.post('http://127.0.0.1:8000/webapp/book-service/', data,{
      headers:{
        'Authorization': 'Token ' + token['mytoken'],
      }
  })
      .then(response => {
        setMessage({
          status: "success",
          statusText: "Booking remark submitted successfully."
        })
        setAlertOpen(true)
        setOpen(false);
        setServiceRemark(null);
      })
      .catch(error => {
        setMessage({
          status: 'error',
          statusText: "Failed to book service."
        })
        setAlertOpen(true)
      });

  };


  //call API to bind data to frontend
  useEffect(() => {
    fetchServiceDetail();

  }, [])

  return (
    // <div>Service Details Page {title}</div>
    <div margintop='10'>
      <CardMedia
        image={serviceDetail?.service_image}
        sx={{
          marginLeft: 35,
          marginRight: 10,
          position: 'relative',
          height: 350,
          overflow: 'hidden',
          borderRadius: 2,
          filter: 'brightness(1)',
          mt: 4,
          maxWidth: 1000,
        }}
      >
      </CardMedia>
      <div>
        <div style={{ paddingLeft: 300 }} >
          {/* <img src={item.s_image} alt="Service Image" style={{width: '100%', height: '200px', padding: '0 0 20px 0'}}></img> */}
          <div className='col-12 col-md-10'>
            <Typography
              variant='h5'
              gutterBottom
              sx={{
                paddingTop: 2,
                fontWeight: 600,
              }}
            >
              {serviceDetail?.service_title}

            </Typography>
          </div>
          {/* <Button
            component='a'
            color='primary'
            onClick={event =>  window.location.href='message'}
            variant='text'
            sx={{
              color: theme.palette.text.primary,
              fontSize: '20px',
              textTransform: 'uppercase',
              mx: -1,
              '&:active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {serviceDetail?.freelancer_firstname} {serviceDetail?.freelancer_lastname}
          </Button> */}
          {/*need to change to user account accordingly*/}
          <Link
            sx={{ fontSize: '20px' }}
            onClick={event => window.location.href = 'userAccount'}
          >{serviceDetail?.freelancer_firstname} {serviceDetail?.freelancer_lastname}</Link>
          <ContactSupportIcon
            //onClick={event => window.location.href = 'message'}
            onClick={event => navigate("/message-"+serviceDetail.freelancer_username)}
            sx={{
              color: theme.palette.text.primary,
              fontSize: '30px',
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
          >
          </ContactSupportIcon>
          <div className="row" width='100%'>
            <div className='col-12 col-md-4'>
              <Typography
                variant='h5'
                gutterBottom
                sx={{
                  alignContent: 'center',
                  paddingTop: 1,
                  //paddingRight:50,
                  fontWeight: 600,
                }}
              >
                RM {serviceDetail?.service_price}
              </Typography>
            </div>
            <div className='col-12 col-md-4'></div>
            <div className='col-12 col-md-4'>
              <Button
                sx={{
                  borderRadius: 2,
                  width: 0.4,
                  color: theme.palette.common.white,
                }}
                variant="contained"
                size="medium"
                onClick={handleOpen}
              >
                Book
              </Button>
            </div>
          </div>
          <Grid item xs={3} sm={3}>
            <Modal
              open={open}
              onClose={handleClose}
            >
              <Box sx={style}>
                <Typography
                  variant='h6'
                  fontWeight={400}
                  gutterBottom
                  sx={{
                    color: theme.palette.text.primary
                  }}>
                  Kindly add remark for the requested service.
                </Typography>
                <TextField
                  value={serviceRemark}
                  required
                  multiline
                  id='service-remark'
                  placeholder='Remark'
                  sx={{
                    width: '70%',
                    "& .MuiOutlinedInput-notchedOutline legend": { display: "none", }
                  }}
                  onChange={(e) => {
                    setServiceRemark(e.target.value)
                  }}
                />
                <Button
                  sx={{
                    borderRadius: 3,
                    marginTop: 1,
                    marginLeft: 10,
                    color: theme.palette.common.white,
                  }}
                  variant="contained"
                  size='medium'
                  onClick={submitBooking}
                >
                  Submit
                </Button>
              </Box>
            </Modal>
          </Grid>
          <div className='col-12 col-md-8'>
            <Typography
              align='justify'
              variant='h6'
              gutterBottom
              sx={{
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {serviceDetail?.service_description}
            </Typography>
          </div>
          <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity={message.status} sx={{ width: '100%' }}>
              {message.statusText}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div >
  );
};

export default ServiceDetails;