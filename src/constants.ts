import env from "react-dotenv";
import configData from "./config.json";

const development = {
    BACKEND_SERVER : configData.BACKEND_SERVER_LOCAL,
    env : env.REACT_APP_DEV_ENV || 'dev'
  };
  
  const production = {
    BACKEND_SERVER : configData.BACKEND_SERVER_AZURE,
    env : env.REACT_APP_DEV_ENV || 'prod'
  };
  
  export function getServer() {
      console.log(`getServer process.env.REACT_APP_DEV_ENV ${env.REACT_APP_DEV_ENV}`)
      const devEnv = env.REACT_APP_DEV_ENV === 'prod' ? production : development;
      console.log(`getServer:devEnv ${devEnv.BACKEND_SERVER}`)
      return devEnv.BACKEND_SERVER;
  } 

  export const backendServer = getServer();