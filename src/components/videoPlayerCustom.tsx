import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButtonCustom } from './customComponents';


const VideoOverlayRel = styled.div`
  position: relative;
  background: black;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
`;

const VideoOverlayContainer = styled.div`
  position: absolute;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;


let timer: any;
let intervalMs: number = 100;
function startTimer(callback: () => void){
  timer = setInterval(callback, intervalMs);
}
function stopTimer(){
  timer && clearInterval(timer);
}

function minuteSecondsFormat(value: number) {
  const intValue = Math.round(value);
  const secsInt = intValue % 60;
  const min = (intValue-secsInt)/60;
  const secsStr = `${secsInt}`.padStart(2, '0');
  return `${min}:${secsStr}`;
}


interface IVideoPlayerCustomProps {
  videoUrl: string
  mimeType: string
}
interface IPlayPauseToggleButtonProps {
  onClick: () => void
}

export function VideoPlayerCustom({videoUrl, mimeType}: IVideoPlayerCustomProps){
  const videoRef = useRef<HTMLVideoElement>();

  let setSeekPosition = (v) => {};
  let setDuration = (v) => {};
  let setIsPlayingExt = (v) => {};

  const videoElem: HTMLVideoElement | null = videoRef.current;

  const loadVideo = () => {
    const vidElem: HTMLVideoElement = videoRef && videoRef.current;
    vidElem && vidElem.load();
    vidElem.onloadeddata = () => { 
      setDuration && setDuration(vidElem.duration);
    };
  }
  videoRef && videoRef.current && loadVideo();

  useEffect(()=>{
    console.log("video ref", videoRef, videoRef?.current?.load);
    // window.videoElem = videoRef?.current;
    loadVideo();
    return () => { stopTimer(); }
  }, [])

  const Progress = () => { //FC
    const [seekPos, setSeekPos] = useState(0);//percent
    const [progressDuration, setProgressDuration] = useState(0);//percent
    
    useEffect(()=>{ 
      setSeekPosition = setSeekPos;
      setDuration = setProgressDuration;
    }, []);
    
    return <Slider
      onChange={(e, v)=>{
        setSeekPos(v); 
        if(videoElem){ 
          videoElem.currentTime = v;
        }
      }}
      value={seekPos}
      max={progressDuration}
      valueLabelFormat={minuteSecondsFormat}
      step={0.01}
      aria-label="Default"
      valueLabelDisplay="auto"
    />
  };

  
  const PlayPauseToggleButton = ({onClick}: IPlayPauseToggleButtonProps) => { //FC
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(()=>{ 
      setIsPlayingExt = setIsPlaying;
    }, []);
    return <div>
      <IconButtonCustom contrast>
        { isPlaying ? <PauseIcon onClick={onClick}/> : <PlayArrowIcon onClick={onClick}/>} 
      </IconButtonCustom>
    </div>;
  };

  if(videoElem){
    const timerCallback = () => {setSeekPosition && setSeekPosition(videoElem.currentTime); };
    videoElem.onplay = () => { setIsPlayingExt(true); startTimer(timerCallback) };
    videoElem.onpause = () => { setIsPlayingExt(false) ;stopTimer() };
  }

  const playOrPause = () => {
    if(videoElem?.paused){
      videoElem?.play();
    }else{
      videoElem?.pause();
    }
  };

  return (<>
    <VideoOverlayRel>
      <VideoOverlayContainer>
        <ControlsContainer>
          <PlayPauseToggleButton onClick={playOrPause}/>
          <span style={{ width: "10px"}}>{" "}</span>
          <Progress/>
        </ControlsContainer>
      </VideoOverlayContainer>
      <video style={{width: "100%", maxWidth: "120vh"}} onChange={()=>console.log()} ref={videoRef} width="250">
        <source src={videoUrl} type={mimeType}/>
      </video>
    </VideoOverlayRel>
    </>);
}