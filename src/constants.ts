import * as Util from "./utils"
import env from "react-dotenv";

const development = {
    BACKEND_SERVER : "http://localhost:4000/",
    env : env.DEV_ENV || 'dev'
  };
  
  const production = {
    BACKEND_SERVER : "http://localhost:5000/",
    env : env.DEV_ENV || 'prod'
  };
  
  export function getServer() {
      console.log(`getServer process.env.DEV_ENV ${env.DEV_ENV}`)
      return env.DEV_ENV === 'prod' ? production : development;
  } 

  export const backendServer = getServer();