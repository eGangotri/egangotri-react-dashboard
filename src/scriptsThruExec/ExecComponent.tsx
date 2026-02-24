import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ExecType, invokeFuncBasedOnExecType } from './ExecLauncherUtil';
import ConfirmDialog from '../widgets/ConfirmDialog';
import Spinner from '../widgets/Spinner';
import { Stack, Tooltip } from '@mui/material';
import ExecResponsePanel from './ExecResponsePanel';
import { ExecComponentFormData, ExecComponentProps } from './types';
import InfoIconWithTooltip from 'widgets/InfoIconWithTooltip';
import ExecPopover from './ExecPopover';

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
  onInputChange,
  onInputChangeSecond,
  onCompleted,
  validationPattern,
  validationMessage,
  confirmDialogMsg = "Do you want to proceed?"

}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ExecComponentFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [formData, setFormData] = React.useState<ExecComponentFormData>({} as ExecComponentFormData);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [execLogsForPopover, setExecLogsForPopover] = React.useState(<></>);

  const [backendResp, setBackendResp] = React.useState({});

  // const formatResponse = (resp: any): string => {
  //   const date = new Date().toLocaleString();
  //   let result = 'Backend Resp ' + execType + '\n\n';
  //   result += `date: ${date}\n`;

  //   const formatObject = (obj: any, indent: string = ''): string => {
  //     let output = '';
  //     for (const [key, value] of Object.entries(obj)) {
  //       if (Array.isArray(value)) {
  //         output += `${indent}${key}:\n`;
  //         value.forEach((item) => {
  //           if (typeof item === 'object') {
  //             output += formatObject(item, indent + '  ');
  //           } else {
  //             output += `${indent}  ${item}\n`;
  //           }
  //         });
  //       } else if (value && typeof value === 'object') {
  //         output += `${indent}${key}:\n${formatObject(value, indent + '  ')}`;
  //       } else {
  //         output += `${indent}${key}: ${value}\n`;
  //       }
  //     }
  //     return output;
  //   };

  //   return result + formatObject(resp);
  // };

  const funcToInvoke = async (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    try {
      const currentTarget = event.currentTarget
      setOpenDialog(false);
      setIsLoading(true);
      const _resp = await invokeFuncBasedOnExecType(execType, formData);
      console.log(`_resp ${JSON.stringify(_resp)}`);
      setIsLoading(false);
      setBackendResp(_resp);
      setExecLogsForPopover(<ExecResponsePanel response={_resp} execType={execType} />);
      setAnchorEl(currentTarget as HTMLButtonElement);
      if (onCompleted) {
        onCompleted(_resp);
      }
    }
    catch (error) {
      console.error(error);
      setIsLoading(false);
    }
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

  const handleInputChangeSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onInputChangeSecond) {
      onInputChangeSecond(event.target.value);
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
                {...register('userInput', {
                  required: "This field is required",
                  validate: (value) => {
                    if (validationPattern && !validationPattern.test(value)) {
                      return validationMessage || "Invalid input";
                    }
                    return true;
                  },
                  onChange: handleInputChange
                })}
                error={Boolean(errors.userInput)}
                sx={{
                  marginRight: "30px",
                  marginBottom: "20px",
                  ...css,
                  backgroundColor: errors.userInput ? '#ffcdd2' : undefined
                }}
                helperText={errors.userInput?.message}
                rows={rows1stTf}
                multiline={multiline1stTf}
              />
              {userInputOneInfo && <InfoIconWithTooltip input={userInputOneInfo} />
              }
            </Box>
            {isLoading && <Spinner />}
          </Stack>
          <ExecPopover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
            {execLogsForPopover}
          </ExecPopover>

          {secondTextBoxPlaceHolder?.length > 0 ?
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <TextField variant="outlined"
                placeholder={secondTextBoxPlaceHolder}
                {...register('userInputSecond', secondComponentRequired === true ? {
                  required: "This field is required",
                  onChange: handleInputChangeSecond
                } : {
                  onChange: handleInputChangeSecond
                })}
                error={Boolean(errors.userInputSecond)}
                sx={{ marginRight: "30px", width: "250px", ...css2 }}
                helperText={errors.userInputSecond?.message}
                rows={rows2ndTf}
                multiline={multiline2ndTf}
                fullWidth
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
          invokeFuncOnClick={funcToInvoke}
          confirmDialogMsg={confirmDialogMsg} />
      </Box>
    </Stack>
  );
};

export default ExecComponent;
