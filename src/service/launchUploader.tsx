import { backendServer } from 'utils/constants';

export async function launchGradle(profiles: string) {
    const _url = `${backendServer}launchGradle/moveToFreeze?profiles=${profiles}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    console.log(`res ${JSON.stringify(res)}`);
    return res;
}