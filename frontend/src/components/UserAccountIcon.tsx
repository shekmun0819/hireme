import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';



export const UserAccountIcon = (image:any): JSX.Element => {

    const theme = useTheme();

    return (
        <Avatar
            src={image}
            onClick={event => window.location.href = 'userProfile'}
            sx={{
                color: theme.palette.text.primary,
                fontSize: '30px',
                textTransform: 'uppercase',
                mx: 1.5,
                marginLeft: '15px',
                '&:active': {
                    color: theme.palette.primary.main,
                },
                '&:hover': {
                    color: theme.palette.primary.main,
                },
            }}
        >
        </Avatar>
    );
};
export default UserAccountIcon;