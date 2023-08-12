
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} placement='right'/>
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
    },
}));