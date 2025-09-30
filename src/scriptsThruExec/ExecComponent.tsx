import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ExecType, invokeFuncBasedOnExecType } from './ExecLauncherUtil';
import ConfirmDialog from '../widgets/ConfirmDialog';
import Spinner from '../widgets/Spinner';
import { Popover, Typography, Stack, Tooltip } from '@mui/material';
import ExecResponsePanel from './ExecResponsePanel';
import { ExecComponentFormData, ExecComponentProps } from './types';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InfoIconWithTooltip from 'widgets/InfoIconWithTooltip';

const ExecComponent: React.FC<ExecComponentProps> = ({
  placeholder = 'Comma Separated Profile Codes',
  buttonText = 'Click me',
  execType = ExecType.LoginToArchive,
  secondTextBoxPlaceHolder = "",
  thirdTextBoxPlaceHolder = "",
  thirdTextBoxDefaultValue = "",
  reactComponent = <></>,
  thirdButton = <></>,
  css = {},
  css2 = {},
  css3 = {},
  userInputOneInfo = "",
  userInputTwoInfoNonMandatory: userInputTwoInfo = "",
  userInputThreeInfoNonMandatory: userInputThreeInfo = "",
  secondComponentRequired = true,
  textBoxOneValue = "",
  textBoxTwoValue = "",
  textBoxThreeValue = "",
  multiline1stTf = false,
  multiline2ndTf = false,
  multiline3rdTf = false,
  rows1stTf = 1,
  rows2ndTf = 1,
  onInputChange

}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ExecComponentFormData>();
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [formData, setFormData] = React.useState<ExecComponentFormData>({} as ExecComponentFormData);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [execLogsForPopover, setExecLogsForPopover] = React.useState(<></>);

  const [backendResp, setBackendResp] = React.useState({});

  const formatResponse = (resp: any): string => {
    const date = new Date().toLocaleString();
    let result = 'Backend Resp ' + execType + '\n\n';
    result += `date: ${date}\n`;

    const formatObject = (obj: any, indent: string = ''): string => {
      let output = '';
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          output += `${indent}${key}:\n`;
          value.forEach((item) => {
            if (typeof item === 'object') {
              output += formatObject(item, indent + '  ');
            } else {
              output += `${indent}  ${item}\n`;
            }
          });
        } else if (value && typeof value === 'object') {
          output += `${indent}${key}:\n${formatObject(value, indent + '  ')}`;
        } else {
          output += `${indent}${key}: ${value}\n`;
        }
      }
      return output;
    };

    return result + formatObject(resp);
  };

  const funcToInvoke = async (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    const currentTarget = event.currentTarget
    setOpenDialog(false);
    setIsLoading(true);
    const _resp = await invokeFuncBasedOnExecType(execType, formData);
    console.log(`_resp ${JSON.stringify(_resp)}`);
    setIsLoading(false);
    setBackendResp(_resp);
    setExecLogsForPopover(<ExecResponsePanel response={_resp} execType={execType}/>);
    setAnchorEl(currentTarget as HTMLButtonElement);
  }
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setValue('userInput', textBoxOneValue);
  }, [textBoxOneValue, setValue]);


  useEffect(() => {
    setValue('userInputSecond', textBoxTwoValue);
  }, [textBoxTwoValue, setValue]);

  useEffect(() => {
    setValue('userInputThird', textBoxThreeValue);
  }, [textBoxThreeValue, setValue]);

  const onSubmit = async (data: ExecComponentFormData) => {
    setOpenDialog(true);
    setFormData(data)
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onInputChange) {
      onInputChange(event.target.value);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={4} mb={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={"row"}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TextField variant="outlined"
                placeholder={placeholder}
                {...register('userInput', { required: "This field is required" })}
                error={Boolean(errors.userInput)}
                sx={{ marginRight: "30px", marginBottom: "20px", ...css }}
                helperText={errors.userInput?.message}
                rows={rows1stTf}
                multiline={multiline1stTf}
                onChange={handleInputChange}
              />
              {userInputOneInfo && <InfoIconWithTooltip input={userInputOneInfo} />
              }
            </Box>
            {isLoading && <Spinner />}
          </Stack>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            sx={{
              width: '80%', // Reduce width by 20%
              height: '80%', // Reduce height by 20%
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Box sx={{
              p: 2,
              width: '80%', // Reduce width by 20%
              height: '10%', // Reduce height by 20%
            }}>
            <Typography sx={{ p: 2 }}>{execLogsForPopover}</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Popover>

          {secondTextBoxPlaceHolder?.length > 0 ?
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <TextField variant="outlined"
                placeholder={secondTextBoxPlaceHolder}
                {...register('userInputSecond', secondComponentRequired === true ? { required: "This field is required" } : {})}
                error={Boolean(errors.userInputSecond)}
                sx={{ marginRight: "30px", width: "250px", ...css2 }}
                helperText={errors.userInputSecond?.message}
                rows={rows2ndTf}
                multiline={multiline2ndTf}
                fullWidth
                onChange={handleInputChange} // Call the callback function on input change
              />

              {userInputTwoInfo && <InfoIconWithTooltip input={userInputTwoInfo} />}
            </Box>
            : null
          }

          {thirdTextBoxPlaceHolder?.length > 0 ?
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>

              <TextField variant="outlined"
                placeholder={thirdTextBoxPlaceHolder}
                {...register('userInputThird')}
                error={Boolean(errors.userInputThird)}
                defaultValue={thirdTextBoxDefaultValue || ""}
                sx={{ marginTop: "30px", width: "250px", ...css3 }}
                helperText={errors.userInputThird?.message} />
              {userInputThreeInfo && <InfoIconWithTooltip input={userInputThreeInfo} />}
            </Box>
            : null
          }

          {reactComponent}
          <Box sx={{ marginTop: "10px" }}>
            <Button variant="contained" color="primary" type="submit" sx={{ marginRight: "10px", marginBottom: "10px" }}>
              {buttonText}
            </Button>
            <Button variant="contained" color="primary" type="reset" onClick={() => reset()} sx={{ marginRight: "10px", marginBottom: "10px" }}>
              Reset
            </Button>
            {thirdButton}
          </Box>
        </form>
        <ConfirmDialog openDialog={openDialog}
          handleClose={handleClose}
          setOpenDialog={setOpenDialog}
          invokeFuncOnClick={funcToInvoke} />
      </Box>
    </Stack>
  );
};

export default ExecComponent;
