import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import browser from 'webextension-polyfill';
import { Collapse } from '~/lib/component/transition';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { baseURL, hostnames } from '~/lib/settings';
import { State, actions } from '../store';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <h1>Settings</h1>
        <BaseURL />
        <Timezone />
        <DownloadStorage />
      </div>
      <Commands />
    </>
  );
};

interface SettingsItemProps {
  label: string;
  form: React.ReactElement;
  isUpdated: boolean;
  errors: string[];
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  form,
  isUpdated,
  errors,
}) => {
  return (
    <div className="settings-item">
      <div className="settings-item-input">
        <div
          className={classNames('settings-telomere', {
            updated: isUpdated && !errors.length,
            invalid: errors.length,
          })}
        />
        <div className="settings-label">{label}</div>
        <div className="settings-form">{form}</div>
      </div>
      {errors.length > 0 && (
        <div className="settings-item-errors">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
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
  const errorsSelector = React.useCallback(
    (state: State) => state.settingsErrors.hostname ?? [],
    [],
  );
  const hostname = useSelector(hostnameSelector);
  const isUpdated = useSelector(isUpdatedSelector);
  const errors = useSelector(errorsSelector, shallowEqual);
  const dispatch = useDispatch();
  return (
    <SettingsItem
      label="Base URL"
      form={
        <>
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
        </>
      }
      isUpdated={isUpdated}
      errors={errors}
    />
  );
};

const Timezone: React.FC = () => {
  const timezoneSelector = React.useCallback(
    (state: State) => state.settingsEditing.timezone ?? state.settings.timezone,
    [],
  );
  const isUpdatedSelector = React.useCallback(
    (state: State) => 'timezone' in state.settingsEditing,
    [],
  );
  const errorsSelector = React.useCallback(
    (state: State) => state.settingsErrors.timezone ?? [],
    [],
  );
  const timezone = useSelector(timezoneSelector);
  const isUpdated = useSelector(isUpdatedSelector);
  const errors = useSelector(errorsSelector, shallowEqual);
  const dispatch = useDispatch();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.updateTimezone(event.target.value));
  };
  return (
    <SettingsItem
      label="Time Zone"
      form={
        <input
          type="text"
          className="form-control"
          value={timezone}
          onChange={onChange}
        />
      }
      isUpdated={isUpdated}
      errors={errors}
    />
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

const Commands: React.FC = () => {
  const ref = React.useRef(null);
  const selector = React.useCallback(
    (state: State) => Object.keys(state.settingsEditing).length > 0,
    [],
  );
  const show = useSelector(selector);
  const dispatch = useDispatch();
  return (
    <Collapse
      nodeRef={ref}
      in={show}
      duration={300}
      mountOnEnter
      unmountOnExit
      target={
        <div ref={ref}>
          <div className="settings-commands fade-in">
            <button
              className="button"
              onClick={() => dispatch(actions.resetEditingSettings())}>
              Reset editing
            </button>
            <button
              className="button"
              onClick={() => dispatch(actions.updateSettings())}>
              Save settings
            </button>
          </div>
        </div>
      }
    />
  );
};
