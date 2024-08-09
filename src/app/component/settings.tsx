import {
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import browser from 'webextension-polyfill';
import ArrowRightIcon from '~/icon/bootstrap/arrow-right.svg';
import ChevronDownIcon from '~/icon/bootstrap/chevron-down.svg';
import ChevronUpIcon from '~/icon/bootstrap/chevron-up.svg';
import DownloadIcon from '~/icon/bootstrap/download.svg';
import CloseIcon from '~/icon/bootstrap/x.svg';
import { Collapse } from '~/lib/component/transition';
import { isValidTimezone, toDatetime } from '~/lib/datetime';
import { SettingsDownloadStorageMessage } from '~/lib/message';
import { baseURL, hostnames } from '~/lib/settings';
import { saveSettings } from '~/lib/storage/settings';
import {
  type TextTemplateKey,
  textTemplateFields,
} from '~/lib/tweet/tweet-template';
import { type State, actions } from '../store';
import {
  type EditStatus,
  selectDatetimeFormat,
  selectDatetimeFormatErrors,
  selectEditingDatetimeFormat,
  selectEditingHostname,
  selectEditingTemplate,
  selectEditingTimezone,
  selectHostname,
  selectHostnameErrors,
  selectIsSettingsEdited,
  selectSettingsEditStatus,
  selectSettingsUpdateTrigger,
  selectTemplate,
  selectTemplateEditStatus,
  selectTemplateEntitiesEditStatus,
  selectTemplateError,
  selectTemplateMediaEditStatus,
  selectTimezone,
  selectTimezoneErrors,
} from '../store/selector';
import { Checkbox } from './checkbox';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <UpdateNotification />
        <SettingsEditor />
        <TemplateEditor />
        {process.env.NODE_ENV === 'development' && <DevTools />}
      </div>
      <Commands />
    </>
  );
};

const SettingsEditor: React.FC = () => {
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const editStatus = useSelector(selectSettingsEditStatus);

  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
  return (
    <>
      <div className="settings-editor-headerline">
        <Telomere status={editStatus} />
        <button
          className="button settings-editor-header-1"
          onClick={() => setIsOpen((open) => !open)}>
          Settings
          <Icon className="expand-icon" width={undefined} height={undefined} />
        </button>
      </div>
      <Collapse
        nodeRef={ref}
        in={isOpen}
        duration={300}
        mountOnEnter
        unmountOnExit
        target={
          <div ref={ref}>
            <BaseURL />
            <Timezone />
            <DatetimeFormat />
          </div>
        }
      />
    </>
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

const TemplateEditor: React.FC = () => {
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const editStatus = useSelector(selectTemplateEditStatus);

  const textTemplates: TextTemplateProps[] = [
    { type: 'tweet', name: 'Tweet Body' },
    { type: 'footer', name: 'Tweet Footer' },
  ] as const;
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
  return (
    <>
      <div className="settings-editor-headerline">
        <Telomere status={editStatus} />
        <button
          className="button settings-editor-header-1"
          onClick={() => setIsOpen((open) => !open)}>
          Template
          <Icon className="expand-icon" width={undefined} height={undefined} />
        </button>
      </div>
      <Collapse
        nodeRef={ref}
        in={isOpen}
        duration={300}
        mountOnEnter
        unmountOnExit
        target={
          <div ref={ref}>
            {textTemplates.map(({ type, name }) => (
              <TextTemplate key={type} type={type} name={name} />
            ))}
            <TemplateEntityEditor />
            <TemplateMediaEditor />
            <TemplateQuote />
          </div>
        }
      />
    </>
  );
};

const TemplateEntityEditor: React.FC = () => {
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const editStatus = useSelector(selectTemplateEntitiesEditStatus);

  const textTemplates: TextTemplateProps[] = [
    { type: 'entityText', name: 'Entity: Text' },
    { type: 'entityUrl', name: 'Entity: URL' },
    { type: 'entityHashtag', name: 'Entity: Hashtag' },
    { type: 'entityCashtag', name: 'Entity: Cashtag' },
    { type: 'entityMention', name: 'Entity: Mention' },
  ] as const;
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
  return (
    <>
      <div className="settings-editor-headerline">
        <Telomere status={editStatus} />
        <button
          className="button settings-editor-header-3"
          onClick={() => setIsOpen((open) => !open)}>
          Entity
          <Icon className="expand-icon" width={undefined} height={undefined} />
        </button>
      </div>
      <Collapse
        nodeRef={ref}
        in={isOpen}
        duration={300}
        mountOnEnter
        unmountOnExit
        target={
          <div ref={ref}>
            {textTemplates.map(({ type, name }) => (
              <TextTemplate key={type} type={type} name={name} />
            ))}
          </div>
        }
      />
    </>
  );
};

const TemplateMediaEditor: React.FC = () => {
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const editStatus = useSelector(selectTemplateMediaEditStatus);

  const textTemplates: TextTemplateProps[] = [
    { type: 'mediaPhoto', name: 'Media: Photo' },
    { type: 'mediaVideo', name: 'Media: Video' },
  ] as const;
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
  return (
    <>
      <div className="settings-editor-headerline">
        <Telomere status={editStatus} />
        <button
          className="button settings-editor-header-3"
          onClick={() => setIsOpen((open) => !open)}>
          Media
          <Icon className="expand-icon" width={undefined} height={undefined} />
        </button>
      </div>
      <Collapse
        nodeRef={ref}
        in={isOpen}
        duration={300}
        mountOnEnter
        unmountOnExit
        target={
          <div ref={ref}>
            {textTemplates.map(({ type, name }) => (
              <TextTemplate key={type} type={type} name={name} />
            ))}
          </div>
        }
      />
    </>
  );
};

const TemplateQuote: React.FC = () => {
  const selectCurrent = React.useCallback(
    (state: State) => selectTemplate(state, 'quote'),
    [],
  );
  const selectEditing = React.useCallback(
    (state: State) => selectEditingTemplate(state, 'quote'),
    [],
  );
  const selectError = React.useCallback(
    (state: State) => selectTemplateError(state, 'quote'),
    [],
  );
  const current = useSelector(selectCurrent);
  const editing = useSelector(selectEditing);
  const error = useSelector(selectError, shallowEqual);
  const dispatch = useDispatch();

  const value = editing ?? current;
  const isUpdated = editing !== undefined;
  const onClick = (): void => {
    dispatch(actions.settings.editTemplate({ type: 'quote', value: !value }));
  };
  return (
    <SettingsItem
      label="Quote"
      form={
        <Checkbox checked={value} id="tweet-template-quote" onClick={onClick} />
      }
      isUpdated={isUpdated}
      errors={error}
      description={
        <div className="settings-item-description">
          Add a <code>&gt;</code> to the beginning of each line.
        </div>
      }
    />
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
        <button
          className="button button-primary download-button"
          onClick={onClick}>
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
          <div className="commands fade-in">
            <button
              className="command button button-primary"
              onClick={() => dispatch(actions.settings.resetEdits())}>
              Reset editing
            </button>
            <button
              className="command button button-primary"
              onClick={() => {
                // update store
                dispatch(actions.settings.applyEdits());
                // save to storage
                const state = store.getState().settings;
                if (Object.keys(state.settingsErrors).length === 0) {
                  saveSettings(state.currentSettings);
                }
              }}>
              Save settings
            </button>
          </div>
        </div>
      }
    />
  );
};

const UpdateNotification: React.FC = () => {
  const ref = React.useRef(null);
  const trigger = useSelector(selectSettingsUpdateTrigger);
  const dispatch = useDispatch();
  return (
    <Collapse
      nodeRef={ref}
      in={trigger === 'interrupt'}
      duration={300}
      mountOnEnter
      unmountOnExit
      target={
        <div ref={ref}>
          <div className="settings-update-notification">
            Settings have been updated from other tabs
            <button
              className="close"
              onClick={() => dispatch(actions.settings.resetUpdateTrigger())}>
              <CloseIcon
                className="close-icon"
                height={undefined}
                width={undefined}
              />
            </button>
          </div>
        </div>
      }
    />
  );
};

// utilities
const editStatus = (
  isUpdated?: boolean,
  error?: readonly string[],
): EditStatus => {
  return (
    error?.length ? 'invalid'
    : isUpdated ? 'updated'
    : 'none'
  );
};

type TelomereProps = {
  status?: EditStatus;
};

const Telomere: React.FC<TelomereProps> = ({ status }) => {
  return (
    <div
      className={classNames('settings-telomere', {
        updated: status === 'updated',
        invalid: status === 'invalid',
      })}
    />
  );
};

type SettingsItemProps = {
  label: string;
  form: React.ReactElement;
  isUpdated?: boolean;
  errors?: readonly string[];
  description?: React.ReactElement;
};

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
        <Telomere status={editStatus(isUpdated, errors)} />
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

type TextTemplateProps = {
  type: TextTemplateKey;
  name: string;
};

const TextTemplate: React.FC<TextTemplateProps> = ({ type, name }) => {
  const selectCurrent = React.useCallback(
    (state: State) => selectTemplate(state, type),
    [type],
  );
  const selectEditing = React.useCallback(
    (state: State) => selectEditingTemplate(state, type),
    [type],
  );
  const selectError = React.useCallback(
    (state: State) => selectTemplateError(state, type),
    [type],
  );
  const current = useSelector(selectCurrent);
  const editing = useSelector(selectEditing);
  const error = useSelector(selectError, shallowEqual);
  const dispatch = useDispatch();

  const value = editing ?? current;
  const isUpdated = editing !== undefined;
  const fields = textTemplateFields[type];
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch(
      actions.settings.editTemplate({ type, value: event.target.value }),
    );
  };
  const addPlaceholder = (field: string) => {
    dispatch(
      actions.settings.editTemplate({ type, value: `${value}$\{${field}}` }),
    );
  };
  return (
    <div className="settings-item">
      <div className="settings-item-input">
        <Telomere status={editStatus(isUpdated, error)} />
        <div className="settings-label">{name}</div>
        <Placeholders fields={fields} onSelect={addPlaceholder} />
      </div>
      <textarea
        className="text-template-input"
        value={value}
        onChange={onChange}
        wrap="off"
        rows={value.split('\n').length}
      />
      {error !== undefined && error.length > 0 && (
        <div className="settings-item-errors">
          {error.map((text, index) => (
            <div key={index}>{text}</div>
          ))}
        </div>
      )}
    </div>
  );
};

type PlaceholdersProps = {
  fields: readonly string[];
  onSelect: (field: string) => void;
};

const Placeholders: React.FC<PlaceholdersProps> = ({ fields, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  // floating-ui
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift()],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  return (
    <>
      <button
        className="button button-secondary placeholders-button"
        ref={refs.setReference}
        {...getReferenceProps()}>
        placeholders
        <ChevronDownIcon
          className="placeholders-button-icon"
          width={undefined}
          height={undefined}
        />
      </button>
      {isOpen && (
        <div
          className="floating-menu button-group-vertical"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}>
          {fields.map((field) => (
            <button
              className="button button-outline-secondary"
              key={field}
              onClick={() => {
                onSelect(field);
                setIsOpen(false);
              }}>
              {field}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
