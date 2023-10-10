import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import getTheme from './theme/theme';
import Layout from './layout/Layout';
import Home from './pages/Home';
import ServiceListing from './pages/ServiceListing';
import ClientRequest from './pages/ClientRequest';
import MyRequest from './pages/MyRequest';
import CreateService from './pages/CreateService';
import MyService from './pages/MyService';
import NotificationPage from './pages/NotificationPage';
import Message from './pages/Message';
// import UserAccount from './pages/UserAccount';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import ServiceDetails from './pages/ServiceDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { CookiesProvider } from 'react-cookie';

const App = (): JSX.Element => {  
  return (
    <CookiesProvider>
      <HelmetProvider>
        <Helmet 
          titleTemplate="%s | HireMe"
          defaultTitle="HireMe"
        />
        <ThemeProvider theme={getTheme()}>
          <CssBaseline />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path='/home' element={<Home />}/>
                <Route path='/serviceListing' element={<ServiceListing />}  />
                <Route path='/clientRequest' element={<ClientRequest />}  />
                <Route path='/myRequest' element={<MyRequest />}  />
                <Route path='/createService' element={<CreateService />}  />
                <Route path='/myService' element={<MyService />}  />
                <Route path='/notification' element={<NotificationPage />} />
                <Route path='/message' element={<Message />} />
                <Route path='/userProfile' element={<UserProfile />} />
                <Route path='/editProfile' element={<EditProfile/>} />
                <Route path='/' element={<Login/>} />
                <Route path='/signUp' element={<SignUp/>} />
                <Route path='/:title' element={<ServiceDetails/>}/>
                <Route path='/message-:name' element={<Message/>}/>
              </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </CookiesProvider>
  );
};

export default App;