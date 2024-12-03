import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ExecType, invokeFuncBasedOnExecType } from './ExecLauncherUtil';
import UploadDialog from '../pages/UploadCycles/UploadDialog';
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
  multiline1stTf = false,
  multiline2ndTf = false,
  fullWidth = false,
  rows1stTf = 1,
  rows2ndTf = 1,

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

  const funcToInvoke = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget
    setOpenDialog(false);
    setIsLoading(true);
    const _resp = await invokeFuncBasedOnExecType(execType, formData);
    console.log(`_resp ${JSON.stringify(_resp)}`);
    setIsLoading(false);
    setBackendResp(_resp);
    setExecLogsForPopover(<ExecResponsePanel response={_resp} />);
    setAnchorEl(currentTarget);

  }
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setValue('userInput', textBoxOneValue);
  }, [textBoxOneValue, setValue]);


  useEffect(() => {
    setValue('userInputSecond', textBoxTwoValue);
  }, [textBoxTwoValue, setValue]);

  const onSubmit = async (data: ExecComponentFormData) => {
    setOpenDialog(true);
    setFormData(data)
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
              <Button
                variant="contained"
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  //  await findMissingAndSetInPopover(e, row)
                  try {
                    await navigator.clipboard.writeText(JSON.stringify(backendResp));
                    console.log('Text copied to clipboard');
                  } catch (err) {
                    console.error('Failed to copy text: ', err);
                  }
                }
                }
                size="small"
                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                disabled={isLoading}
              >
                Copy Logs
              </Button>
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
            <Typography sx={{ p: 2 }}>{execLogsForPopover}</Typography>
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
        <UploadDialog openDialog={openDialog}
          handleClose={handleClose}
          setOpenDialog={setOpenDialog}
          invokeFuncOnClick={funcToInvoke} />
      </Box>
    </Stack>
  );
};

export default ExecComponent;
