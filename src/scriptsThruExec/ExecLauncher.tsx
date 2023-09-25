import React from 'react';
import { useState } from "react";
import { launchGradleMoveToFreeze } from "service/launchGradle";
import ExecComponent from './ExecComponent';


const ExecLauncher: React.FC = () => {

    return (
        <div>
            <ExecComponent buttonText="Upload Pdfs for Profile" />
            <ExecComponent buttonText="Reverse Move (Python)" />
            <ExecComponent buttonText="Move Folder Contents" placeholder='Move QA-Passed-to-Pipeline' />
            <ExecComponent buttonText="Use Bulk Rename Conventions" placeholder='Use Bulk Rename Conventions' />
        </div>
    );
}

export default ExecLauncher;
