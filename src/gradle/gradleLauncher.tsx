import React from 'react';
import { useState } from "react";
import { launchGradleMoveToFreeze } from "service/launchUploader";


const GradleLauncher: React.FC = () => {
    const [profiles, setProfiles] = useState('');

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setProfiles(event.target.value);
      };
    

    const launch =  (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,code = 1) =>{
        switch (code){
            case 1:
                console.log('e', profiles, code);
                launchGradleMoveToFreeze(profiles);
                break;
            default:
                console.log('e', e.currentTarget.value, code)
        }
    }

    return (
        <>
        <input type="text" id="au" placeholder="Enter Profile Names for Launching" value={profiles} onChange={onChange}></input>&nbsp;
        <button onClick={(e) => launch(e,1)}>Launch Archive-Uploader</button>
        </>
    );
  }

  export default GradleLauncher;
