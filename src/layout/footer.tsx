export default function EgangotriFooter(props:any) {
    
const footer = `{
    margin-top:calc(5% + 60px);
    bottom: 0;
  }`
    return (
        <div className={footer}>
        {props.title}
        </div>
    );
  }