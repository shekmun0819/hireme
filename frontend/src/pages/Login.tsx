import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, CardActions, CardContent, Chip, Divider, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, OutlinedInput, Paper, Rating, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/system';
import { Grid } from '@mui/material';   
import { Box } from '@mui/system';
import { Card } from '@mui/material';
import { Button } from '@mui/material'; 
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import KeyIcon from '@mui/icons-material/Key';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = (): JSX.Element => {
    const theme = useTheme();
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = React.useState(false);
	const [token, setToken] = useCookies(['mytoken']);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
  
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
	  event.preventDefault();
	};

	const onLogin = () => {
		let data = new FormData();
		data.append('username', username)
		data.append('password', password)

        axios.post('http://127.0.0.1:8000/webapp/auth/', data)
            .then((response) => {
                setToken('mytoken',response.data.token)
            })
            .catch(error => { console.log(error) });
		
	}

	const toSignUp = ()	=> {
		navigate('/signup')
	}
	
	useEffect(() => {
		if (token['mytoken']) {
			navigate('/home')
			window.location.reload()
		}
	}, [token])
        
    return(
		<>
			<Container>
				<Grid container justifyContent='center' marginTop={10} marginBottom={15}>
					<Box
						marginTop={theme.spacing(5)}
						component={Card}
						padding={10}
						width="60%"
						height="100%"
						// maxWidth={1200}
						// maxHeight={400}
						borderRadius={10}
						boxShadow={5}
						bgcolor={theme.palette.background.paper}
					>
						<Typography
							variant='h4'
							align='center'
							fontWeight={700}
							// marginTop={theme.spacing(5)}
							marginBottom={theme.spacing(5)}
							gutterBottom
							sx={{
									color: theme.palette.text.primary
							}}
						>
							Log In to HireMe
						</Typography>
						<Grid container justifyContent='center' marginBottom={4}>
							<Grid item>
								<Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(5)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Username
								</Typography>
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									{/* <TextField
										required
										autoFocus
										id='username'
										placeholder='Username'

										sx={{
											width: { xs: 400, md: 500 },
											"& .MuiOutlinedInput-notchedOutline legend": { display: "none", }

										}}
										onChange={ (e) => {
											setUsername(e.target.value)
										}}
									/> */}
									<InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
										<OutlinedInput
										id="outlined-adornment-username"
										onChange={ (e) => {
											setUsername(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<PermIdentityIcon />
										</InputAdornment>
										}
										label="Username"
									/>
								</FormControl>
								<Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(5)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Password
								</Typography>
								{/* <TextField
									required
									autoFocus
									id='password'
									placeholder='Password'

									sx={{
										width: { xs: 400, md: 500 },
										"& .MuiOutlinedInput-notchedOutline legend": { display: "none", }

									}}
									onChange={ (e) => {
										setPassword(e.target.value)
									}}
								/> */}
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
									<OutlinedInput
										id="outlined-adornment-password"
										type={showPassword ? 'text' : 'password'}
										onChange={ (e) => {
											setPassword(e.target.value)
										}}
										startAdornment={
											<InputAdornment position="start">
												<KeyIcon />
											</InputAdornment>
										}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
												>
												{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										}
										label="Password"
									/>
								</FormControl>
								<Box textAlign='center'>
									<Button
										// disabled={message.status === "success" ? true : false}
										variant='contained'
										type='submit'
										onClick={onLogin}
										sx={{
											width: 150,
											marginTop: theme.spacing(10),
											marginBottom: theme.spacing(8),
											// float: 'right',
											color: theme.palette.common.white,
											borderRadius:10,

										}}
									>
										Log In
									</Button>
								</Box>
								<Divider>
									<Typography
										variant='subtitle1'
										align='center'
										fontWeight={300}
										marginTop={theme.spacing(5)}
										marginBottom={theme.spacing(5)}
										gutterBottom
										sx={{
												color: theme.palette.text.primary
										}}
									>
										Don't have an HireMe account?
									</Typography>
								</Divider>
								<Box textAlign='center'>
									<Button
										// disabled={message.status === "success" ? true : false}
										variant='outlined'
										type='submit'
										onClick={toSignUp}
										sx={{
											width: 150,
											borderRadius:10,

										}}
									>
										Sign Up
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Container>
		</>
    );
}

export default Login;