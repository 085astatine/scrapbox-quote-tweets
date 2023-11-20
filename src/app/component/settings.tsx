import React from 'react';
import browser from 'webextension-polyfill';

export const Settings: React.FC = () => {
  return (
    <div className="fade-in">
      <h1>Settings</h1>
      <DownloadStorage />
    </div>
  );
};

const DownloadStorage: React.FC = () => {
  const onClick = async () => {
    const data = await browser.storage.local.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scrapbox-copy-tweets.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return <button onClick={onClick}>Download Storage</button>;
};
