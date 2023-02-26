import React, { useState } from 'react';
import { LeftPanelLayout } from '../components/mainLayout';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { uploadVideo, uploadVideo2 } from '../services/apiService';
import { VideoPreview } from '../components/videoPreview';
import { useLocalStore } from '../utils/localStore';
import ProgressModal from '../components/progressModal';
import UploadVideoModal from '../components/uploadVideoModal';
import { EventHandler } from '../utils/EventHandler';
import ModalBasic from '../components/modalBasic';
import styled from '@emotion/styled';


const ConfirmModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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

interface IVideoData {
  videoUrl: string
  mimeType: string
}

//"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
const sampleVideoData = {
  videoUrl:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  mimeType: 'video/mp4',
  file: null,
}

export default function Videos(){
  const localStore = useLocalStore();
  console.log("local store", localStore, localStore.a.get());
  let onProgressChange = (percent) => {};
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  
  const [videoData, setVideoData] = useState<IVideoData>({videoUrl:'', mimeType: '', file: null});
  const [progressEventHandler] = useState(new EventHandler<number>());



  const handleSubmit = async() => {
    console.log("got handleSubmit");
    // uploadVideo
    setIsProgressModalOpen(true);

    uploadVideo2(
      {
        models: "Passenger",
        fps: 25,
        orientation: 'right',
        file: videoData.file,
      }, 
      // (msg, data) => console.log("uploading...?", msg, data),
      (percent: number) => { progressEventHandler.emitEvent(percent); },
      (data: any) => { //onCompleted
        setIsProgressModalOpen(false);
        setIsConfirmModalOpen(true); 
        setConfirmModalMessage("Upload completed successfully"); 
      },
      (error: string) => {//onError
        setIsProgressModalOpen(false); 
        setIsConfirmModalOpen(true); 
        setConfirmModalMessage("Upload failed: " + error); 
      },
    );
    //TODO: show status pop up...

  };
  const onFileChange = (ev) => {
    console.log("file change", ev);
    const file = ev && ev.target && ev.target.files[0];
    console.log("file", file);
    const url = URL.createObjectURL(file);
    console.log("url:", url);
    setVideoData({videoUrl: url, mimeType: file.type, file});
  };

  console.log("rerender?");

  // const ProgressModalTp = ({isOpen, setIsOpen}) => {
  //   const [uploadProgress, setUploadProgress] = useState(0);
  //   onProgressChange = (percent) => {
  //     console.log("got progress update", percent);
  //     setUploadProgress(percent);
  //   };
  //   console.log("progress rerender?", uploadProgress)
  //   return <ProgressModal isOpen={isOpen} setIsOpen={setIsOpen}/>

  // };

  return <>
    <ProgressModal isOpen={isProgressModalOpen} setIsOpen={setIsProgressModalOpen} progressEventHandler={progressEventHandler}/>
    <ModalBasic isOpen={isConfirmModalOpen}>
      <ConfirmModalContainer>
        <Typography>
          { confirmModalMessage }
        </Typography>
        <p></p>
        <Button onClick={()=>setIsConfirmModalOpen(false)} variant="contained">
          Ok
        </Button>
      </ConfirmModalContainer>
    </ModalBasic>
    {/* <UploadVideoModal isOpen={isModalOpen}setIsOpen={setIsModalOpen}/> */}
    {/* <Modal
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
          <TextField type="file" label="" variant="outlined" onChange={onFileChange}/>
          <Button variant="contained" type="submit" onClick={handleSubmit}>Upload</Button>
      </Box>
    </Modal> */}
    <LeftPanelLayout
      mainPageContents={
        <>
          {/* <div>Videos</div>
          <div>(Store?: { localStore.a.get()})</div>
          <Button onClick={() => localStore.a.set("new val")}>Set Store value</Button>
          <div><button onClick={() => setIsModalOpen(true)}>Upload video</button></div> */}
          <div style={{ width: "100%"}}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Upload Video
            </Typography>
            <VideoPreview videoUrl={videoData.videoUrl} mimeType={videoData.mimeType}/>
              <TextField type="file" label="" variant="outlined" onChange={onFileChange}/>
              <Button disabled={!videoData.file} variant="contained" type="submit" onClick={handleSubmit}>Upload</Button>
          </div>
        </>
      }
    />
    </>;
  
}