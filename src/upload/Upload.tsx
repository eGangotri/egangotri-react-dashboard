export default function Upload(props:any) {
    return (
        <>
        <tr>
            <td>
            {props.item.id}
            </td>
            <td>
            {props.item.date}
            </td>
            <td>
            {props.item.status}
            </td>
            <td>
            <button>Run Item # {props.item.id}</button>
            </td>
        </tr>
        </>
    );
  }