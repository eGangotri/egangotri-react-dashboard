import env from "react-dotenv";
import configData from "./config.json";

const development = {
    BACKEND_SERVER : configData.BACKEND_SERVER_LOCAL,
    env : env.DEV_ENV || 'dev'
  };
  
  const production = {
    BACKEND_SERVER : configData.BACKEND_SERVER_AZURE,
    env : env.DEV_ENV || 'prod'
  };
  
  export function getServer() {
      console.log(`getServer process.env.DEV_ENV ${env.DEV_ENV}`)
      return env.DEV_ENV === 'prod' ? production : development;
  } 

  export const backendServer = getServer();