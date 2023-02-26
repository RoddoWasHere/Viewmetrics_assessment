import React, { useRef, useEffect } from 'react';
import { useLocalStore } from '../utils/localStore';
import styled from '@emotion/styled';
import ProgressCircular from './progressCircular';


const VideoOverlayRel = styled.div`
  position: relative;
  // background: red;
`;

const VideoOverlayContainer = styled.div`
  position: absolute;
  background: #ffffff88; 
  /* background: #00000088; */
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1;
  width: 100%;
`;



export function localFileToUrl(file: File){
  ;
}

export function VideoPreview({videoUrl, mimeType}){
  const videoRef = useRef();
  console.log("video props", videoUrl, mimeType);

  const loadVideo = () => {
    console.log("video load", videoRef, videoRef.current.load);
    videoRef && videoRef.current && videoRef.current.load();
  }
  videoRef && videoRef.current && loadVideo();

  useEffect(()=>{
    console.log("video ref", videoRef, videoRef.current.load);
    // videoRef && videoRef.current && videoRef.current.load();
    loadVideo();
  }, [])

  return (
    <VideoOverlayRel>
      {/* <VideoOverlayContainer> */}
        {/* <ProgressCircular value={50}/> */}
      {/* </VideoOverlayContainer> */}
      <video style={{width: "100%"}} onChange={()=>console.log()} ref={videoRef} controls width="250">
        <source src={videoUrl} type={mimeType}/>
      </video>
    </VideoOverlayRel>
    );
}

/* 
    <source src="/media/cc0-videos/flower.mp4" type="video/mp4">

    Download the
    <a href="/media/cc0-videos/flower.webm">WEBM</a>
    or
    <a href="/media/cc0-videos/flower.mp4">MP4</a>
    video. */