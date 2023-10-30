// RowComponent.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ExecType, invokeFuncBasedOnExecType } from './util';
import UploadDialog from '../pages/UploadCycles/UploadDialog';

const ExecComponent: React.FC<ExecComponentProps> = ({
  placeholder = 'Comma Separated Profile Codes',
  buttonText = 'Click me',
  execType = ExecType.LoginToArchive,
  secondTextBox = false,
  secondTextBoxPlaceHolder = "",
}) => {

  const { register, handleSubmit, formState: { errors } } = useForm<ExecComponentFormData>();
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [formData, setFormData] = React.useState<ExecComponentFormData>({} as ExecComponentFormData);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const funcToInvoke = () => {
    setOpenDialog(false);
    const _resp = invokeFuncBasedOnExecType(execType, formData);
    console.log(`_resp ${JSON.stringify(_resp)}`);
  }

  const onSubmit = async (data: ExecComponentFormData) => {
    setOpenDialog(true);
    setFormData(data)
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
        {secondTextBoxPlaceHolder?.length > 0 ?
          <TextField variant="outlined"
            placeholder={secondTextBoxPlaceHolder}
            {...register('userInputSecond', { required: "This field is required" })}
            error={Boolean(errors.userInputSecond)}
            sx={{ paddingRight: "30px", width: "250px" }}
            helperText={errors.userInputSecond?.message} />
          : null
        }
        <Button variant="contained" color="primary" type="submit">
          {buttonText}
        </Button>
      </form>
      <UploadDialog openDialog={openDialog}
        handleClose={handleClose}
        setOpenDialog={setOpenDialog}
        invokeFuncOnClick2={funcToInvoke} />
    </Box>
  );
};

export default ExecComponent;
