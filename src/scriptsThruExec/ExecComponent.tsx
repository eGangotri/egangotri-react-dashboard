// RowComponent.tsx
import React, { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { launchUploader } from 'service/launchGradle';

type FormData = {
  userInput: string;
};

const onSubmit = (data: FormData) => {
  console.log(data.userInput);
}

type Props = {
  placeholder?: string;
  buttonText?: string;
};

const ExecComponent: React.FC<Props> = ({ placeholder = 'Comma Separated Profile Codes', buttonText = 'Click me' }) => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data.userInput);
    const _resp = await launchUploader(data.userInput)
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
