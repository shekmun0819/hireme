import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, CardActions, CardContent, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Rating, Stack, Typography } from '@mui/material';
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
import { useCookies } from 'react-cookie';

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

interface PreviousProjectsProps {
    service: string;
    freelancer: string;
    review: string;
    rating: number;
    status: string;
    price: number;
    user_id: number;
}

interface PreviousBookingsProps {
    service: string;
    freelancer: string;
    review: string;
    rating: number;
    status: string;
    price: number;
    user_id: number;
}

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

const UserProfile = (): JSX.Element => {

    const theme = useTheme();
    const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfileProps[]>([]);
    const [freelancerPreviousProjects, setFreelancerPreviousProjects] = useState<PreviousProjectsProps[]>([]);
    const [userPreviousBookings, setUserPreviousBookings] = useState<PreviousBookingsProps[]>([]);
    const [user, setUser] = useState<UserProps[]>([]); 
	const [token, setToken] = useCookies(['mytoken']);
    const sleep = (m: number | undefined) => new Promise(r => setTimeout(r, m))

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

    const fetchFreelancerPreviousProjects = (uid:any) => {
        axios.get<PreviousProjectsProps[]>('http://127.0.0.1:8000/webapp/previousprojects', {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                freelancer_user_id: uid
            }
        })
            .then((response) => {
                setFreelancerPreviousProjects(response.data);
            })
            .catch(error => { console.log(error) });
    };

    const fetchUserPreviousBookings = (uid:any) => {
        axios.get<PreviousBookingsProps[]>('http://127.0.0.1:8000/webapp/previousbookings', {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                user_id: uid
            }
        })
            .then((response) => {
                setUserPreviousBookings(response.data);
            })
            .catch(error => { console.log(error) });
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


    useEffect(() => {
        fetchFreelancerProfile();
        // fetchFreelancerPreviousProjects(freelancerProfile[0].user_id)
        // fetchFreelancerPreviousProjects(1)
        // console.log(freelancerProfile[0])

        fetchUser();
    }, []);

    // window.onload = () => {
    //     let reloading = sessionStorage.getItem("reloading");
    //     if(reloading){
    //         freelancerProfile.map((item, i) => (
    //             fetchFreelancerPreviousProjects(item.user_id)
    //         ))
    //     }
    // }

    // freelancerProfile.map((item, i) => (
    //     fetchFreelancerPreviousProjects(item.user_id)
    // ))

    // user.forEach((user, k) => {
    //     if (user.is_freelancer) {
    //         return(<></>);
    //     }
    //     else {
    //         console.log(user.username);
    //         return(<></>);
    //     }
    // })

    return (
        <>
            {user.map((item, i) => (
                item.is_freelancer ? (
                freelancerProfile.map((item, i) => (
                <>
                {fetchFreelancerPreviousProjects(freelancerProfile[0].user_id)}
                <Grid container>
                        <Grid item xs={5} sm={8} md={8}>
                            <Typography
                                variant='h3'
                                fontWeight={500}
                                marginLeft={theme.spacing(10)}
                                marginTop={theme.spacing(10)}
                                gutterBottom={true}
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {item.last_name}'s Dashboard
                            </Typography>
                        </Grid>
                        <Grid item xs={7} sm={4} md={4} alignItems='center'>
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<EditIcon />}
                                href="/editProfile"
                                sx={{
                                    marginTop: theme.spacing(10),
                                    marginRight: theme.spacing(10),
                                    float: 'right',
                                    color: theme.palette.background.default,
                                    borderRadius: 2,
                                }}
                            >
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                    <Container>
                        <Grid container spacing={1} justifyContent='left' marginBottom={5}>
                            <Box
                                marginTop={theme.spacing(5)}
                                component={Card}
                                padding={10}
                                width="100%"
                                height="100%"
                                // maxWidth={1200}
                                // maxHeight={400}
                                borderRadius={10}
                                bgcolor={theme.palette.primary.light}
                            >
                                <Grid container spacing={1} justifyContent='left'>
                                    <Stack marginRight={theme.spacing(5)}>
                                        <Grid item>
                                            <Avatar
                                                src={item.profile_image}
                                                sx={{
                                                    width: 200,
                                                    height: 200,
                                                }} />
                                        </Grid>
                                        <Grid item marginTop={4}>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    onClick={() => window.open(item.linkedin_url)}
                                                    sx={{
                                                        color: "#0072b1",
                                                        '&:hover': {
                                                            bgcolor: theme.palette.background.default,
                                                        }
                                                    }}
                                                >
                                                    <LinkedInIcon sx={{
                                                        fontSize: "45px",
                                                        alt: "LinkedIn",
                                                    }} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => window.open(item.facebook_url)}
                                                    sx={{
                                                        color: "#3b5998",
                                                        '&:hover': {
                                                            bgcolor: theme.palette.background.default,
                                                        }
                                                    }}
                                                >
                                                    <FacebookIcon sx={{
                                                        fontSize: "45px",
                                                        alt: "Facebook",
                                                    }} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => window.open(item.github_url)}
                                                    sx={{
                                                        color: "#000000",
                                                        '&:hover': {
                                                            bgcolor: theme.palette.background.default,
                                                        }
                                                    }}
                                                >
                                                    <GitHubIcon sx={{
                                                        fontSize: "45px",
                                                        alt: "LinkedIn",
                                                    }} />
                                                </IconButton>
                                            </Stack>
                                        </Grid>
                                    </Stack>
                                    <Grid item>
                                        <Stack spacing={2} alignItems="flex-start">
                                            <Typography
                                                variant='h3'
                                                // marginLeft={theme.spacing(5)}
                                                marginTop={theme.spacing(2)}
                                                fontWeight={500}
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                }}
                                            >
                                                {item.last_name} {item.first_name}
                                            </Typography>
                                            <Typography
                                                variant='h5'
                                                // paddingLeft={theme.spacing(5)}
                                                marginTop={theme.spacing(2)}
                                                fontWeight={500}
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                }}
                                            >
                                                {item.contact}
                                            </Typography>
                                            <Typography
                                                variant='h5'
                                                // paddingLeft={theme.spacing(5)}
                                                marginTop={theme.spacing(2)}
                                                fontWeight={500}
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                }}
                                            >
                                                {item.email}
                                            </Typography>
                                            <Box width="100%" paddingTop={3}>
                                            {item.skillset.split(',').map((skill, i) => (
                                                <Chip
                                                    key={i}
                                                    label={skill}
                                                    component="a"
                                                    // href=""
                                                    // clickable
                                                    // size="medium"
                                                    // color="secondary"
                                                    sx={{
                                                        fontSize: 18, 
                                                        marginBottom: 1, 
                                                        marginRight: 3,
                                                        padding: 2.5,
                                                        backgroundColor: theme.palette.primary.main,
                                                        color: theme.palette.background.default,
                                                        "&:hover": {
                                                        backgroundColor: "transparent",
                                                        color: theme.palette.primary.main,
                                                        border: "1px solid " + theme.palette.primary.main
                                                        }
                                                    }}
                                                />
                                                ))}
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Container>
                    <Container>
                        <Grid container>
                            <Grid item xs={5} sm={8} md={8}>
                                <Typography
                                    variant='h4'
                                    fontWeight={400}
                                    marginTop={theme.spacing(2)}
                                    gutterBottom={true}
                                    sx={{
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    Previous Projects
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sm={8} md={8}>
                                <Typography
                                    variant='h6'
                                    fontWeight={400}
                                    gutterBottom={true}
                                    marginBottom={theme.spacing(4)}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    All previous projects will be shown here.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container style={{ marginBottom: theme.spacing(10) }}>
                        {freelancerPreviousProjects.map((project, j) => (
                        <List sx={{ 
                            key: j,
                            width: '100%', 
                            maxWidth: 1200,
                            bgcolor: theme.palette.background.default, 
                            borderRadius:5, 
                            marginBottom:3,
                            boxShadow: 3,
                        }}
                        >
                            <ListItem alignItems="center" style={{ padding:20 }}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="/assets/check.png" />
                                </ListItemAvatar>
                                <ListItemText
                                style={{ width:'100%', maxWidth:1000 }}
                                primary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="h5"
                                        color="theme.palette.text.primary"
                                    >
                                        {project.service}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="theme.palette.text.secondary"
                                        >
                                            Client  Review: {project.review}
                                        </Typography>
                                    </React.Fragment>
                                }
                                />
                                <Stack>
                                <ListItemText style={{ marginLeft: 25, }}
                                    primary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="h6"
                                            color="theme.palette.text.primary"
                                        >
                                            RM{project.price}.00
                                        </Typography>
                                    }
                                    />
                                    <Rating name="read-only" value={project.rating} readOnly  style={{ marginLeft:theme.spacing(3) }} />
                                </Stack>
                            </ListItem>
                        </List>
                        ))}
                    </Container>
                    </>
                ))
                ):
                (
                user.map((item, i) => (
                    <>
                    {fetchUserPreviousBookings(user[0].user_id)}
                    <Grid container>
                            <Grid item xs={5} sm={8} md={8}>
                                <Typography
                                    variant='h3'
                                    fontWeight={500}
                                    marginLeft={theme.spacing(10)}
                                    marginTop={theme.spacing(10)}
                                    gutterBottom={true}
                                    sx={{
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {item.last_name}'s Dashboard
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={4} md={4} alignItems='center'>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    endIcon={<EditIcon />}
                                    href="/editProfile"
                                    sx={{
                                        marginTop: theme.spacing(10),
                                        marginRight: theme.spacing(10),
                                        float: 'right',
                                        color: theme.palette.background.default,
                                        borderRadius: 2,
                                    }}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                        <Container>
                            <Grid container spacing={1} justifyContent='left' marginBottom={5}>
                                <Box
                                    marginTop={theme.spacing(5)}
                                    component={Card}
                                    padding={10}
                                    width="100%"
                                    height="100%"
                                    // maxWidth={1200}
                                    // maxHeight={400}
                                    borderRadius={10}
                                    bgcolor={theme.palette.primary.light}
                                >
                                    <Grid container spacing={1} justifyContent='left'>
                                        <Stack marginRight={theme.spacing(5)}>
                                            <Grid item>
                                                <Avatar
                                                    src={item.profile_image}
                                                    sx={{
                                                        width: 200,
                                                        height: 200,
                                                    }} />
                                            </Grid>
                                            {/* <Grid item marginTop={4}>
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton
                                                        onClick={() => window.open(item.linkedin_url)}
                                                        sx={{
                                                            color: "#0072b1",
                                                            '&:hover': {
                                                                bgcolor: theme.palette.background.default,
                                                            }
                                                        }}
                                                    >
                                                        <LinkedInIcon sx={{
                                                            fontSize: "45px",
                                                            alt: "LinkedIn",
                                                        }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => window.open(item.facebook_url)}
                                                        sx={{
                                                            color: "#3b5998",
                                                            '&:hover': {
                                                                bgcolor: theme.palette.background.default,
                                                            }
                                                        }}
                                                    >
                                                        <FacebookIcon sx={{
                                                            fontSize: "45px",
                                                            alt: "Facebook",
                                                        }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => window.open(item.github_url)}
                                                        sx={{
                                                            color: "#000000",
                                                            '&:hover': {
                                                                bgcolor: theme.palette.background.default,
                                                            }
                                                        }}
                                                    >
                                                        <GitHubIcon sx={{
                                                            fontSize: "45px",
                                                            alt: "LinkedIn",
                                                        }} />
                                                    </IconButton>
                                                </Stack>
                                            </Grid> */}
                                        </Stack>
                                        <Grid item>
                                            <Stack spacing={2} alignItems="flex-start">
                                                <Typography
                                                    variant='h3'
                                                    // marginLeft={theme.spacing(5)}
                                                    marginTop={theme.spacing(2)}
                                                    fontWeight={500}
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {item.last_name} {item.first_name}
                                                </Typography>
                                                <Typography
                                                    variant='h5'
                                                    // paddingLeft={theme.spacing(5)}
                                                    marginTop={theme.spacing(2)}
                                                    fontWeight={500}
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {item.contact}
                                                </Typography>
                                                <Typography
                                                    variant='h5'
                                                    // paddingLeft={theme.spacing(5)}
                                                    marginTop={theme.spacing(2)}
                                                    fontWeight={500}
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {item.email}
                                                </Typography>
                                                {/* <Box width="100%" paddingTop={3}>
                                                {item.skillset.split(',').map((skill, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={skill}
                                                        component="a"
                                                        sx={{
                                                            fontSize: 18, 
                                                            marginBottom: 1, 
                                                            marginRight: 3,
                                                            padding: 2.5,
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: theme.palette.background.default,
                                                            "&:hover": {
                                                            backgroundColor: "transparent",
                                                            color: theme.palette.primary.main,
                                                            border: "1px solid " + theme.palette.primary.main
                                                            }
                                                        }}
                                                    />
                                                    ))}
                                                </Box> */}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Container>
                        <Container>
                            <Grid container>
                                <Grid item xs={5} sm={8} md={8}>
                                    <Typography
                                        variant='h4'
                                        fontWeight={400}
                                        marginTop={theme.spacing(2)}
                                        gutterBottom={true}
                                        sx={{
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        Previous Bookings
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={8} md={8}>
                                    <Typography
                                        variant='h6'
                                        fontWeight={400}
                                        gutterBottom={true}
                                        marginBottom={theme.spacing(4)}
                                        sx={{
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        All your previous bookings will be displayed here.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Container>
                        <Container style={{ marginBottom: theme.spacing(10) }}>
                            {userPreviousBookings.map((booking, j) => (
                            <List sx={{ 
                                key: j,
                                width: '100%', 
                                maxWidth: 1200,
                                bgcolor: theme.palette.background.default, 
                                borderRadius:5, 
                                marginBottom:3,
                                boxShadow: 3,
                            }}
                            >
                                <ListItem alignItems="center" style={{ padding:20 }}>
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="/assets/check.png" />
                                    </ListItemAvatar>
                                    <ListItemText
                                    style={{ width:'100%', maxWidth:1000 }}
                                    primary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="h5"
                                            color="theme.palette.text.primary"
                                        >
                                            {booking.service}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="theme.palette.text.secondary"
                                            >
                                                Client  Review: {booking.review}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                    />
                                    <Stack>
                                    <ListItemText style={{ marginLeft: 25, }}
                                        primary={
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="h6"
                                                color="theme.palette.text.primary"
                                            >
                                                RM{booking.price}.00
                                            </Typography>
                                        }
                                        />
                                        <Rating name="read-only" value={booking.rating} readOnly  style={{ marginLeft:theme.spacing(3) }} />
                                    </Stack>
                                </ListItem>
                            </List>
                            ))}
                        </Container>
                        </>
                ))
                )
                ))}    
        </>
    );
};

export default UserProfile;