import React from 'react';
import browser from 'webextension-polyfill';
import { SettingsDownloadStorageMessage } from '~/lib/message';

export const Settings: React.FC = () => {
  return (
    <div className="settings fade-in">
      <h1>Settings</h1>
      <DownloadStorage />
    </div>
  );
};

const DownloadStorage: React.FC = () => {
  const onClick = async () => {
    const message: SettingsDownloadStorageMessage = {
      type: 'Settings/DownloadStorage',
    };
    browser.runtime.sendMessage(message);
  };
  return <button onClick={onClick}>Download Storage</button>;
};
