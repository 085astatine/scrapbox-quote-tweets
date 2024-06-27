import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import browser from 'webextension-polyfill';
import ArrowRightIcon from '~/icon/bootstrap/arrow-right.svg';
import DownloadIcon from '~/icon/bootstrap/download.svg';
import { Collapse } from '~/lib/component/transition';
import { isValidTimezone, toDatetime } from '~/lib/datetime';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { baseURL, hostnames } from '~/lib/settings';
import { saveSettings } from '~/lib/storage/settings';
import { State, actions } from '../store';
import {
  selectDatetimeFormat,
  selectDatetimeFormatErrors,
  selectEditingDatetimeFormat,
  selectEditingHostname,
  selectEditingTimezone,
  selectHostname,
  selectHostnameErrors,
  selectIsSettingsEdited,
  selectTimezone,
  selectTimezoneErrors,
} from '../store/selector';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <h1>Settings</h1>
        <BaseURL />
        <Timezone />
        <DatetimeFormat />
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
  const currentValue = useSelector(selectHostname);
  const editingValue = useSelector(selectEditingHostname);
  const errors = useSelector(selectHostnameErrors, shallowEqual);
  const dispatch = useDispatch();

  const name = 'settings-hostname';
  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  return (
    <SettingsItem
      label="Base URL"
      form={
        <>
          {hostnames.map((hostname) => {
            const id = `settings-hostname-${hostname}`;
            return (
              <div className="form-check" key={hostname}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={id}
                  name={name}
                  checked={hostname === value}
                  onChange={() =>
                    dispatch(actions.settings.editHostname(hostname))
                  }
                />
                <label
                  className="form-check-label settings-form-label"
                  htmlFor={id}>
                  {baseURL(hostname)}
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
  const currentValue = useSelector(selectTimezone);
  const editingValue = useSelector(selectEditingTimezone);
  const errors = useSelector(selectTimezoneErrors, shallowEqual);
  const dispatch = useDispatch();

  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.settings.editTimezone(event.target.value));
  };
  return (
    <SettingsItem
      label="Time Zone"
      form={
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={onChange}
        />
      }
      isUpdated={isUpdated}
      errors={errors}
      description={
        <div className="settings-item-description">
          Enter the time zone found in the{' '}
          <a
            href="https://www.iana.org/time-zones"
            target="_blink"
            rel="noreferrer">
            IANA database
          </a>
          .
        </div>
      }
    />
  );
};

const DatetimeFormat: React.FC = () => {
  const currentValue = useSelector(selectDatetimeFormat);
  const editingValue = useSelector(selectEditingDatetimeFormat);
  const errors = useSelector(selectDatetimeFormatErrors, shallowEqual);
  const dispatch = useDispatch();

  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(actions.settings.editDatetimeFormat(event.target.value));
  };
  return (
    <SettingsItem
      label="Datetime Format"
      form={
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={onChange}
        />
      }
      isUpdated={isUpdated}
      errors={errors}
      description={
        <>
          <div className="settings-item-description">
            Enter the{' '}
            <a
              href="https://day.js.org/docs/en/display/format"
              target="_blink"
              rel="noreferrer">
              Day.js Format
            </a>
            .
          </div>
          <DatetimeFormatSample />
        </>
      }
    />
  );
};

const DatetimeFormatSample: React.FC = () => {
  const currentTimezone = useSelector(selectTimezone);
  const editingTimezone = useSelector(selectEditingTimezone);
  const currentFormat = useSelector(selectDatetimeFormat);
  const editingFormat = useSelector(selectEditingDatetimeFormat);

  const timezone = editingTimezone ?? currentTimezone;
  const format = editingFormat ?? currentFormat;
  const [timestamp] = React.useState(Math.trunc(Date.now() / 1000));
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
  const show = useSelector(selectIsSettingsEdited);
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
              onClick={() => dispatch(actions.settings.resetEdits())}>
              Reset editing
            </button>
            <button
              className="button"
              onClick={() => {
                // update store
                dispatch(actions.settings.applyEdits());
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
