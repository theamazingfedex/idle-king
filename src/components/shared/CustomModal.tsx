import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './CustomModal.css';

export type CustomModalProps = {
  isOpen?: boolean
  onAfterOpen?: ([k]?:any) => any
  onRequestClose?: ([k]?:any) => any
  wrapperStyle?: any
  modalStyle?: any
  contentLabel?: string
  classname: string
  children: React.ReactNode[]
  parentElementId: string
}

function CustomModal(props: CustomModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onRequestClose = useCallback(() => {
    props.onRequestClose && props.onRequestClose();
    setIsModalOpen(false);
  }, [props]);
  useEffect(() => {
    Modal.setAppElement(props.parentElementId);
  }, [props.parentElementId]);

  return (
    <div className={`${props.classname}`}>
      <span onClick={() => setIsModalOpen(true)}>
        {props.children[0]}
      </span>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={props.onAfterOpen}
        onRequestClose={onRequestClose}
        style={props.modalStyle}
        contentLabel={props.contentLabel}
        className={`Modal ${props.classname}-inner-modal`}
        overlayClassName={`Overlay ${props.classname}-modal-overlay`}
      >
        {props.children.slice(1)}
      </Modal>
    </div>
  )
}

export default CustomModal;