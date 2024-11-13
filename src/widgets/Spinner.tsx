import { Box } from '@mui/material';

const Spinner = () => {
  return (
    <Box className="flex justify-center items-center">
      <Box className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900">Loading</Box>
    </Box>
  );
};

export default Spinner;