import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import browser from 'webextension-polyfill';
import ArrowRightIcon from '~/icon/bootstrap/arrow-right.svg';
import DownloadIcon from '~/icon/bootstrap/download.svg';
import { Collapse } from '~/lib/component/transition';
import { isValidTimezone, toDatetime } from '~/lib/datetime';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { Hostname, baseURL, hostnames } from '~/lib/settings';
import { saveSettings } from '~/lib/storage/settings';
import { State, actions } from '../store';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <h1>Settings</h1>
        <BaseURL />
        <Timezone />
        <DatetimeFormat />
        <DatetimeFormatSample />
        {process.env.NODE_ENV === 'development' && <DevTools />}
      </div>
      <Commands />
    </>
  );
};

interface SettingsItemProps {
  label: string;
  form: React.ReactElement;
  isUpdated?: boolean;
  errors?: readonly string[];
  description?: React.ReactElement;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  form,
  isUpdated,
  errors,
  description,
}) => {
  return (
    <div className="settings-item">
      <div className="settings-item-input">
        <div
          className={classNames('settings-telomere', {
            updated: isUpdated && !errors?.length,
            invalid: errors?.length,
          })}
        />
        <div className="settings-label">{label}</div>
        <div className="settings-form">{form}</div>
      </div>
      {description !== undefined && description}
      {errors !== undefined && errors.length > 0 && (
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
  const hostname = useSelector(hostnameSelector);
  const isUpdated = useSelector(isHostnameUpdatedSelector);
  const errors = useSelector(hostnameErrorsSelector, shallowEqual);
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
                  onChange={() =>
                    dispatch(actions.settings.updateHostname(host))
                  }
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
  const timezone = useSelector(timezoneSelector);
  const isUpdated = useSelector(isTimezoneUpdatedSelector);
  const errors = useSelector(timezoneErrorsSelector, shallowEqual);
  const dispatch = useDispatch();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.settings.updateTimezone(event.target.value));
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

const DatetimeFormat: React.FC = () => {
  const format = useSelector(datetimeFormatSelector);
  const isUpdated = useSelector(isDatetimeFormatUpdatedSelector);
  const errors = useSelector(datetimeFormatErrorsSelector, shallowEqual);
  const dispatch = useDispatch();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.settings.updateDatetimeFormat(event.target.value));
  };
  return (
    <SettingsItem
      label="Datetime Format"
      form={
        <input
          type="text"
          className="form-control"
          value={format}
          onChange={onChange}
        />
      }
      isUpdated={isUpdated}
      errors={errors}
    />
  );
};

const DatetimeFormatSample: React.FC = () => {
  const timezone = useSelector(timezoneSelector);
  const format = useSelector(datetimeFormatSelector);
  const timestamp = 1330873445; // 2012-03-04T05:06:07Z
  const isoFormatted = toDatetime(timestamp, 'UTC').format(
    'YYYY-MM-DD[T]HH:mm:ss[Z]',
  );
  const customFormatted =
    isValidTimezone(timezone) ?
      toDatetime(timestamp, timezone).format(format)
    : 'Invalid Time Zone';
  return (
    <div className="settings-datetime-format-sample">
      <div>{`${isoFormatted} (ISO 8601)`}</div>
      <ArrowRightIcon
        className="arrow-icon"
        width={undefined}
        height={undefined}
      />
      <div>{customFormatted}</div>
    </div>
  );
};

const DevTools: React.FC = () => {
  return (
    <>
      <h2>Dev Tools</h2>
      <DownloadStorage />
    </>
  );
};

const DownloadStorage: React.FC = () => {
  const onClick = async () => {
    const message: SettingsDownloadStorageMessage = {
      type: 'Settings/DownloadStorage',
    };
    browser.runtime.sendMessage(message);
  };
  return (
    <SettingsItem
      label="Download Storage"
      form={
        <button className="button download-button" onClick={onClick}>
          <DownloadIcon
            className="download-icon"
            width={undefined}
            height={undefined}
          />
          <span>Download Storage</span>
        </button>
      }
    />
  );
};

const Commands: React.FC = () => {
  const ref = React.useRef(null);
  const show = useSelector(showCommandsSelector);
  const dispatch = useDispatch();
  const store = useStore<State>();
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
              onClick={() => dispatch(actions.settings.reset())}>
              Reset editing
            </button>
            <button
              className="button"
              onClick={() => {
                // update store
                dispatch(actions.settings.update());
                // save to storage
                saveSettings(store.getState().settings.current);
              }}>
              Save settings
            </button>
          </div>
        </div>
      }
    />
  );
};

// Selectors
const hostnameSelector = (state: State): Hostname =>
  state.settings.editing.hostname ?? state.settings.current.hostname;

const isHostnameUpdatedSelector = (state: State): boolean =>
  'hostname' in state.settings.editing;

const hostnameErrorsSelector = (state: State): readonly string[] =>
  state.settings.errors.hostname ?? [];

const timezoneSelector = (state: State): string =>
  state.settings.editing.timezone ?? state.settings.current.timezone;

const isTimezoneUpdatedSelector = (state: State): boolean =>
  'timezone' in state.settings.editing;

const timezoneErrorsSelector = (state: State): readonly string[] =>
  state.settings.errors.timezone ?? [];

const datetimeFormatSelector = (state: State): string =>
  state.settings.editing.datetimeFormat ??
  state.settings.current.datetimeFormat;

const isDatetimeFormatUpdatedSelector = (state: State): boolean =>
  'datetimeFormat' in state.settings.editing;

const datetimeFormatErrorsSelector = (state: State): readonly string[] =>
  state.settings.errors.datetimeFormat ?? [];

const showCommandsSelector = (state: State): boolean =>
  Object.keys(state.settings.editing).length > 0;
