import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FileUploader } from "react-drag-drop-files";
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useCookies} from 'react-cookie';

const fileTypes = ["JPG", "PNG"];

const MyService = () => {
  const theme = useTheme();

  // Confirmation Box
	const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const handleOpenConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const handleCloseConfirmBox = () => {
    setOpenConfirmBox(false);
  };

  const [action, setAction] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState(null);
	const [description, setDescription] = useState(null);
	const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [message, setMessage] = useState({
		status: 'info',
		statusText: ''
	});
  const [token, setToken] = useCookies(['mytoken']);

  const handleChange = (file) => {
    setUploadedFile(file);
  };

  const [myServices, setMyServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const fetchMyServices = async () => {
    await axios.get('http://127.0.0.1:8000/webapp/my-service/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      },
    })
		.then(response => {
			setMyServices(response.data)
		})
		.catch(error => console.log(error));
  };

  const onUpdateService = async () => {
		let data = new FormData();
		data.append("serviceName", name)
		data.append("serviceDescription", description)
		data.append("servicePrice", price)
		data.append("serviceImage", uploadedFile)
		data.append("serviceID", selectedService) // use serviceID variable

		await axios.put('http://127.0.0.1:8000/webapp/my-service/', data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      }
    })
    .then(response => {
			setMessage({
				status: 'success',
				statusText: "Service is successfully updated."
			})
      handleCloseConfirmBox()
      handleClose()
      window.location.reload()
    })
    .catch(error => {
			setMessage({
				status: 'error',
				statusText: "Failed to update service."
			})
      handleCloseConfirmBox()
      handleClose()
      setOpenSnackbar(true)
		});
	};

  const onDeleteService = async () => {
		await axios.delete('http://127.0.0.1:8000/webapp/my-service/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      },
      params: {
				id: selectedService
			}
    })
    .then(response => {
			setMessage({
				status: 'success',
				statusText: "Service is successfully deleted."
			})
      window.location.reload()
    })
    .catch(error => {
			setMessage({
				status: 'error',
				statusText: "Failed to delete service."
			})
      setOpenSnackbar(true)
		});
	};

  useEffect(() => {
    fetchMyServices();
  }, []);

  useEffect(() => {
    console.log('myServices', myServices)
  }, [myServices]);

  useEffect(() => {
    console.log('selectedService', selectedService)
  }, [selectedService]);

  return (
    <div id='myServices'>
      <Box
        sx={{
          pt: 5,
          pb: 10,
          px: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {<Box marginBottom={4}>
          <Typography
            variant='h5'
            align='center'
            fontWeight={700}
            marginTop={theme.spacing(1)}
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              textTransform: 'uppercase',
            }}
          >
            My Services
          </Typography>
          <Typography
            variant='subtitle1'
            align='center'
            marginTop={theme.spacing(1)}
            gutterBottom
            color={theme.palette.text.secondary}
          >
            Here are a list of created services.
          </Typography>
        </Box>}
        <Container>
          <Grid container spacing={3}>
            {myServices && myServices.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box
                  onClick={ () => {
                    handleOpen()
                    setSelectedService(item.service_id)
                    setName(item.service_title)
                    setDescription(item.service_description)
                    setPrice(item.service_price)
                    setImage(item.service_image)
                  }}
                  component={Card}
                  padding={3}
                  width={1}
                  height={0.8}
                  bgcolor={theme.palette.background.paper}
                  sx={{
                    '&:hover': {
                      //bgcolor: theme.palette.background.default,
                      bgcolor: "#C5CAE9",
                      //color: theme.palette.common.white,
                      color: "#212121",
                    }
                  }}
                >
                  <Box display='flex' flexDirection='column'>
                    <Typography
                      variant='h6'
                      noWrap
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {item.service_title}
                    </Typography>
                    <Typography
                      color='inherit'
                      noWrap
                    >
                      {item.service_description}
                    </Typography>
                  </Box>
                  <Box display='block' width={1} height={0.8}>
                    <Card
                      sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'none',
                        bgcolor: 'transparent',
                        backgroundImage: 'none',
                      }}
                    >
                      <CardMedia
                        title=''
                        image={item.service_image}
                        sx={{
                          position: 'relative',
                          height: 320,
                          overflow: 'hidden',
                          borderRadius: 2,
                          filter: 'brightness(1)',
                          mt: 4
                        }}
                      ></CardMedia>
                    </Card>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent style={{marginBottom: '20px'}}>
          <Typography
            variant='h4'
            align='center'
            fontWeight={700}
            marginTop={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Edit Service Details
          </Typography>
          <Typography
            variant='subtitle1'
            fontWeight={700}
            marginTop={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Service Name
          </Typography>
          <TextField
            value={name}
            required
            multiline
            autoFocus
            id='service-name'
            placeholder='Give a name to your service ...'
            sx={{
              width: { xs: 320, sm: 400, md: 500 },
              "& .MuiOutlinedInput-notchedOutline legend": { display: "none", }
            }}
            onChange={ (e) => {
              setName(e.target.value)
            }}
          />
          <Typography
            variant='subtitle1'
            fontWeight={700}
            marginTop={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Service Description
          </Typography>
          <TextField
            value={description}
            required
            multiline
            rows={6}
            id='service-description'
            placeholder='Describe your service here ...'
            sx={{
              width: { xs: 320, sm: 400, md: 500 },
              "& .MuiOutlinedInput-notchedOutline legend": { display: "none", }
            }}
            onChange={ (e) => {
              setDescription(e.target.value)
            }}
          />
          <Typography
            variant='subtitle1'
            fontWeight={700}
            marginTop={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Service Price (RM)
          </Typography>
          <TextField
            type='number'
            value={price}
            required
            id='service-price'
            placeholder='Eg: 230.50'
            sx={{
              width: { xs: 320, sm: 400, md: 500 },
              "& .MuiOutlinedInput-notchedOutline legend": { display: "none", }
            }}
            onChange={ (e) => {
              setPrice(e.target.value)
            }}
          />
          <Typography
            variant='subtitle1'
            fontWeight={700}
            marginTop={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Service Image
          </Typography>
          <FileUploader 
            handleChange={handleChange} 
            name='file' 
            types={fileTypes}
            label='Browse to choose a file or Drag and drop'
          />
          <Typography
            variant='subtitle1'
            fontWeight={400}
            fontSize={14}
            marginTop={theme.spacing(1)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            {uploadedFile && `Chosen service image: ${uploadedFile.name}`}
          </Typography>
          <Typography
            variant='subtitle1'
            fontWeight={400}
            fontSize={14}
            marginTop={theme.spacing(1)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            Current service image:
          </Typography>
          { image && 
            <img src={image} alt="Service Image" style={{width: '100%', height: '200px'}}></img>
          }
          <div>
            <Button
              variant='contained'
              type='submit'
              onClick={() => {
                if (name === null || name === '' || description === null || description === '' || price === null || price === '')
                {
                  setMessage({
                    status: 'error',
                    statusText: "You are required to fill in all the details."
                  })
                  setOpenSnackbar(true)
                }
                else {
                  setAction('update')
                  handleOpenConfirmBox()
                }
              }}
              sx={{
                marginTop: '20px',
                float: 'left',
                color: theme.palette.common.white,
              }}
            >
              Update
            </Button>
            <Button
              variant='contained'
              type='submit'
              onClick={() => {
                setAction('delete')
                handleOpenConfirmBox()
              }}
              sx={{
                marginTop: '20px',
                marginLeft: '10px',
                float: 'left',
                color: theme.palette.common.white,
                backgroundColor: 'red'
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={message.status} sx={{width: '100%'}}>
          {message.statusText}
        </Alert>
      </Snackbar>
      <Dialog
        open={openConfirmBox}
        onClose={handleCloseConfirmBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to {action} this service?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={action === 'update' ? onUpdateService : onDeleteService} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default MyService;