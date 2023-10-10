import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Box, Card, CardMedia, Container, Grid, Typography, InputAdornment, TextField  } from '@mui/material';
import { useCookies } from 'react-cookie';

interface ServicesProps {
    id: number;
    title: string;
    description: string;
    image: string;
    created_date: Date;
    updated_date: Date;
}

const ServiceListing = (): JSX.Element => {

    const theme = useTheme();

    const navigate = useNavigate();
    const [services, setServices] = useState<ServicesProps[]>([]);
    var [filtered, setFiltered] = useState<ServicesProps[]>([]);
    const [sort, setSorting] = useState('');
    const [token, setToken] = useCookies(['mytoken']);

    const globalSearch = (e: any) => {
        let filteredServices = services?.filter(value => {
            return (
                value?.title.toLowerCase().includes(e.target.value) ||
                value?.title.toUpperCase().includes(e.target.value) ||
                value?.title.includes(e.target.value) ||
                value?.description.toLowerCase().includes(e.target.value) ||
                value?.description.toUpperCase().includes(e.target.value) ||
                value?.description.includes(e.target.value)
            );
        });
        setFiltered(filteredServices);
    };

    function sortDateFunction(a: any, b: any) {
        var dateA = new Date(a.updated_date);
        var dateB = new Date(b.updated_date);
        return dateB > dateA ? 1 : -1;
    };

    const handleSortChange = (e: any) => {
        setSorting(e.target.value);
        if (e.target.value === 'valueAsc' || e.target.value === 'default') {

            filtered = filtered.sort((a, b) => {
                const titleA = a.title.toUpperCase();
                const titleB = b.title.toUpperCase();
                if (titleA < titleB) {
                    return -1
                }
                if (titleA > titleB) {
                    return 1;
                }

                return 0;
            });
            setFiltered(filtered);
        }
        else if (e.target.value === 'valueDsc') {
            filtered = filtered.sort((a, b) => {
                const titleA = a.title.toUpperCase();
                const titleB = b.title.toUpperCase();
                if (titleA < titleB) {
                    return 1
                }
                if (titleA > titleB) {
                    return -1;
                }

                return 0;
            });
            setFiltered(filtered);

        }
        else if (e.target.value === 'latestDate') {
            //console.log(filtered.forEach(item=> console.log(item.updated_date)))
            filtered = filtered.sort(sortDateFunction);
            setFiltered(filtered);
        }

    }

    useEffect(() => {

    }, [filtered])

    const fetchProducts = () => {
        //take from backend thru JSON API
        axios.get<ServicesProps[]>('http://127.0.0.1:8000/webapp/', { //API need to change to services
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + token['mytoken']
            }
        })
            .then(response => {
                //max display 4
                setServices(response.data);
                setFiltered(response.data);
            })
            .catch(error => console.log(error));
    };



    useEffect(() => {
        fetchProducts();
    }, []);



    return (
        <div>
            <Box textAlign='center' marginTop={5}>
                <TextField
                    sx={{ backgroundColor: '#FFFFFF', width: '500px', borderRadius: '50', "& .MuiOutlinedInput-notchedOutline legend": { display: "none", } }}
                    id="outlined-basic"
                    variant="outlined"
                    placeholder='Search'
                    onChange={globalSearch}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: 200, marginLeft: 2 }}>
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Sort By"
                        //name="xxx"
                        value={sort}
                        onChange={handleSortChange}
                    >
                        <MenuItem value='default'>Default</MenuItem>
                        <MenuItem value='valueAsc'>Job Name(A-Z)</MenuItem>
                        <MenuItem value='valueDsc'>Job Name(Z-A)</MenuItem>
                        <MenuItem value='latestDate'>By latest date</MenuItem>
                    </Select>
                </FormControl>

            </Box>
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
                        {filtered?.map((item, i) => (
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
                                    <Box display='flex' flexDirection='column' >
                                        <Typography
                                            variant='h6'
                                            gutterBottom
                                            noWrap
                                            sx={{

                                                fontWeight: 600,
                                            }}
                                        >
                                            {/* {item.title.length <= 18 ? item.title: (item.title.substr(0, 18) + "...")} */}
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            noWrap
                                            color='inherit'
                                        >
                                            {item.description}
                                            {/* {item.description.length <= 18 ? item.description: (item.description.substr(0, 24) + "...")} */}
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
        </div>

    );
};

export default ServiceListing;

