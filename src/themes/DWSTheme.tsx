import { createTheme } from '@mui/material/styles';
import React from 'react';

import {
  AURO_METAL,
  BLACK,
  ERROR_RED,
  GRAY34,
  PRIMARY_BLUE,
  ROMAN_SILVER,
  SUCCESS_GREEN,
  TEXT_DISABLED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WARNING_ORANGE,
  WARNING_YELLOW,
  WHITE,
} from 'constants/colors';

const commonTextStyle: React.CSSProperties = {
  lineHeight: '22px',
  fontSize: '13px',
  letterSpacing: '-0.02rem',
};

export default createTheme({
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
});
