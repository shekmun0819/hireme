import React from 'react';
import Carousel from 'react-material-ui-carousel'
import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.png';
import banner3 from '../assets/images/banner3.png';

const SliderPage = (): JSX.Element => {
  return (
    <div>
      <Carousel height='400px'>
        <img src={banner1} alt='Banner1' width='100%'></img>
        <img src={banner2} alt='Banner2' width='100%'></img>
        <img src={banner3} alt='Banner3' width='100%'></img>
      </Carousel>
      {/* <TextField
      sx={{marginTop:'-300px',zIndex:'1300', backgroundColor:'#FFFFFF', marginLeft:'24%', borderRadius:'15px', width:'50em'}}
        id="outlined-basic"
        //label="Search" 
        variant="outlined"
        type="search"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),}}
  /> */}
    </div>



  )
};

export default SliderPage;