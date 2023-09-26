// RowComponent.tsx
import React, { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { launchBulkRename, launchGradleMoveToFreeze, launchReverseMove, launchUploader, loginToArchive } from 'service/launchGradle';
import { ExecType } from './ExecLauncher';

type FormData = {
  userInput: string;
};

type Props = {
  placeholder?: string;
  buttonText?: string;
  execType?: number;
};

const ExecComponent: React.FC<Props> = ({ placeholder = 'Comma Separated Profile Codes', buttonText = 'Click me', execType = undefined }) => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const dataUserInput = data.userInput;
    console.log(`data.userInput ${dataUserInput}`);
    let _resp = {}

    switch (execType) {
      case ExecType.UploadPdfs:
        _resp = await launchUploader(dataUserInput);
        break;
      case ExecType.ReverseMove:
        _resp = await launchGradleMoveToFreeze(dataUserInput);
        break;
      case ExecType.MoveFolderContents:
        _resp = await launchReverseMove(dataUserInput);
        break;
      case ExecType.LoginToArchive:
        _resp = await loginToArchive(dataUserInput);
        break;
      case ExecType.UseBulkRenameConventions:
        _resp = await launchBulkRename(dataUserInput);
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
          helperText={errors.userInput?.message} />
        <Button variant="contained" color="primary" type="submit">
          {buttonText}
        </Button>
      </form>
    </Box>
  );
};

export default ExecComponent;
