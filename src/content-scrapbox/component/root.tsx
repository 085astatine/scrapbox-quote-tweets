import React from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { App } from '~/app';
import { selectSettings } from '~/app/store/selector';
import TwitterIcon from '~/icon/twitter.svg';
import { XIcon } from '~/lib/component/x-icon';

export const Root: React.FC = () => {
  // redux
  const icon = useSelector(selectSettings.twitterIcon);
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
        {icon === 'twitter' ?
          <TwitterIcon className="kamon" />
        : <XIcon className="kamon" />}
      </div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={close}
        closeTimeoutMS={300}
        bodyOpenClassName={null}
        portalClassName="scrapbox-quote-tweets modal-portal"
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
