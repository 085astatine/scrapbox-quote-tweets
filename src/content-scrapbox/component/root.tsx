import React from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { App } from '~/app';
import TwitterIcon from '~/icon/twitter.svg';

export const Root: React.FC = () => {
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
        onRequestClose={close}
        closeTimeoutMS={300}
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
        <App />
      </ReactModal>
    </>
  );
};
