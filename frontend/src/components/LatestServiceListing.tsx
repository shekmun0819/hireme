import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface ServicesProps {
    id: number;
    title: string;
    description: string;
    image: string;
    created_date: Date;
    updated_date: Date;

}

const LatestServiceListing = (): JSX.Element => {
    
    const theme = useTheme();
    const navigate = useNavigate();
    const [token, setToken] = useCookies(['mytoken']);

    var [services, setServices] = useState<ServicesProps[]>([]);
    
    function sortFunction(a:any,b:any){  
        var dateA = new Date(a.updated_date);
        var dateB = new Date(b.updated_date);
        return dateB > dateA ? 1 : -1;  
    }; 

    const fetchService = () => {
        //take from backend thru JSON API
        axios.get<ServicesProps[]>('http://127.0.0.1:8000/webapp/', { //API need to change to services
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + token['mytoken']
            }
        })
            .then(response => { //response.data
                //max display 4
                //response.data.sort((a:any, b:any) => a.updated_date - b.updated_date).slice(0,4)
                console.log(response.data);
                console.log(response.data.sort(sortFunction).slice(0,4));
                setServices(response.data.sort(sortFunction).slice(0,4))

            })
            .catch(error => console.log(error));
    };


    useEffect(() => {
        fetchService();
    }, []);

    return (
        <div id='products'>
            <Box
                sx={{
                    pt: 5,
                    pb: 10,
                    px: 2,
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Container>
                    <Grid container spacing={3}>
                        {services?.map((item, i) => (
                            <Grid item xs={3} sm={3} key={i}>
                                <Box
                                    onClick={() => {
                                        navigate("/" + item.title)
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
                                            gutterBottom
                                            noWrap
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.title}
                                            {/*item.title.length <= 18 ? item.title: (item.title.substr(0, 18) + "...")*/}
                                        </Typography>
                                        <Typography
                                        noWrap
                                            color='inherit'
                                        >
                                            {item.description}
                                            {/* {item.description.substring(0, 24) + "..."} */}
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
                                                image={item.image}
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
        </div >
    );
};

export default LatestServiceListing;
