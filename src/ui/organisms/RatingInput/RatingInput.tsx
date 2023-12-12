import { FC } from 'react';
import { Box, BoxProps, Rating, RatingProps, Text } from '@mantine/core';

interface RatingInputType extends BoxProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  ratingProps?: RatingProps;
}

const RatingInput: FC<RatingInputType> = ({ id, label, required, ratingProps, ...props }) => {
  return (
    <Box {...props}>
      <Text component="label" size="sm" weight={500} mb="0.5rem" display="block">
        {label}{' '}
        {required && (
          <Text component="span" aria-hidden="true" color="red">
            *
          </Text>
        )}
      </Text>
      <Rating id={id} {...ratingProps} />
    </Box>
  );
};

export default RatingInput;
