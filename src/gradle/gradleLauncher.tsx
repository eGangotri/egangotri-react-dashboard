export default function GradleLauncher(props:any) {
    const launch = (e:any,code:number = 1) =>{
        switch (code){
            case 1:
                const profiles = document.getElementById("au")
                console.log('e', profiles, code);
                break;
            default:
                console.log('e', e.target.value, code)
        }
    }

    return (
        <>
        <input type="text" id="au" placeholder="Enter Profile Names for Launching"></input>&nbsp;
        <button onClick={(e) => launch(e,1)}>Launch Archive-Uploader</button>
        </>
    );
  }