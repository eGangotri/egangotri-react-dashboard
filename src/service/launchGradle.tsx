import { backendServer } from 'utils/constants';

export async function launchGradleMoveToFreeze(profiles: string) {
    const _url = `${backendServer}execLauncher/moveToFreeze?profiles=${profiles}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}

export async function launchUploader(profiles: string) {
    const _url = `${backendServer}execLauncher/launchUploader?profiles=${profiles}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}