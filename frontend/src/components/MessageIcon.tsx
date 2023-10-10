import MsgIcon from '@mui/icons-material/Message';
import { useTheme } from '@mui/material/styles';



const MessageIcon = (): JSX.Element => {

    const theme = useTheme();

    return (
        <MsgIcon
        onClick={event =>  window.location.href='message'}
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
        </MsgIcon>
    );
};
export default MessageIcon;