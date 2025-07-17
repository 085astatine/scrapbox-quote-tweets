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
import UploadIcon from '~/icon/bootstrap/upload.svg';
import CloseIcon from '~/icon/bootstrap/x.svg';
import DeleteIcon from '~/icon/google-fonts/delete-forever.svg';
import ScrapboxIcon from '~/icon/scrapbox.svg';
import TwitterIcon from '~/icon/twitter.svg';
import { Collapse } from '~/lib/component/transition';
import { XIcon } from '~/lib/component/x-icon';
import { isValidTimezone, toDatetime } from '~/lib/datetime';
import type { StorageDownloadMessage } from '~/lib/message';
import {
  baseURL,
  hostnames,
  scrapboxIcons,
  twitterIcons,
} from '~/lib/settings';
import { clearStorage } from '~/lib/storage';
import { saveSettings } from '~/lib/storage/settings';
import { saveTweetTemplate } from '~/lib/storage/tweet-template';
import type { Storage as StorageJSON } from '~/lib/storage/types';
import { validateStorage } from '~/lib/storage/validate';
import {
  type TextTemplateKey,
  textTemplateFields,
} from '~/lib/tweet/tweet-template';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { JSONSchemaValidationError } from '~/validate-json/error';
import { type State, actions } from '../store';
import {
  type EditStatus,
  selectEditingSettings,
  selectEditingTemplate,
  selectIsSettingsEdited,
  selectSettings,
  selectSettingsEditStatus,
  selectSettingsError,
  selectSettingsUpdateTrigger,
  selectTemplate,
  selectTemplateEditStatus,
  selectTemplateEntitiesEditStatus,
  selectTemplateError,
  selectTemplateMediaEditStatus,
} from '../store/selector';
import { Checkbox } from './checkbox';

export const Settings: React.FC = () => {
  return (
    <>
      <div className="settings fade-in">
        <UpdateNotification />
        <SettingsEditor />
        <TemplateEditor />
        <Storage />
      </div>
      <Commands />
    </>
  );
};

const SettingsEditor: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
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
            <ScrapboxIcons />
            <TwitterIcons />
          </div>
        }
      />
    </>
  );
};

const BaseURL: React.FC = () => {
  const currentValue = useSelector(selectSettings.hostname);
  const editingValue = useSelector(selectEditingSettings.hostname);
  const errors = useSelector(selectSettingsError.hostname, shallowEqual);
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
                    dispatch(
                      actions.settings.editSettings({
                        type: 'hostname',
                        value: hostname,
                      }),
                    )
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
  const currentValue = useSelector(selectSettings.timezone);
  const editingValue = useSelector(selectEditingSettings.timezone);
  const errors = useSelector(selectSettingsError.timezone, shallowEqual);
  const dispatch = useDispatch();

  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      actions.settings.editSettings({
        type: 'timezone',
        value: event.target.value,
      }),
    );
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
  const currentValue = useSelector(selectSettings.datetimeFormat);
  const editingValue = useSelector(selectEditingSettings.datetimeFormat);
  const errors = useSelector(selectSettingsError.datetimeFormat, shallowEqual);
  const dispatch = useDispatch();

  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      actions.settings.editSettings({
        type: 'datetimeFormat',
        value: event.target.value,
      }),
    );
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
  const currentTimezone = useSelector(selectSettings.timezone);
  const editingTimezone = useSelector(selectEditingSettings.timezone);
  const currentFormat = useSelector(selectSettings.datetimeFormat);
  const editingFormat = useSelector(selectEditingSettings.datetimeFormat);

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

const ScrapboxIcons: React.FC = () => {
  const currentValue = useSelector(selectSettings.scrapboxIcon);
  const editingValue = useSelector(selectEditingSettings.scrapboxIcon);
  const dispatch = useDispatch();

  const name = 'settings-scrapboxicon';
  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  return (
    <SettingsItem
      label="Scrapbox Icon"
      form={
        <>
          {scrapboxIcons.map((icon) => {
            const id = `${name}-${icon}`;
            return (
              <div className="settings-select-icon" key={icon}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={id}
                  name={name}
                  checked={icon === value}
                  onChange={() =>
                    dispatch(
                      actions.settings.editSettings({
                        type: 'scrapboxIcon',
                        value: icon,
                      }),
                    )
                  }
                />
                <label htmlFor={id}>
                  {icon === 'scrapbox' ?
                    <ScrapboxIcon
                      className="sample-icon"
                      width={undefined}
                      height={undefined}
                    />
                  : <div className="cosense-icon sample-icon">
                      <img
                        src={browser.runtime.getURL('cosense.png')}
                        alt="Cosense Icon"
                      />
                    </div>
                  }
                  {`${icon.charAt(0).toUpperCase()}${icon.slice(1)}`}
                </label>
              </div>
            );
          })}
        </>
      }
      isUpdated={isUpdated}
    />
  );
};

const TwitterIcons: React.FC = () => {
  const currentValue = useSelector(selectSettings.twitterIcon);
  const editingValue = useSelector(selectEditingSettings.twitterIcon);
  const dispatch = useDispatch();

  const name = 'settings-twittericon';
  const value = editingValue ?? currentValue;
  const isUpdated = editingValue !== undefined;
  return (
    <SettingsItem
      label="Twitter Icon"
      form={
        <>
          {twitterIcons.map((icon) => {
            const id = `${name}-${icon}`;
            return (
              <div className="settings-select-icon" key={icon}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={id}
                  name={name}
                  checked={icon === value}
                  onChange={() =>
                    dispatch(
                      actions.settings.editSettings({
                        type: 'twitterIcon',
                        value: icon,
                      }),
                    )
                  }
                />
                <label htmlFor={id}>
                  {icon === 'twitter' ?
                    <TwitterIcon
                      className="sample-icon"
                      width={undefined}
                      height={undefined}
                    />
                  : <XIcon className="sample-icon" />}
                  {`${icon.charAt(0).toUpperCase()}${icon.slice(1)}`}
                </label>
              </div>
            );
          })}
        </>
      }
      isUpdated={isUpdated}
    />
  );
};

const TemplateEditor: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
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
  const ref = React.useRef<HTMLDivElement>(null);
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
  const ref = React.useRef<HTMLDivElement>(null);
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
  const current = useSelector(selectTemplate.quote);
  const editing = useSelector(selectEditingTemplate.quote);
  const error = useSelector(selectTemplateError.quote, shallowEqual);
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

const Storage: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
  return (
    <>
      <div className="settings-editor-headerline">
        <button
          className="button settings-editor-header-1"
          onClick={() => setIsOpen((open) => !open)}>
          Storage
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
            <DownloadStorage />
            <ClearStorage />
            <LoadStorage />
          </div>
        }
      />
    </>
  );
};

const DownloadStorage: React.FC = () => {
  const onClick = async () => {
    // create object URL
    const data = await browser.storage.local.get();
    const blob = new Blob([JSON.stringify(data, null, 2), '\n'], {
      type: 'application/json',
    });
    const objectURL = await URL.createObjectURL(blob);
    // send message
    const message: StorageDownloadMessage = {
      type: 'Storage/Download',
      objectURL,
      filename: `scrapbox-quote-tweets-${toDatetime().format('YYYY-MM-DD')}.json`,
    };
    await browser.runtime.sendMessage(message);
    // revoke object URL
    URL.revokeObjectURL(objectURL);
  };
  return (
    <StorageItem
      label="Download Storage"
      form={
        <button className="button button-primary icon-button" onClick={onClick}>
          <DownloadIcon className="icon" width={undefined} height={undefined} />
          <span>Download Storage</span>
        </button>
      }
    />
  );
};

const ClearStorage: React.FC = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const onClick = async () => {
    await clearStorage();
    setIsEnabled(false);
  };
  return (
    <StorageItem
      label="Clear Storage"
      form={
        <div className="clear-buttons">
          <Checkbox
            checked={isEnabled}
            onClick={() => setIsEnabled((isEnabled) => !isEnabled)}
          />
          <button
            className="button button-primary icon-button"
            disabled={!isEnabled}
            onClick={onClick}>
            <DeleteIcon
              className="icon"
              viewBox={trimGoogleFontsIcon(200)}
              width={undefined}
              height={undefined}
              fill="currentColor"
            />
            <span> Clear Storage</span>
          </button>
        </div>
      }
    />
  );
};

const LoadStorage: React.FC = () => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const errorMessageRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<
    'not-selected' | 'invalid' | 'valid'
  >('not-selected');
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const stateMessage: Readonly<Record<typeof state, string>> = {
    'not-selected': 'Select JSON file',
    invalid: `Unable to load "${file?.name}"`,
    valid: `Enable to load "${file?.name}"`,
  };
  const isMultilineError = error !== null && error.split('\n').length > 1;

  const validateFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (file === undefined) {
      setState('not-selected');
      return;
    }
    setFile(file);
    // validate selected file
    loadStorageJSON(file);
  };
  const loadFile = async (): Promise<void> => {
    if (file === null || state !== 'valid') {
      return;
    }
    // load JSON File
    const data = await loadStorageJSON(file);
    if (data === null) {
      return;
    }
    // clear storage
    await browser.storage.local.clear();
    // save to storage
    await browser.storage.local.set(data);
    // clear input
    setFile(null);
    setState('not-selected');
    if (inputFileRef.current !== null) {
      inputFileRef.current.value = '';
    }
  };
  const loadStorageJSON = async (file: File): Promise<StorageJSON | null> => {
    return await readFile(file)
      .then((text) => parseStorageJSON(text))
      .then((data) => {
        setState('valid');
        return data;
      })
      .catch((error: unknown) => {
        setState('invalid');
        if (
          error instanceof LoadStorageError ||
          error instanceof JSONSchemaValidationError
        ) {
          setError(error.message);
        } else {
          setError(`${error}`);
        }
        return null;
      });
  };

  return (
    <div className="settings-item">
      <div className="settings-item-row">
        <div className="settings-label">Load Storage</div>
        <div className="settings-form">
          <input
            ref={inputFileRef}
            className="form-control"
            type="file"
            accept=".json"
            onChange={validateFile}
          />
        </div>
      </div>
      <div className="settings-item-row">
        <div
          className={classNames('load-storage-message', {
            'load-storage-valid': state === 'valid',
            'load-storage-invalid': state === 'invalid',
          })}>
          {stateMessage[state]}
        </div>
        <div className="settings-form">
          <button
            className="btn btn-primary icon-button"
            disabled={state !== 'valid'}
            onClick={loadFile}>
            <UploadIcon className="icon" width={undefined} height={undefined} />
            Load
          </button>
        </div>
      </div>
      <Collapse
        nodeRef={errorMessageRef}
        in={state === 'invalid'}
        duration={300}
        mountOnEnter
        unmountOnExit
        target={
          <div ref={errorMessageRef} className="settings-item-row">
            <pre
              className={classNames('load-storage-error', {
                'load-storage-multiline-error': isMultilineError,
              })}>
              {error}
            </pre>
          </div>
        }
        onExited={() => setError(null)}
      />
    </div>
  );
};

const Commands: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
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
                if (
                  Object.keys(state.settingsErrors).length === 0 &&
                  Object.keys(state.templateErrors).length === 0
                ) {
                  saveSettings(state.currentSettings);
                  saveTweetTemplate(state.currentTemplate);
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
  const ref = React.useRef<HTMLDivElement>(null);
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
      <div className="settings-item-row">
        <Telomere status={editStatus(isUpdated, errors)} />
        <div className="settings-label">{label}</div>
        <div className="settings-form">{form}</div>
      </div>
      {description !== undefined && (
        <div className="settings-item-row">{description}</div>
      )}
      {errors !== undefined && errors.length > 0 && (
        <div className="settings-item-row">
          <div className="settings-item-errors">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
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
  const current = useSelector(selectTemplate[type]);
  const editing = useSelector(selectEditingTemplate[type]);
  const error = useSelector(selectTemplateError[type], shallowEqual);
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
      <div className="settings-item-row">
        <Telomere status={editStatus(isUpdated, error)} />
        <div className="settings-label">{name}</div>
        <Placeholders fields={fields} onSelect={addPlaceholder} />
      </div>
      <div className="settings-item-row">
        <textarea
          className="text-template-input"
          value={value}
          onChange={onChange}
          wrap="off"
          rows={value.split('\n').length}
        />
      </div>
      {error !== undefined && error.length > 0 && (
        <div className="settings-item-row">
          <div className="settings-item-errors">
            {error.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
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

type StorageItemProps = {
  label: string;
  form: React.ReactElement;
  description?: React.ReactElement;
};

const StorageItem: React.FC<StorageItemProps> = ({
  label,
  form,
  description,
}) => {
  return (
    <div className="settings-item">
      <div className="settings-item-row">
        <div className="settings-label">{label}</div>
        <div className="settings-form">{form}</div>
      </div>
      {description !== undefined && (
        <div className="settings-item-row">{description}</div>
      )}
    </div>
  );
};

// file
class LoadStorageError extends Error {
  constructor(message: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadStorageError);
    }
    this.name = 'LoadStorageError';
  }
}

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new LoadStorageError('Failed to read file as text'));
      }
    };
    reader.onerror = () => {
      reject(new LoadStorageError('Failed to read file'));
    };
    reader.readAsText(file);
  });
};

const parseStorageJSON = (text: string): StorageJSON => {
  try {
    // parse as JSON
    const data = JSON.parse(text);
    // JSONSchema validation
    validateStorage(data);
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new LoadStorageError('Failed to parse file as JSON');
    } else {
      throw error;
    }
  }
};
