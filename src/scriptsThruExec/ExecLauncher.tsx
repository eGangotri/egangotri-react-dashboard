import React from 'react';
import { useState } from "react";
import { launchGradleMoveToFreeze } from "service/launchGradle";
import ExecComponent from './ExecComponent';


const ExecLauncher: React.FC = () => {
    const [profiles, setProfiles] = useState('');

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfiles(event.target.value);
    };


    const launch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, code = 1) => {
        switch (code) {
            case 1:
                console.log('e', profiles, code);
                launchGradleMoveToFreeze(profiles);
                break;
            default:
                console.log('e', e.currentTarget.value, code)
        }
    }

    return (
        // <>
        // <input type="text" id="au" placeholder= value={profiles} onChange={onChange}></input>&nbsp;
        // <button onClick={(e) => launch(e,1)}>Launch Archive-Uploader</button>
        // </>
        <div>
            <ExecComponent buttonText="Upload Pdfs for Profile" />
            <ExecComponent buttonText="Reverse Move (Python)"/>
            <ExecComponent buttonText="Move Folder Contents" placeholder='Move QA-Passed-to-Pipeline'/>
            <ExecComponent buttonText="Use Bulk Rename Conventions" placeholder='Use Bulk Rename Conventions'/>
        </div>
    );
}

export default ExecLauncher;
