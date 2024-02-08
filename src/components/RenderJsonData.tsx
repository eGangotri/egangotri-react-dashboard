import React from 'react';

interface RenderJsonDataProps {
  data: string //Record<string, any>;
}

const RenderJsonData: React.FC<RenderJsonDataProps> = ({ data }) => {
 // const renderData = (obj: Record<string, any>) => {
    return (<></>)
    // return Object.entries(obj).map(([key, value]) => (
    //   <td key={key}>
    //     <strong>{key}:</strong>
    //     {typeof value === 'object' ? renderData(value) : <span>{value}</span>}
    //   </td>
    // ));
  //};

  return (<table>
    <tr>
      <th></th>
    </tr>
    <tr>
    {/* {renderData(data)} */}
    </tr>
  </table>)
};

export default RenderJsonData;
