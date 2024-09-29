import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { makePostCallWithErrorHandling } from 'service/BackendFetchService';

const RenamePdfs: React.FC = () => {
    const { control, handleSubmit, register } = useForm();

    const onSubmit = async (data: any) => {
        console.log(`data ${JSON.stringify(data)}`);
        try {
            const result = await makePostCallWithErrorHandling(data,"pdfRename/rename");
            console.log('Success:', JSON.stringify(result));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="row" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', height: '100%' }}>
            <Box display="flex" flexWrap="wrap" gap={2} flex="1">
                <Box flex="0 0 30%">
                    <TextField label="Original PDF Name" fullWidth {...register('originalPdfName')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Title" fullWidth {...register('title')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Author" fullWidth {...register('author')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Publisher" fullWidth {...register('publisher')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Year" fullWidth {...register('year')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <FormControl fullWidth>
                        <InputLabel id="era-label">Era</InputLabel>
                        <Controller
                            name="era"
                            control={control}
                            render={({ field }) => (
                                <Select labelId="era-label" {...field}>
                                    <MenuItem value="AH">AH</MenuItem>
                                    <MenuItem value="CE">CE</MenuItem>
                                    <MenuItem value="Vikrami">Vikrami</MenuItem>
                                    <MenuItem value="Shaka">Shaka</MenuItem>
                                    <MenuItem value="Bangabda">Bangabda</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Editor" fullWidth {...register('editor')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Commentator" fullWidth {...register('commentator')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Translator" fullWidth {...register('translator')} />
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <FormControl fullWidth>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <Select labelId="language-label" {...field}>
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Hindi">Hindi</MenuItem>
                                    <MenuItem value="Sanskrit">Sanskrit</MenuItem>
                                    <MenuItem value="Kannada">Kannada</MenuItem>
                                    <MenuItem value="Telugu">Telugu</MenuItem>
                                    <MenuItem value="Urdu">Urdu</MenuItem>
                                    <MenuItem value="Persian">Persian</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Box>
                <Box flex="0 0 10%" />
                <Box flex="0 0 30%">
                    <TextField label="Other Language" fullWidth {...register('otherLanguage')} />
                </Box>
                <Box flex="0 0 8%" />
                <Box mt={2}>
                    <Button type="submit" variant="contained">Submit</Button>
                </Box>
            </Box>
            <Box flex="0 0 36%" height="50%">
                {/* This div takes at least 50% of the form's height and 40% of the width */}
                <div style={{ height: '100%', width: '100%', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="src\assets\images\logo.svg" alt="Display" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                </div>
            </Box>
        </Box>
    );
};

export default RenamePdfs;