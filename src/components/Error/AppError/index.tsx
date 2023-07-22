import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { BLUE_MATISSE, SAIL_BLUE } from "constants/colors";
import { Button } from "@mui/material";

const styles = {
  position: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
};

const AppError: React.FC = () => (
  <Box
    sx={{
      ...styles.position,
      height: "100vh",
    }}
  >
    <Box
      sx={{
        ...styles.position,
        height: "260px",
        width: "450px",
        backgroundColor: SAIL_BLUE,
        padding: "0px 40px",
      }}
    >
      
      <Typography
        style={{
          color: BLUE_MATISSE,
          marginTop: "10px",
          fontWeight: 400,
          fontSize: "20px",
        }}
      >
        <div>Sorry, an unexpected error</div>
        <div style={{ textAlign: "center" }}>has occurred.</div>
      </Typography>
      <Button
        variant="contained"
        href={"/"}
        sx={{
          padding: "11px",
          marginTop: "15px",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        Go to dashboard
      </Button>
    </Box>
  </Box>
);

export default AppError;
