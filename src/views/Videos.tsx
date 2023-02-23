import React, { useState } from 'react';
import { LeftPanelLayout } from '../components/mainLayout';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { uploadVideo } from '../services/apiService';
import { VideoPreview } from '../components/videoPreview';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IVideoData {
  videoUrl: string
  mimeType: string
}

//"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
const sampleVideoData = {
  videoUrl:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  mimeType: 'video/mp4'
}

export default function Videos(){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<IVideoData>({videoUrl:'', mimeType: ''});
  const handleSubmit = async() => {
    // uploadVideo
  };
  const onFileChange = (ev) => {
    console.log("file change", ev);
    const file = ev && ev.target && ev.target.files[0];
    console.log("file", file);
    const url = URL.createObjectURL(file);
    console.log("url:", url);
    setVideoData({videoUrl: url, mimeType: file.type});
  };

  console.log("rerender?");

  return <>
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Upload Video
        </Typography>
        <VideoPreview videoUrl={videoData.videoUrl} mimeType={videoData.mimeType}/>
        <form onSubmit={handleSubmit}>
          <TextField type="file" label="" variant="outlined" onChange={onFileChange}/>
          <Button variant="contained" type="submit">Upload</Button>
        </form>
      </Box>
    </Modal>
    <LeftPanelLayout
      mainPageContents={
        <>
          <div>Videos</div>
          
          <div><button onClick={() => setIsModalOpen(true)}>Upload video</button></div>
        </>
      }
    />
    </>;
  
}