import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import browser from 'webextension-polyfill';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { baseURL, hostnames } from '~/lib/settings';
import { State, actions } from '../store';

export const Settings: React.FC = () => {
  return (
    <div className="settings fade-in">
      <h1>Settings</h1>
      <BaseURL />
      <DownloadStorage />
    </div>
  );
};

const BaseURL: React.FC = () => {
  const name = 'settings-hostname';
  const hostnameSelector = React.useCallback(
    (state: State) => state.settingsEditing.hostname ?? state.settings.hostname,
    [],
  );
  const isUpdatedSelector = React.useCallback(
    (state: State) => 'hostname' in state.settingsEditing,
    [],
  );
  const hostname = useSelector(hostnameSelector);
  const isUpdated = useSelector(isUpdatedSelector);
  const dispatch = useDispatch();
  return (
    <div className="settings-row">
      <div className={classNames('settings-label', { updated: isUpdated })}>
        Base URL
      </div>
      <div className="settings-buttons">
        {hostnames.map((host) => {
          const id = `settings-hostname-${host}`;
          return (
            <div className="form-check" key={host}>
              <input
                type="radio"
                className="form-check-input"
                id={id}
                name={name}
                checked={host === hostname}
                onChange={() => dispatch(actions.updateHostname(host))}
              />
              <label
                className="form-check-label settings-form-label"
                htmlFor={id}>
                {baseURL(host)}
              </label>
            </div>
          );
        })}
      </div>
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
