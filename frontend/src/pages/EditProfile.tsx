import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, CardActions, CardContent, Chip, Divider, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, OutlinedInput, Paper, Radio, RadioGroup, Rating, Stack, TextField, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/system';
import { Grid } from '@mui/material';   
import { Box } from '@mui/system';
import { Card } from '@mui/material';
import { Button } from '@mui/material'; 
import axios from 'axios';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import KeyIcon from '@mui/icons-material/Key';
import {useCookies} from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { FileUploader } from 'react-drag-drop-files';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const fileTypes = ["JPG", "PNG"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

interface FreelancerProfileProps {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    is_freelancer: boolean;
    profile_image: string;
    linkedin_url: string;
    facebook_url: string;
    github_url: string;
    skillset: string;
    portfolio: string;
    user_id: number;
}

const skills = [
	'Software Development',
	'Data Analytics',
	'Web Development',
	'Digital Marketing',
	'Graphic Design',
	'Mobile Development',
	'Game Development',
	'Copywriting',
	'Security and Networking',
	'Coaching and Mentoring',
  ];

function getStyles(skill: string, skillset: readonly string[], theme: Theme) {
return {
	fontWeight:
	skillset.indexOf(skill) === -1
		? theme.typography.fontWeightRegular
		: theme.typography.fontWeightMedium,
};
}

const EditProfile = (): JSX.Element => {
    const theme = useTheme();
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = React.useState(false);
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [contact, setContact] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File>();
    const [profile_image, setProfileImage] = useState("");
	const [isFreelancer, setIsFreelancer] = useState("");
	const [skillset, setSkillset] = useState<string[]>([]);
	const [linkedin_url, setLinkedInURL] = useState("");
	const [github_url, setGithubURL] = useState("");
	const [facebook_url, setFacebookURL] = useState("");
    const [user, setUser] = useState<UserProps[]>([]);
    const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfileProps[]>([]);
    const fetchFreelancerProfile = () => {
        
        axios.get<FreelancerProfileProps[]>('http://127.0.0.1:8000/webapp/freelancer', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + token['mytoken']
            },
        })
            .then((response) => {
                setFreelancerProfile(response.data);
            })
            .catch(error => { console.log(error) });
    };

    const sleep = (m: number | undefined) => new Promise(r => setTimeout(r, m))
    
	const [token, setToken] = useCookies(['mytoken']);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
  
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
	  event.preventDefault();
	};
    const [loaded, setLoaded] = useState(false);
    function onLoad() {
        console.log('loaded');
        setLoaded(true);
        // setUsername(item.username); 
        // console.log(username);
        // const modIsFreelancer = item.is_freelancer.toString() == "true"? "1":"0";
        // setIsFreelancer(modIsFreelancer);
        // console.log(isFreelancer);
        // setFirstName(user[0].first_name);
        // setLastName(item.last_name);
      }

	const handleChange = (event: SelectChangeEvent<typeof skillset>) => {
		const {
		  target: { value },
		} = event;
		setSkillset(
		  // On autofill we get a stringified value.
		  typeof value === 'string' ? value.split(',') : value,
		);
		// console.log(skillset.toString())
	  };

    const toLogIn = ()	=> {
		navigate('/')
	}

	const handleFileChange = (file: any) => {
        setUploadedFile(file);
        // console.log(uploadedFile?.name);
    };

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

    const onUpdateUser = () => {
		let data = new FormData();
		data.append('first_name', first_name)
		data.append('last_name', last_name)
        uploadedFile?
            data.append('profile_image', uploadedFile!):
            data.append('profile_image', profile_image)
		data.append('email', email)
		data.append('contact', contact)

        axios.put('http://127.0.0.1:8000/webapp/user/', data, {
            headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' + token['mytoken']
            },
        })
        .then(response => {
            console.log('response', response)
            // window.location.reload();
        })
        .catch(error => {
                // console.log(error)
                console.error(error.response.data); 
            });
        };
        
    const onUpdateFreelancer = () => {
        let data = new FormData();
        data.append('skillset', skillset.toString())
		data.append('linkedin_url', linkedin_url)
		data.append('github_url', github_url)
		data.append('facebook_url', facebook_url)

        axios.put('http://127.0.0.1:8000/webapp/freelancer/', data, {
            headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' + token['mytoken']
            },
        })
        .then(response => {
            console.log('response', response)
            // window.location.reload();
        })
        .catch(error => {
                // console.log(error)
                console.error(error.response.data); 
            });
        };
	
	// useEffect(() => {
	// 	if (token['mytoken']) {
	// 		isFreelancer == "1"? onCreateFreelancer(): console.log('not freelancer');

	// 		navigate('/home')
	// 		window.location.reload()
	// 	}
	// }, [token])
	
    useEffect(() => {
        fetchFreelancerProfile();
        fetchUser();
    }, []);
    
    return(
		<>
            {user.map((item, i) => (
            <>
            {/* {loaded?setUsername(item.username):console.log('not loaded')} */}
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
							// marginBottom={theme.spacing(5)}
							gutterBottom
							sx={{
									color: theme.palette.text.primary
							}}
						>
							Edit Profile
						</Typography>
						<Grid container justifyContent='center' marginBottom={4}>
							<Grid item>
                                <Box textAlign='center'>
                                <Button
                                    variant='contained'
                                    type='submit'
                                    onClick ={() => {
                                        setUsername(item.username); 
                                        console.log(username);
                                        const modIsFreelancer = item.is_freelancer.toString() == "true"? "1":"0";
                                        setIsFreelancer(modIsFreelancer);
                                        console.log(isFreelancer);
                                        setFirstName(item.first_name);
                                        setLastName(item.last_name);
                                        setEmail(item.email);
                                        setContact(item.contact);
                                        setProfileImage(item.profile_image.split('media/')[1]);
                                        item.is_freelancer?(
                                            freelancerProfile.map((freelancer, j) => (
                                            <>
                                                {setSkillset(Array.from(freelancer.skillset.split(',')))}
                                                {setLinkedInURL(freelancer.linkedin_url)}
                                                {setGithubURL(freelancer.github_url)}
                                                {setFacebookURL(freelancer.facebook_url)}
                                                
                                            </>
                                            ))
                                        ):console.log('not freelancer')
                                        
                                    }}
                                    sx={{
                                        width: 150,
                                        marginTop: theme.spacing(2),
                                        // float: 'right',
                                        color: theme.palette.common.white,
                                        borderRadius:2,
                                    }}
                                    >
                                    Display Data
                                </Button>
                                </Box>
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
									<InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
										<OutlinedInput
										id="outlined-adornment-username"
                                        placeholder={item.username}
                                        value={username}
										onChange={ (e) => {
											setUsername(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<PermIdentityIcon />
										</InputAdornment>
										}
										label="Username"
                                        disabled
									/>
								</FormControl>
                                <Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(3)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									First Name
								</Typography>
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-firstname">First Name</InputLabel>
										<OutlinedInput
										id="outlined-adornment-firstname"
                                        value={first_name}
										onChange={ (e) => {
                                            console.log(first_name)
											setFirstName(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<BadgeIcon />
										</InputAdornment>
										}
										label="First Name"
									/>
								</FormControl>
                                <Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(3)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Last Name
								</Typography>
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-lastname">Last Name</InputLabel>
										<OutlinedInput
										id="outlined-adornment-lastname"
                                        value={last_name}
										onChange={ (e) => {
                                            console.log(last_name)
											setLastName(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<BadgeIcon />
										</InputAdornment>
										}
										label="Last Name"
									/>
								</FormControl>
                                <Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(3)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Email Address
								</Typography>
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-lastname">Email</InputLabel>
										<OutlinedInput
										id="outlined-adornment-email"
                                        value={email}
										onChange={ (e) => {
											setEmail(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<EmailIcon />
										</InputAdornment>
										}
										label="Email"
									/>
								</FormControl>
                                <Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(3)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Contact Number
								</Typography>
								<FormControl sx={{ width: '50ch' }} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-contact">Contact Number</InputLabel>
										<OutlinedInput
										id="outlined-adornment-contact"
                                        value={contact}
										onChange={ (e) => {
											setContact(e.target.value)
										}}
										startAdornment={
										<InputAdornment position="start">
											<CallIcon />
										</InputAdornment>
										}
										label="Contact Number"
									/>
								</FormControl>
                                <Typography
									variant='subtitle1'
									fontWeight={700}
									marginTop={theme.spacing(3)}
									marginBottom={theme.spacing(2)}
									gutterBottom
									sx={{
											color: theme.palette.text.primary
									}}
								>
									Profile Photo
								</Typography>
                                <FileUploader 
                                    handleChange={handleFileChange} 
                                    name='file' 
                                    types={fileTypes}
                                    label='Browse to choose a file or Drag and drop'
                                />
                                {uploadedFile?
                                <Typography
                                    variant='subtitle1'
                                    fontWeight={400}
                                    fontSize={14}
                                    marginTop={theme.spacing(2)}
                                    gutterBottom
                                    sx={{
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {uploadedFile && uploadedFile.name}
                                </Typography>
                                :
                                <Typography
                                variant='subtitle1'
                                fontWeight={400}
                                fontSize={14}
                                marginTop={theme.spacing(2)}
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.primary
                                }}
                                >
                                    {profile_image.split("profileImages/")[1]}
                                </Typography>}
								{
								isFreelancer == "1"?(
								<>
									<Typography
										variant='subtitle1'
										fontWeight={700}
										marginTop={theme.spacing(3)}
										marginBottom={theme.spacing(2)}
										gutterBottom
										sx={{
												color: theme.palette.text.primary
										}}
									>
										Skillset
									</Typography>
									<FormControl sx={{ width: '50ch' }}>
										<InputLabel id="skillset-selector">Skillset</InputLabel>
										<Select
										labelId="skillset-selector-label"
										id="skillset-selector"
										multiple
										value={skillset}
										onChange={handleChange}
										input={<OutlinedInput id="select-multiple-skills" label="Skillset" />}
										renderValue={(selected) => (
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map((value) => (
												<Chip key={value} label={value} />
											))}
											</Box>
										)}
										MenuProps={MenuProps}
										>
										{skills.map((skill) => (
											<MenuItem
											key={skill}
											value={skill}
											style={getStyles(skill, skillset, theme)}
											>
											{skill}
											</MenuItem>
										))}
										</Select>
									</FormControl>
									<Typography
										variant='subtitle1'
										fontWeight={700}
										marginTop={theme.spacing(3)}
										marginBottom={theme.spacing(2)}
										gutterBottom
										sx={{
												color: theme.palette.text.primary
										}}
									>
										LinkedIn
									</Typography>
									<FormControl sx={{ width: '50ch' }} variant="outlined">
										<InputLabel htmlFor="outlined-adornment-linkedin">LinkedIn URL</InputLabel>
											<OutlinedInput
											id="outlined-adornment-linkedin"
                                            value={linkedin_url}
											onChange={ (e) => {
												setLinkedInURL(e.target.value)
											}}
											startAdornment={
											<InputAdornment position="start">
												<LinkedInIcon />
											</InputAdornment>
											}
											label="LinkedIn URL"
										/>
									</FormControl>
									<Typography
										variant='subtitle1'
										fontWeight={700}
										marginTop={theme.spacing(3)}
										marginBottom={theme.spacing(2)}
										gutterBottom
										sx={{
												color: theme.palette.text.primary
										}}
									>
										GitHub
									</Typography>
									<FormControl sx={{ width: '50ch' }} variant="outlined">
										<InputLabel htmlFor="outlined-adornment-github">GitHub URL</InputLabel>
											<OutlinedInput
											id="outlined-adornment-github"
                                            value={github_url}
											onChange={ (e) => {
												setGithubURL(e.target.value)
											}}
											startAdornment={
											<InputAdornment position="start">
												<GitHubIcon />
											</InputAdornment>
											}
											label="GitHub URL"
										/>
									</FormControl>
									<Typography
										variant='subtitle1'
										fontWeight={700}
										marginTop={theme.spacing(3)}
										marginBottom={theme.spacing(2)}
										gutterBottom
										sx={{
												color: theme.palette.text.primary
										}}
									>
										Facebook
									</Typography>
									<FormControl sx={{ width: '50ch' }} variant="outlined">
										<InputLabel htmlFor="outlined-adornment-facebook">Facebook URL</InputLabel>
											<OutlinedInput
											id="outlined-adornment-facebook"
                                            value={facebook_url}
											onChange={ (e) => {
												setFacebookURL(e.target.value)
											}}
											startAdornment={
											<InputAdornment position="start">
												<FacebookIcon />
											</InputAdornment>
											}
											label="Facebook URL"
										/>
									</FormControl>
								</>
								): null}
								<Box textAlign='center'>
									<Button
										// disabled={message.status === "success" ? true : false}
										variant='contained'
										type='submit'
										onClick={() => {
                                            onUpdateUser()
                                            item.is_freelancer? onUpdateFreelancer(): console.log("not freelancer");
                                            navigate("/userProfile") 
                                            window.location.reload()

                                        } }
										sx={{
											width: 150,
											marginTop: theme.spacing(10),
											marginBottom: theme.spacing(8),
											// float: 'right',
											color: theme.palette.common.white,
											borderRadius:10,
										}}
									>
										Update
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Container>
        </>
            ))}
		</>
    );
}

export default EditProfile;