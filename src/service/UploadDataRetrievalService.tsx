import { backendServer } from 'utils/constants';

export function getUploadStatusData(){
    return fetch(backendServer + "itemsQueued/list?limit=20").then( res => res.json())
        .then((items:any[]) => {
            console.log(`items ${items.length}`);
            return items;
        });
}

export function getUploadStatusDataByProfile(){
    return fetch(backendServer + "itemsQueued/listByProfile?limit=20").then( res => res.json())
        .then((items:any[]) => {
            console.log(`items ${items.length}`);
            return items;
        });
}
export async function getUploadStatusData3() {
    const res = await fetch(backendServer + "itemsQueued/list?limit=1");
    const items = await res.json();
    console.log(`items ${items.length}`);
    return items;
}