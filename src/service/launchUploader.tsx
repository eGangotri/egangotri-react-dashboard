import { BACKEND_SERVER } from "../constants";

export async function launchGradle(profiles:string){
    console.log(`${BACKEND_SERVER}launchGradle?profiles=${profiles}`)
    const res = await fetch(`${BACKEND_SERVER}launchGradle?profiles=${profiles}`);
    console.log(`res ${JSON.stringify(res)}`);
    const items = await res.json();
    console.log(`items ${items.length}`);
    return items;
}