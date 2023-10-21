// RowComponent.tsx
import React, { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { launchGoogleDriveDownload, launchBulkRename, launchGradleMoveToFreeze, launchReverseMove, launchUploader, loginToArchive } from 'service/launchGradle';
import { ExecType } from './ExecLauncher';

type FormData = {
  userInput: string;
  userInputSecond ?: string;
};

type Props = {
  placeholder?: string;
  buttonText?: string;
  execType?: number;
  secondTextBox?: boolean;
  secondTextBoxPlaceHolder ?: string; 
};

const ExecComponent: React.FC<Props> = ({
  placeholder = 'Comma Separated Profile Codes',
  buttonText = 'Click me',
  execType = undefined,
  secondTextBox = false,
  secondTextBoxPlaceHolder = "",
}) => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const dataUserInput = data.userInput;
    console.log(`data.userInput ${dataUserInput}`);
    let _resp = {}

    switch (execType) {
      case ExecType.UploadPdfs:
        _resp = await launchUploader(dataUserInput);
        break;
      case ExecType.MoveFolderContents:
        _resp = await launchGradleMoveToFreeze(dataUserInput);
        break;
      case ExecType.ReverseMove:
        _resp = await launchReverseMove(dataUserInput);
        break;
      case ExecType.LoginToArchive:
        _resp = await loginToArchive(dataUserInput);
        break;
      case ExecType.UseBulkRenameConventions:
        _resp = await launchBulkRename(dataUserInput);
        break;
      case ExecType.DownloadGoogleDriveLink:
        const dataUserInput2 = data.userInputSecond || "";
        _resp = await launchGoogleDriveDownload(dataUserInput,dataUserInput2);
        break;
      default:
        // Handle unknown execType value
        break;
    }
    console.log(`_resp ${JSON.stringify(_resp)}`);
  };

  return (
    <Box display="flex" alignItems="center" gap={4} mb={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="outlined"
          placeholder={placeholder}
          {...register('userInput', { required: "This field is required" })}
          error={Boolean(errors.userInput)}
          sx={{ paddingRight: "30px" }}
          helperText={errors.userInput?.message} />
        {secondTextBoxPlaceHolder?.length>0 ?
          <TextField variant="outlined"
            placeholder={secondTextBoxPlaceHolder}
            {...register('userInputSecond', { required: "This field is required" })}
            error={Boolean(errors.userInputSecond)}
            sx={{ paddingRight: "30px",width:"250px" }}
            helperText={errors.userInputSecond?.message} />
            : null
        }
        <Button variant="contained" color="primary" type="submit">
          {buttonText}
        </Button>
      </form>
    </Box>
  );
};

export default ExecComponent;
