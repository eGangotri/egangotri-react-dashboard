import React from "react";
import Item from "model/Item";

type UploadPropsType = {
  item: Item;
};
const UploadItem: React.FC<UploadPropsType> = ({ item }) => {
  //console.log(`item ${JSON.stringify(props)} ${item}`);

  return (
    <>
      <tr key={item._id}>
        <td>{item._id}</td>
        <td>{item.archiveProfile}</td>
        <td>{item.uploadLink}</td>
        <td>{item.localPath}</td>
        <td>{item.title}</td>
        <td>{item.csvName}</td>
        <td>{item.uploadCycleId}</td>
        <td>{item.datetimeUploadStarted}</td>
        <td>
          <button>Run Item # {item._id}</button>
        </td>
      </tr>
    </>
  );
};

export default UploadItem;
