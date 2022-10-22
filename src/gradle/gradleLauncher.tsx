import { useState } from "react";
import { launchGradle } from "service/launchUploader";



export default function GradleLauncher(props:any) {
    const [profiles, setProfiles] = useState('');

    const onChange = (event:any) => {
        setProfiles(event.target.value);
      };
    

    const launch =  (e:any,code:number = 1) =>{
        switch (code){
            case 1:
                console.log('e', profiles, code);
                launchGradle(profiles);
                break;
            default:
                console.log('e', e.target.value, code)
        }
    }

    return (
        <>
        <input type="text" id="au" placeholder="Enter Profile Names for Launching" value={profiles} onChange={onChange}></input>&nbsp;
        <button onClick={(e) => launch(e,1)}>Launch Archive-Uploader</button>
        </>
    );
  }