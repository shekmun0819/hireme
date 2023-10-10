import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useCookies} from 'react-cookie';

const getRowId = params => params.booking_id;

const badges = [
	{ name: 'primary', status: 'Pending'},
	{ name: 'info', status: 'Completed'},
	{ name: 'success', status: 'Accepted'},
	{ name: 'danger', status: 'Rejected'},
  { name: 'secondary', status: 'Cancelled'},
]

const columns = [
	{ field: 'booking_client', headerName: 'Client Name', flex: 1, headerAlign: 'center', align: 'center', },
  { field: 'booking_remark', headerName: 'Remark', flex: 2, headerAlign: 'center', renderCell: (cellValues) => {
    return (
			<Tooltip title={cellValues.value} placement="top-start" arrow>
				<span>{cellValues.value}</span>
			</Tooltip>
    )}  
	},
  { field: 'booking_status', headerName: 'Status', flex: 1, headerAlign: 'center', align: 'center', renderCell: (cellValues) => {
		const index = badges.findIndex(badge => { return badge.status === cellValues.value; });
    return (
      <span className={`badge bg-${badges[index].name}`}>{cellValues.value}</span>
    )} 
	},
];

const ClientRequest = () => {
	const theme = useTheme();

	const [bookings, setBookings] = useState([]);
	const [byService, setByService] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [action, setAction] = useState(null);
	const [token, setToken] = useCookies(['mytoken']);

	// Confirmation Box
	const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

	const onActionBooking = async () => {
    // Get selected rows' details
    var selectedBookings = bookings.filter((booking) => selectedRows.includes(booking.booking_id));
		console.log("Selected Booking->>>", selectedBookings)
		console.log("Token", token['mytoken'])
		console.log("Action", action)
		await axios.put('http://127.0.0.1:8000/webapp/client-request/',
		{
			selected: selectedBookings,
			action: action
		},
		{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Token ' + token['mytoken']
				},
		})
		.then(response => {
		console.log('response', response)
			window.location.reload();
		})
		.catch(error => {
			console.log(error.response.data)
		});
	};

	const fetchBookings = async () => {
    await axios.get('http://127.0.0.1:8000/webapp/client-request', {
      headers: {
        'Accept': 'application/json',
				'Authorization': 'Token ' + token['mytoken']
      },
    })
		.then(response => {
			var data = response.data

			var distinctServiceID = [], tempByService = [];

			// Get each booking's service ID
			for(var i=0; i < data.length; i++){
				distinctServiceID.push(data[i].service_id)
			}
			//remove duplicate service ID
			distinctServiceID = [...new Set(distinctServiceID)]

			// Group according by service ID
			for(var j=0; j < distinctServiceID.length; j++){
				tempByService.push(data.filter(item => item.service_id == distinctServiceID[j]))
			}

			// By different service
			setByService(tempByService)

			// All bookings
			setBookings(response.data)
			
		})
		.catch(error => console.log(error));
  };

  useEffect(() => {
		fetchBookings();
  }, []);

	useEffect(() => {
    console.log('byService', byService)
  }, [byService]);

	useEffect(() => {
    console.log('selectedRows', selectedRows)
  }, [selectedRows]);

	useEffect(() => {
    console.log('bookings', bookings)
  }, [bookings]);
	
	return (
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
				View Client's Request Here!
			</Typography>
			{ byService && byService.map((booking, i) => (
				<div className='container mb-5 shadow bg-white rounded' style={{padding: '30px'}} key={booking[0].booking_id}>
						<div className='row'>
							<div className='col-12 col-md-4' style={{paddingRight: '30px'}}>
								<img src={booking[0].service_image} alt="Service Image" style={{width: '100%', height: '200px', padding: '0 0 20px 0'}}></img>
								<Typography
									variant='h6'
									gutterBottom
									sx={{
										fontWeight: 600,
									}}
								>
									{booking[0].service_title}
								</Typography>
								<Typography
									variant='subtitle1'
									gutterBottom
									sx={{
										fontWeight: 600,
									}}
								>
									RM {booking[0].service_price}
								</Typography>
								<Typography
									variant='subtitle2'
									gutterBottom
									sx={{
										fontWeight: 400,
										marginBottom: 5,
									}}
								>
									{booking[0].service_description}
								</Typography>
							</div>
							<div className='col-12 col-md-8'>
								<Typography
									variant='h6'
									gutterBottom
									sx={{
										fontWeight: 600,
									}}
								>
									Client's Request
								</Typography>
								<Typography
									variant='subtitle2'
									gutterBottom
									sx={{
										fontWeight: 400,
									}}
								>
									Tick the following checkboxes and choose an action to perform.
								</Typography>
								<div className='mb-4'>
									<Button
										onClick={() => {
											setAction('accept')
											handleClickOpen()
										}}
										variant='contained'
										type='submit'
										sx={{
											marginTop: '20px',
											marginRight: '10px',
											color: theme.palette.common.white,
										}}
									>
										Accept
									</Button>
									<Button
										onClick={() => {
											setAction('reject')
											handleClickOpen()
										}}
										variant='contained'
										type='submit'
										sx={{
											marginTop: '20px',
											marginRight: '10px',
											color: theme.palette.common.white,
										}}
									>
										Reject
									</Button>
									<Button
										onClick={() => {
											setAction('complete')
											handleClickOpen()
										}}
										variant='contained'
										type='submit'
										sx={{
											marginTop: '20px',
											color: theme.palette.common.white,
										}}
									>
										Completed
									</Button>
								</div>
								<div style={{ height: 400, width: '100%' }}>
									<DataGrid
										getRowId={getRowId}
										rows={byService[i]}
										columns={columns}
										pageSize={5}
										rowsPerPageOptions={[5, 10, 15]}
										checkboxSelection
										isRowSelectable={(params) => 
											params.row.booking_status !== 'Completed' && params.row.booking_status !== 'Cancelled'
										}
										selectionModel={selectedRows}
										onSelectionModelChange={(newSelectionModel) => {
											setSelectedRows(newSelectionModel);
										}}
									/>
								</div>
							</div>
						</div>
				</div>
			))}
			<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to {action} this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={onActionBooking} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
		</>
	);
};

export default ClientRequest;