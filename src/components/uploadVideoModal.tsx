import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { VideoPreview } from './videoPreview';
import { uploadVideo2 } from '../services/apiService';



const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "75%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const sampleVideoData = {
  videoUrl:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  mimeType: 'video/mp4',
  file: null,
};

interface IVideoData {
  videoUrl: string
  mimeType: string
  file?: File
}


export default function UploadVideoModal({isOpen, setIsOpen}){
  const [videoData, setVideoData] = useState<IVideoData>({videoUrl:'', mimeType: '', file: null});

  const onFileChange = (ev) => {
    console.log("file change", ev);
    const file = ev && ev.target && ev.target.files[0];
    console.log("file", file);
    const url = URL.createObjectURL(file);
    console.log("url:", url);
    setVideoData({videoUrl: url, mimeType: file.type, file});
  };

  const handleSubmit = async() => {
    console.log("got handleSubmit");
    // uploadVideo
    uploadVideo2({
      models: "Passenger",
      fps: 25,
      orientation: 'right',
      file: videoData.file,
    }, (msg, data) => console.log("uploading...?", msg, data));

  };

  return <Modal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Upload Video
      </Typography>
      <VideoPreview videoUrl={videoData.videoUrl} mimeType={videoData.mimeType}/>
      {/* <form onSubmit={() => handleSubmit()}> */}
        <TextField type="file" label="" variant="outlined" onChange={onFileChange}/>
        <Button variant="contained" type="submit" onClick={handleSubmit}>Upload</Button>
      {/* </form> */}
    </Box>
  </Modal>
}