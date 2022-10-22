import React from 'react';

export default function Upload(props:any) {
    console.log(`props.item ${JSON.stringify(props)} ${props.item}`);

    return (
        <>
        <tr>
            <td>
            {props.item._id}
            </td>
            <td>
            {props.item.archiveProfile}
            </td>
            <td>
            {props.item.uploadLink}
            </td>
            <td>
            {props.item.localPath}
            </td>
            <td>
            {props.item.title}
            </td>
            <td>
            {props.item.csvName}
            </td>
            <td>
            {props.item.uploadCycleId}
            </td>
            <td>
            {props.item.datetimeUploadStarted}
            </td>
            <td>
            <button>Run Item # {props.item._id}</button>
            </td>
        </tr>
        </>
    );
  }