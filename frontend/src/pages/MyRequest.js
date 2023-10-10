import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useCookies} from 'react-cookie';

const useStyles = makeStyles({
  headerCell: {
    backgroundColor: 'black',
    fontWeight: 'bold',
  }
});

const getRowId = params => params.booking_id;

const badges = [
	{ name: 'primary', status: 'Pending'},
	{ name: 'info', status: 'Completed'},
	{ name: 'success', status: 'Accepted'},
	{ name: 'danger', status: 'Rejected'},
  { name: 'secondary', status: 'Cancelled'},
]

const columns = [
	{ field: 'freelancer_name', headerName: 'Freelancer Name', flex: 1, headerAlign: 'center', align: 'center'},
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

const MyRequest = () => {
  const theme = useTheme();
  const classes = useStyles();

	const [myRequest, setMyRequest] = useState([]);
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

  const onCancelBooking = async () => {

    // Get selected rows' details
    var selectedBookings = myRequest.filter((row) => selectedRows.includes(row.booking_id));

		await axios.put('http://127.0.0.1:8000/webapp/my-request/', selectedBookings, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      }
    })
    .then(response => {
			console.log('response', response)
      window.location.reload();
    })
    .catch(error => {
			console.log(error)
		});
	};

	const fetchMyRequest = async () => {
    await axios.get('http://127.0.0.1:8000/webapp/my-request', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Token ' + token['mytoken']
      },
    })
      .then(response => {
				var data = response.data
        setMyRequest(data)
			})
      .catch(error => console.log(error));
  };

  useEffect(() => {
		fetchMyRequest();
  }, []);

	useEffect(() => {
    console.log('myRequest', myRequest)
  }, [myRequest]);

  useEffect(() => {
    console.log('selectedRows', selectedRows)
  }, [selectedRows]);
	
	return (
		<>
			{ myRequest && 
				<div style={{padding: '50px', marginTop: '30px'}}>
          <Typography
            variant='h4'
            align='center'
            fontWeight={700}
            marginBottom={theme.spacing(5)}
            gutterBottom
            sx={{
                color: theme.palette.text.primary
            }}
          >
            My Request
          </Typography>
          <Typography
            variant='subtitle2'
            gutterBottom
            sx={{
              fontWeight: 400,
            }}
          >
            Tick the following checkboxes and select 'CANCEL' button to cancel your booking.
          </Typography>
          <div className='mb-4'>
            <Button
              onClick={() => {
                setAction('cancel')
                handleClickOpen()
              }}
              variant='contained'
              type='submit'
              sx={{
                marginTop: '10px',
                marginRight: '10px',
                color: theme.palette.common.white,
              }}
            >
              Cancel
            </Button>
          </div>
          <DataGrid
            style={{height: 400, width: '100%'}}
            getRowId={getRowId}
            rows={myRequest}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 15]}
            sx={{headerCell: classes.headerCell}}
            checkboxSelection
            isRowSelectable={(params) => 
              params.row.booking_status !== 'Cancelled' && params.row.booking_status !== 'Completed' && params.row.booking_status !== 'Accepted'
            }
            selectionModel={selectedRows}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectedRows(newSelectionModel);
            }}
          />
        </div>
			}
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
          <Button onClick={onCancelBooking} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
		</>
	);
};

export default MyRequest;