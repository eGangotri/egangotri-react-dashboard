
const backendServerDev = import.meta.env.VITE_BACKEND_SERVER_DEV || "";
const backendServerProd = import.meta.env.VITE_BACKEND_SERVER_PROD || "";
const aiServer = import.meta.env.AI_SERVER || "";
const reactDevEnv = import.meta.env.VITE_DEV_ENV;
const BACKEND_SERVER = reactDevEnv === 'prod' ? backendServerProd : backendServerDev;
export const AI_SERVER = aiServer;

console.log(`getServer env.REACT_APP_DEV_ENV ${reactDevEnv}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_DEV ${backendServerDev}`)
console.log(`getServer env.REACT_APP_BACKEND_SERVER_PROD ${backendServerProd}`)

console.log(`Deployment on ${import.meta.env.VITE_LAST_DEPLOYMENT_ON}
${reactDevEnv}
    getServer:${BACKEND_SERVER}`)

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function getBackendServer(): string {
    if (!BACKEND_SERVER.endsWith("/")) {
        return `${BACKEND_SERVER}/`;
    }
    return BACKEND_SERVER;
}

//sum of all items inside each
//UploacCycle.archiveProfiles[].archiveProfilePath[].absolutePaths
// in other words  total intended count of items per upload cycle
// so if u see 20 rows. each row has intendedItems summed up under MAX_ITEMS_LISTABLE
//u r good. otherwise after MAX_ITEMS_LISTABLE  count
// wrong values will start showing up.
export const MAX_ITEMS_LISTABLE =  typeof localStorage !== 'undefined' ? Number(localStorage.getItem('MAX_ITEMS_LISTABLE')) || 5000 : 5000;
 

//No. of UploadCycles that can be displayed in Home Page
export const MAX_ITEMS_LISTABLE_FOR_UPLOAD_CYCLE =  typeof localStorage !== 'undefined' ? Number(localStorage.getItem('MAX_ITEMS_LISTABLE_FOR_UPLOAD_CYCLE')) || 100 : 100;

export const WIDTH_OF_WIDGETS = 250;

export const DISPOSE_TOGGLE_CLASS = 'dispose-toggle';

export const DISPOSED_ROW_SX = {
    '& .disposed-row': {
        opacity: 0.6,
    },
    '& .disposed-row .MuiDataGrid-cell': {
        textDecoration: 'line-through !important',
        color: 'text.disabled !important',
    },
    '& .disposed-row .MuiTypography-root': {
        textDecoration: 'line-through !important',
        color: 'text.disabled !important',
    },
    '& .disposed-row a, & .disposed-row button:not(.dispose-toggle)': {
        pointerEvents: 'none',
    },
    '& .disposed-row button.dispose-toggle': {
        pointerEvents: 'auto',
    }
};

