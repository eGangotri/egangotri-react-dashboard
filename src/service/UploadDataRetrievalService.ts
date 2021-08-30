import moment from 'moment';
import Item from '../model/Item';

export function getUploadStatusData(){
    const items:Item[] = [];
    let now = moment();
    items.push({
        id:1,
        date: now.add(-1, 'day').format("DD-MM-YYYY"),
        status:"Pending"
    },{
        id:2,
        date: now.add(-2, 'day').format("DD-MM-YYYY"),
        status:"Pending"
    })

    return items;
}

export function getIndices(){
    return [1,2,3,4,5];
}