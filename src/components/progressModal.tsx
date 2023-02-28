
import * as React from 'react';
import { useState, useEffect }  from 'react';
import { Modal, Typography } from '@mui/material';
import { CircularProgressWithLabel } from './progressCircular';
import { EventHandler } from '../utils/EventHandler';


const divStyle = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

interface IProgressModalProps {
  isOpen: boolean, 
  setIsOpen: (isOpen: boolean) => void, 
  progressEventHandler: EventHandler<number>
}

export default function ProgressModal({isOpen, setIsOpen, progressEventHandler}: IProgressModalProps){
  console.log("rerendered modal");
  const [value, setValue] = useState(0);
  useEffect(()=>{
    const subscription = progressEventHandler.addEventListener((percent) => {
      setValue(percent);
    });
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return <Modal 
      open={isOpen} 
      onClose={() => setIsOpen(false)}
    >
      <div style={divStyle}>
        <Typography style={{ color: "white"}}>
          Upload in Progress. Please wait....
        </Typography>
        <p/>
        <CircularProgressWithLabel value={value}/>
      </div>
    </Modal>;
}