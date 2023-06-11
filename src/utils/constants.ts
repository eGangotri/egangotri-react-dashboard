import env from "react-dotenv";

export function getServer(): string {
  console.log(`getServer process.env.REACT_APP_DEV_ENV ${env.REACT_APP_DEV_ENV}`)
  console.log(`getServer process.env.REACT_APP_DEV_SERVER ${env.REACT_APP_DEV_SERVER}`)
  console.log(`getServer process.env.REACT_APP_BACKEND_SERVER_PROD ${env.REACT_APP_BACKEND_SERVER_PROD}`)
  console.log(`getServer process.env.REACT_APP_BACKEND_SERVER_DEV ${env.REACT_APP_BACKEND_SERVER_DEV}`)

  const backendServer = env.REACT_APP_DEV_ENV === 'prod' ? env.REACT_APP_BACKEND_SERVER_PROD : "http://localhost:80/";

  console.log(`Deployment on ${env.REACT_APP_LAST_DEPLOYMENT_ON}
      getServer:${backendServer}`)
  return backendServer;
}

export const backendServer = getServer();

export const WIDTH_OF_WIDGETS = 250;