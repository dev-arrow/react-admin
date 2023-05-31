import { Box, Rating, Typography, styled } from '@mui/material';
import Icon from '@mui/icons-material/Stars';
import { InputProps, useInput, useTranslate } from 'react-admin';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#000',
    },
    '& .MuiRating-iconHover': {
        color: '#000',
    },
});

const StarRatingInput = (props: InputProps) => {
    const { name = 'resources.reviews.fields.rating' } = props;
    const { field } = useInput(props);
    const translate = useTranslate();

    return (
        <Box
            sx={{
                flexDirection: 'column',
                marginBottom: '1rem',
            }}
            display="flex"
        >
            <Typography>{translate(name)}</Typography>
            <StyledRating
                {...field}
                icon={<Icon />}
                onChange={(event, value) => field.onChange(value)}
            />
        </Box>
    );
};

export default StarRatingInput;
