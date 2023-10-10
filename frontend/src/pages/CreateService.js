import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FileUploader } from "react-drag-drop-files";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const fileTypes = ["JPG", "PNG"];

const CreateService = () => {

  const theme = useTheme();
	//const navigate = useNavigate();

	// Confirmation Box
	const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const handleOpenConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const handleCloseConfirmBox = () => {
    setOpenConfirmBox(false);
  };

	const [open, setOpen] = useState(false);
	const [name, setName] = useState(null);
	const [description, setDescription] = useState(null);
	const [price, setPrice] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [message, setMessage] = useState({
		status: 'info',
		statusText: ''
	});
	const [token, setToken] = useCookies(['mytoken']);

	const handleChange = (file) => {
    setUploadedFile(file);
  };

	const onCreateService = async () => {
		let data = new FormData();
		data.append("serviceName", name)
		data.append("serviceDescription", description)
		data.append("servicePrice", price)
		data.append("serviceImage", uploadedFile)

		await axios.post('http://127.0.0.1:8000/webapp/create-service/', data, { //API need to change to services
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Token ' + token['mytoken']
		}
	})
    .then(response => {
			setMessage({
				status: 'success',
				statusText: "Service is successfully created."
			})
			handleCloseConfirmBox()
			setOpen(true)
    })
    .catch(error => {
			setMessage({
				status: 'error',
				statusText: "Failed to create service."
			})
			handleCloseConfirmBox()
			setOpen(true)
			console.error(error.response.data); 
		});
	};

	const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  return(
		<>
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
				Let's Describe Your Service Here!
			</Typography>
			<Grid container justifyContent='center' marginBottom={4}>
				<Grid item>
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
						required
						multiline
						autoFocus
						id='service-name'
						placeholder='Give a name to your service ...'
						sx={{
							width: { xs: 400, md: 500 },
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
						required
						multiline
						rows={6}
						id='service-description'
						placeholder='Describe your service here ...'
						sx={{
							width: { xs: 400, md: 500 },
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
						required
						id='service-price'
						placeholder='Eg: 230.50'
						sx={{
							width: { xs: 400, md: 500 },
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
					<Button
						disabled={message.status === "success" ? true : false}
						variant='contained'
						type='submit'
						onClick={() => {
							if (name === null || name === '' || description === null || description === '' || price === null || price === '' || uploadedFile === null || uploadedFile === '')
							{
								setMessage({
									status: 'error',
									statusText: "You are required to fill in all the details."
								})
								setOpen(true)
							}
							else {
								handleOpenConfirmBox()
							}
						}}
						sx={{
							marginTop: '20px',
							float: 'right',
							color: theme.palette.common.white,
						}}
					>
						Create
					</Button>
				</Grid>
			</Grid>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={message.status} sx={{width: '100%'}}>
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
            Are you sure to create this service?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={onCreateService} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
		</>
  );
};

export default CreateService;