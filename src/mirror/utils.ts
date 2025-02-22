export const replaceQuotes = (replaceable: string) => {
  //console.log(`replaceable ${JSON.stringify(replaceable)}`)
  return replaceable?.replace(/"|'/g, "")
}

export function formatMem(heapSize: number) {
  const heapSizeInMBs = (heapSize / 1024 / 1024);
  const heapSizeInGBs = (heapSize / 1024 / 1024 / 1024);
  return heapSizeInGBs > 1 ? `${heapSizeInGBs.toFixed(2)} GB(s)` : `${heapSizeInMBs.toFixed(2)} Mb(s)`
}

export function formatTime(timeLapseinMS: number) {
  const timeLapseInSecs = timeLapseinMS / 1000
  const timeLapseInMins = timeLapseInSecs/60
  const timeLapseInHrs = timeLapseInMins/60
  let timeLapse = `${timeLapseInSecs.toFixed(2)} sec(s)`
  if (timeLapseInHrs > 1) {
       timeLapse = `${(timeLapseInMins/60).toFixed(2)} hour(s)`
  }
  else if (timeLapseInMins > 1) {
       timeLapse = `${timeLapseInMins.toFixed(2)} min(s)`
  }
  return timeLapse
}
