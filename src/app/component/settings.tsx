import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import browser from 'webextension-polyfill';
import ArrowRightIcon from '~/icon/bootstrap/arrow-right.svg';
import { Collapse } from '~/lib/component/transition';
import { InvalidTimezoneError, toDatetime } from '~/lib/datetime';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { Hostname, baseURL, hostnames } from '~/lib/settings';
import { State, actions } from '../store';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <h1>Settings</h1>
        <BaseURL />
        <Timezone />
        <DatetimeFormat />
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
  errors: readonly string[];
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
            updated: isUpdated && !errors.length,
            invalid: errors.length,
          })}
        />
        <div className="settings-label">{label}</div>
        <div className="settings-form">{form}</div>
      </div>
      {description !== undefined && description}
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
  const timezone = useSelector(timezoneSelector);
  const isUpdated = useSelector(isTimezoneUpdatedSelector);
  const errors = useSelector(timezoneErrorsSelector, shallowEqual);
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

const DatetimeFormat: React.FC = () => {
  const format = useSelector(datetimeFormatSelector);
  const timezone = useSelector(timezoneSelector);
  const isUpdated = useSelector(isDatetimeFormatUpdatedSelector);
  const errors = useSelector(datetimeFormatErrorsSelector, shallowEqual);
  const dispatch = useDispatch();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.updateDatetimeFormat(event.target.value));
  };
  const sampleTimestamp = 1330873445; // 2012-03-04T05:06:07Z
  const sampleISO = toDatetime(sampleTimestamp, 'UTC').format(
    'YYYY-MM-DD[T]HH:mm:ss[Z]',
  );
  const sampleFormatted = (() => {
    try {
      return toDatetime(sampleTimestamp, timezone).format(format);
    } catch (error: unknown) {
      if (error instanceof InvalidTimezoneError) {
        return 'Invalid Time Zone';
      }
      return 'Unknown Error';
    }
  })();
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
      description={
        <div className="settings-datetime-format-description">
          <div>{`${sampleISO} (ISO 8601)`}</div>
          <ArrowRightIcon
            className="arrow-icon"
            width={undefined}
            height={undefined}
          />
          <div>{sampleFormatted}</div>
        </div>
      }
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
  const show = useSelector(showCommandsSelector);
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

// Selectors
const hostnameSelector = (state: State): Hostname =>
  state.settingsEditing.hostname ?? state.settings.hostname;

const isHostnameUpdatedSelector = (state: State): boolean =>
  'hostname' in state.settingsEditing;

const hostnameErrorsSelector = (state: State): readonly string[] =>
  state.settingsErrors.hostname ?? [];

const timezoneSelector = (state: State): string =>
  state.settingsEditing.timezone ?? state.settings.timezone;

const isTimezoneUpdatedSelector = (state: State): boolean =>
  'timezone' in state.settingsEditing;

const timezoneErrorsSelector = (state: State): readonly string[] =>
  state.settingsErrors.timezone ?? [];

const datetimeFormatSelector = (state: State): string =>
  state.settingsEditing.datetimeFormat ?? state.settings.datetimeFormat;

const isDatetimeFormatUpdatedSelector = (state: State): boolean =>
  'datetimeFormat' in state.settingsEditing;

const datetimeFormatErrorsSelector = (state: State): readonly string[] =>
  state.settingsErrors.datetimeFormat ?? [];

const showCommandsSelector = (state: State): boolean =>
  Object.keys(state.settingsEditing).length > 0;
