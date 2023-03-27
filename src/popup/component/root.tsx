import React from 'react';
import { Button } from 'react-bootstrap';
import browser from 'webextension-polyfill';

export const Root: React.FC = () => {
  return (
    <div>
      <h1>Popup</h1>
      <div className="d-grid gap-1">
        <OpenClipboardButton />
        <CloseAllClipboardsButton />
        <OpenOptionsButton />
      </div>
    </div>
  );
};

const OpenClipboardButton = () => {
  const onClick = () => {
    browser.runtime.sendMessage({ type: 'Clipboard/OpenRequest' });
  };
  return <Button onClick={onClick}>Open Clipboard</Button>;
};

const CloseAllClipboardsButton = () => {
  const onClick = () => {
    browser.runtime.sendMessage({ type: 'Clipboard/CloseAllRequest' });
  };
  return <Button onClick={onClick}>All Close Clipboard</Button>;
};

const OpenOptionsButton = () => {
  const onClick = () => {
    browser.runtime.openOptionsPage();
  };
  return <Button onClick={onClick}>Open Options</Button>;
};
