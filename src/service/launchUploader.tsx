import {backendServer} from '../Constants';

export async function launchGradle(profiles:string){
    console.log(`${backendServer}launchGradle?profiles=${profiles}`)
    const res = await fetch(`${backendServer}launchGradle?profiles=${profiles}`);
    console.log(`res ${JSON.stringify(res)}`);
    const items = await res.json();
    console.log(`items ${items.length}`);
    return items;
}