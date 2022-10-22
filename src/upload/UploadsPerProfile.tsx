import UploadPerProfile from "./UploadPerProfile";

export default function UploadsPerProfile(props: any) {
    console.log(`props ${JSON.stringify(props)} ${props.items.length}`);
    const head =                 
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
    </thead>;
    const content = props && props.items && props.items.length > 0 ? props?.items?.map((item: any) =>
        {
            console.log(`item ${item}`);

            item.map((val:any, key:any) => { 
                return <div> {key}:
                    <table>
                        {head}
                        <tbody>
                           <UploadPerProfile profileData={val} />
                        </tbody>
                    </table>
                   </div> 
            });
        }
    ) : "";

    return (
        <div>
            Uploads
            {content}
        </div>
    );
}