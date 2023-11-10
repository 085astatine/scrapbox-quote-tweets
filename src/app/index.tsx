import classNames from 'classnames';
import React from 'react';
import { Provider } from 'react-redux';
import SettingsIcon from '~/icon/bootstrap/gear.svg';
import TweetsIcon from '~/icon/bootstrap/list-ul.svg';
import TrashboxIcon from '~/icon/bootstrap/trash3.svg';
import { Tweets } from './component/tweets';
import { Store } from './store';

export { initializeAction, store, Store } from './store';

export interface AppProps {
  store: Store;
}

export const App: React.FC<AppProps> = ({ store }: AppProps) => {
  const [tab, setTab] = React.useState<Tab>('tweets');
  return (
    <Provider store={store}>
      <Tabs tab={tab} switchTab={setTab} />
      {tab === 'tweets' ? (
        <Tweets />
      ) : tab === 'trashbox' ? (
        <Trashbox />
      ) : tab === 'settings' ? (
        <Settings />
      ) : (
        <></>
      )}
    </Provider>
  );
};

type Tab = 'tweets' | 'trashbox' | 'settings';

interface TabsProps {
  tab: Tab;
  switchTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ tab, switchTab }: TabsProps) => {
  return (
    <div className="tabs">
      <div
        className={classNames('tab', { active: tab === 'tweets' })}
        onClick={() => switchTab('tweets')}>
        <TweetsIcon className="icon" width={undefined} height={undefined} />
      </div>
      <div
        className={classNames('tab', { active: tab === 'trashbox' })}
        onClick={() => switchTab('trashbox')}>
        <TrashboxIcon className="icon" width={undefined} height={undefined} />
      </div>
      <div
        className={classNames('tab', { active: tab === 'settings' })}
        onClick={() => switchTab('settings')}>
        <SettingsIcon className="icon" width={undefined} height={undefined} />
      </div>
    </div>
  );
};

const Trashbox = () => {
  return <div>Trashbox</div>;
};

const Settings = () => {
  return <div>Settings</div>;
};
