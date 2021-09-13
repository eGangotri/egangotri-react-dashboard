import { BACKEND_SERVER } from '../constants';

export function getUploadStatusData(){
    return fetch(BACKEND_SERVER + "itemsQueued/list?limit=20").then( res => res.json())
        .then((items:any[]) => {
            console.log(`items ${items.length}`);
            return items;
        });
}

export function getUploadStatusDataByProfile(){
    return fetch(BACKEND_SERVER + "itemsQueued/listByProfile?limit=20").then( res => res.json())
        .then((items:any[]) => {
            console.log(`items ${items.length}`);
            return items;
        });
}
export async function getUploadStatusData3() {
    const res = await fetch(BACKEND_SERVER + "itemsQueued/list?limit=1");
    const items = await res.json();
    console.log(`items ${items.length}`);
    return items;
}