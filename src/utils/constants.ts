
const backendServerDev =  process.env.REACT_APP_BACKEND_SERVER_DEV|| "";
const backendServerProd =  process.env.REACT_APP_BACKEND_SERVER_PROD || "";
const reactDevEnv = process.env.REACT_APP_DEV_ENV;
const BACKEND_SERVER = reactDevEnv === 'prod' ? backendServerProd : backendServerDev;

console.log(`getServer env.REACT_APP_DEV_ENV ${reactDevEnv}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_DEV ${backendServerDev}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_PROD ${backendServerProd}`)

console.log(`Deployment on ${process.env.REACT_APP_LAST_DEPLOYMENT_ON}
${reactDevEnv}
    getServer:${BACKEND_SERVER}`)
    
export function getServer(): string {
  return BACKEND_SERVER;
}

export const MAX_ITEMS_LISTABLE = 500;

export const backendServer = getServer();

export const WIDTH_OF_WIDGETS = 250;