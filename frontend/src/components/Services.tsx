import React, { useState, useEffect } from 'react';
import {Box, Card, CardMedia, Container, Grid, Typography} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface ServicesProps {
  id: number;
  title: number;
  description: string;
  image: string;
}

const Services = (): JSX.Element => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServicesProps[]>([]);
 

  const fetchProducts = () => {
    //take from backend thru JSON API
    axios.get<ServicesProps[]>('http://127.0.0.1:8000/webapp/', { //API need to change to services
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        //max display 4
        setServices(response.data.slice(0, 4));
      })
      .catch(error => console.log(error));
  };
  
  useEffect(() => {
    fetchProducts();
    console.log(services);
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
            {services.map((item, i) => (
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
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color='inherit'
                  >
                    {item.description}
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

export default Services;