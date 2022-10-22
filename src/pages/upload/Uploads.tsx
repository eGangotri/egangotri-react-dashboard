import Item from "model/Item";
import Upload from "pages/upload/Upload";
import { getServer } from '../../utils/constants';

export default function Uploads(props: any) {
    console.log(`props ${JSON.stringify(props)} ${props.items.length}`);
    console.log(`Services Backend Server is ${getServer()}`)
    const content = props && props.items && props.items.length > 0 ? props?.items?.map((item: Item) => {
        console.log(`item ${item}`);
        return <Upload item={item} />
    }
    ) : "";

    return (
        <div>
            Uploads
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>ArchiveProfile</th>
                        <th>Upload Link</th>
                        <th>Local Path</th>
                        <th>Title</th>
                        <th>Csv Name</th>
                        <th>Upload CycleId</th>
                        <th>datetimeUploadStarted</th>
                        <th>createdAt</th>
                        <th>Rerun</th>
                    </tr>
                </thead>
                <tbody>
                    {content}
                </tbody>
            </table>
        </div>
    );
}