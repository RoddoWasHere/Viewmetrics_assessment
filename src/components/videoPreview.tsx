import React, { useRef, useEffect } from 'react';


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

  return (<video style={{width: "100%"}} onChange={()=>console.log()} ref={videoRef} controls width="250">
    <source src={videoUrl} type={mimeType}/>
  </video>);
}

/* 
    <source src="/media/cc0-videos/flower.mp4" type="video/mp4">

    Download the
    <a href="/media/cc0-videos/flower.webm">WEBM</a>
    or
    <a href="/media/cc0-videos/flower.mp4">MP4</a>
    video. */