import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Paper } from '@mui/material';
import { ReactNode } from 'react';

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

interface IModalBasicProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: ReactNode
}

export default function ModalBasic({isOpen, setIsOpen, children}: IModalBasicProps) {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          { children }
        </Paper>
      </Modal>
    </div>
  );
}