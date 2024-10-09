import classNames from 'classnames';
import React from 'react';
import SettingsIcon from '~/icon/bootstrap/gear.svg';
import TweetsIcon from '~/icon/bootstrap/list-ul.svg';
import TrashboxIcon from '~/icon/google-fonts/delete.svg';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { Settings } from './component/settings';
import { Trashbox } from './component/trashbox';
import { Tweets } from './component/tweets';

export const App: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('tweets');
  return (
    <>
      <Tabs tab={tab} switchTab={setTab} />
      <div className="tab-content">
        {tab === 'tweets' && <Tweets />}
        {tab === 'trashbox' && <Trashbox />}
        {tab === 'settings' && <Settings />}
      </div>
    </>
  );
};

type Tab = 'tweets' | 'trashbox' | 'settings';

type TabsProps = {
  tab: Tab;
  switchTab: (tab: Tab) => void;
};

const Tabs: React.FC<TabsProps> = ({ tab, switchTab }: TabsProps) => {
  return (
    <div className="tabs">
      <button
        className={classNames('tab', { active: tab === 'tweets' })}
        onClick={() => switchTab('tweets')}>
        <TweetsIcon className="icon" width={undefined} height={undefined} />
      </button>
      <button
        className={classNames('tab', { active: tab === 'trashbox' })}
        onClick={() => switchTab('trashbox')}>
        <TrashboxIcon
          className="icon"
          viewBox={trimGoogleFontsIcon(200)}
          width={undefined}
          height={undefined}
          fill="currentColor"
        />
      </button>
      <button
        className={classNames('tab', { active: tab === 'settings' })}
        onClick={() => switchTab('settings')}>
        <SettingsIcon className="icon" width={undefined} height={undefined} />
      </button>
    </div>
  );
};
