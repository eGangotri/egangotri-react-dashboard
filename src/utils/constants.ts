
const backendServerDev =  import.meta.env.VITE_BACKEND_SERVER_DEV|| "";
const backendServerProd =  import.meta.env.VITE_BACKEND_SERVER_PROD || "";
const aiServer =  import.meta.env.AI_SERVER || "";
const reactDevEnv = import.meta.env.VITE_DEV_ENV;
const BACKEND_SERVER = reactDevEnv === 'prod' ? backendServerProd : backendServerDev;
export const AI_SERVER = aiServer;

console.log(`getServer env.REACT_APP_DEV_ENV ${reactDevEnv}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_DEV ${backendServerDev}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_PROD ${backendServerProd}`)

console.log(`Deployment on ${import.meta.env.VITE_LAST_DEPLOYMENT_ON}
${reactDevEnv}
    getServer:${BACKEND_SERVER}`)
    
export function getBackendServer(): string {
  return BACKEND_SERVER;
}

export const MAX_ITEMS_LISTABLE = 2500;

export const backendServer = getBackendServer();

export const WIDTH_OF_WIDGETS = 250;