import { Box } from '@mui/material';

const Spinner = () => {
  return (
    <Box className="flex justify-center items-center">
      <Box className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></Box>
    </Box>
  //    <Box className="fixed inset-0 flex justify-center items-center z-50">
  //    <Box className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></Box>
  //  </Box>
  );
};

export default Spinner;