import { createTheme } from '@mui/material/styles';
import React from 'react';

const commonTextStyle: React.CSSProperties = {
  lineHeight: '22px',
  fontSize: '13px',
  letterSpacing: '-0.02rem',
};

export default createTheme({
  typography: {
    fontFamily: 'serif',
  },
});
//export default createTheme({
// typography: {
//   fontFamily: 'Inter',
//   body1: {
//     color: BLACK,
//     fontSize: '13px',
//   }
// },
// palette: {
//   primary: {
//     main: PRIMARY_BLUE, // Button background
//     light: WHITE,
//     contrastText: WHITE, // Button text
//   },
// },
//});
