import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ExecType, invokeFuncBasedOnExecType } from './util';
import UploadDialog from '../pages/UploadCycles/UploadDialog';
import Spinner from '../widgets/Spinner';
import { Popover, Typography, Stack } from '@mui/material';
import ExecResponsePanel from './ExecResponsePanel';
import { ExecComponentFormData, ExecComponentProps } from './types';

const ExecComponent: React.FC<ExecComponentProps> = ({
  placeholder = 'Comma Separated Profile Codes',
  buttonText = 'Click me',
  execType = ExecType.LoginToArchive,
  secondTextBox = false,
  secondTextBoxPlaceHolder = "",
  reactComponent = <></>
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExecComponentFormData>();
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [formData, setFormData] = React.useState<ExecComponentFormData>({} as ExecComponentFormData);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [execLogsForPopover, setExecLogsForPopover] = React.useState(<></>);

  const funcToInvoke = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget
    setOpenDialog(false);
    setIsLoading(true);
    const _resp = await invokeFuncBasedOnExecType(execType, formData);
    console.log(`_resp ${JSON.stringify(_resp)}`);
    setIsLoading(false);

    setExecLogsForPopover(<ExecResponsePanel response={_resp} />);
    setAnchorEl(currentTarget);

  }
  const id = open ? 'simple-popover' : undefined;

  const onSubmit = async (data: ExecComponentFormData) => {
    setOpenDialog(true);
    setFormData(data)
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={4} mb={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={"row"}>
            <TextField variant="outlined"
              placeholder={placeholder}
              {...register('userInput', { required: "This field is required" })}
              error={Boolean(errors.userInput)}
              sx={{ paddingRight: "30px", paddingBottom: "20px", width: "200%"  }}
              helperText={errors.userInput?.message} />
            {isLoading && <Spinner />}
          </Stack>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          ><Typography sx={{ p: 2 }}>{execLogsForPopover}</Typography>
          </Popover>


          {secondTextBoxPlaceHolder?.length > 0 ?
            <TextField variant="outlined"
              placeholder={secondTextBoxPlaceHolder}
              {...register('userInputSecond', { required: "This field is required" })}
              error={Boolean(errors.userInputSecond)}
              sx={{ paddingRight: "30px", width: "250px" }}
              helperText={errors.userInputSecond?.message} />
            : null
          }
          
          {reactComponent}
          <Button variant="contained" color="primary" type="submit" sx={{marginRight:"10px"}}>
            {buttonText}
          </Button>
          <Button variant="contained" color="primary" type="reset" onClick={()=>reset()}>
            Reset
          </Button>
        </form>
        <UploadDialog openDialog={openDialog}
          handleClose={handleClose}
          setOpenDialog={setOpenDialog}
          invokeFuncOnClick={funcToInvoke} />
      </Box>
    </Stack>
  );
};

export default ExecComponent;
