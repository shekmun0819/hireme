import React from 'react';
import SliderPage from '../components/SliderPage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CustomButton from '../components/CustomButton';
import LatestServiceListing from '../components/LatestServiceListing';

const Home = (): JSX.Element => {
  const theme = useTheme();
  return (
    <div id="home">
      <SliderPage />
      {<Box marginBottom={4} marginTop={10}>
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
          Lastest Service Listing
        </Typography>
      </Box>}
      <LatestServiceListing />
      <Box textAlign='center' marginTop={-15}>
      <CustomButton
        href='serviceListing'
        text='See more'
      />
      </Box>
    </div>
  );
};

export default Home;