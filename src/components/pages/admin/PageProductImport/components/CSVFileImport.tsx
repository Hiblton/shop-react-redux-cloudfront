import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { useMutation } from 'react-query';

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFileToServer = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    try {
      const response = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: window.localStorage.getItem('authorization_token') ? "Basic " + window.localStorage.getItem('authorization_token') : ''
        },
        params: {
          name: encodeURIComponent(file!.name),
        },
      });

      console.log("File to upload: ", file!.name);
      console.log("Uploading to: ", response.data);

      const result = await axios({
        method: "PUT",
        url: response.data?.url,
        data: file,
      });

      console.log("Result: ", result);

      return result;
    } catch (error) {
      throw error;
    }
  };

  const { mutate: uploadFile } = useMutation(
    () => uploadFileToServer(),
    {
      onSuccess: () => {
        console.log("File upload successful");
        setFile(undefined);
      }
    }
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={() => uploadFile()}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
