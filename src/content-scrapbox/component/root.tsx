import React from 'react';
import ReactModal from 'react-modal';
import TwitterIcon from '~/icon/twitter.svg';

export const Root = () => {
  // state
  const [isOpen, setIsOpen] = React.useState(false);
  // open
  const open = () => {
    // Set aria-hidden="true" to <div id="app-container">
    ReactModal.setAppElement('#app-container');
    setIsOpen(true);
  };
  // close
  const close = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="tool-btn" role="button" onClick={open}>
        <TwitterIcon className="kamon" />
      </div>
      <ReactModal
        isOpen={isOpen}
        bodyOpenClassName={null}
        portalClassName="scrapbox-copy-tweets modal-portal"
        className={{
          base: 'content',
          afterOpen: 'after-open',
          beforeClose: 'before-close',
        }}
        overlayClassName={{
          base: 'overlay',
          afterOpen: 'after-open',
          beforeClose: 'before-close',
        }}>
        <Modal close={close} />
      </ReactModal>
    </>
  );
};

interface ModalProps {
  close: () => void;
}

const Modal: React.FC<ModalProps> = ({ close }) => {
  return (
    <div>
      <h1>Modal Test</h1>
      <button className="btn btn-danger" onClick={close}>
        close
      </button>
    </div>
  );
};
