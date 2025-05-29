import { Box, CircularProgress } from '@mui/material';

const Spinner = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
      <CircularProgress size={30} thickness={4} color="primary" />
      <Box sx={{ ml: 2, fontWeight: 'bold', color: '#3f51b5' }}>Processing...</Box>
    </Box>
  );
};

export default Spinner;