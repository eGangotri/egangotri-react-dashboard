import Item from "../model/Item";
import Upload from "./Upload";

export default function Uploads(props:any) {

    const content = props.items.map((item:Item) =>
     <Upload item={item}/>
  );
    return (
        <div>
        Uploads 
        <table>
            <tr>
                <th>Index</th>
                <th>Date</th>
                <th>Status</th>
                <th>Rerun</th>
            </tr>
            <tbody>
                {content}
            </tbody>     
        </table>
        </div>
    );
  }