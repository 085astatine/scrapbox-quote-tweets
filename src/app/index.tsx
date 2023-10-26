import React from 'react';
import { Provider } from 'react-redux';
import { Store } from './store';

export { initializeAction, store, Store } from './store';

export interface AppProps {
  store: Store;
}

export const App: React.FC<AppProps> = ({ store }: AppProps) => {
  return <Provider store={store}>App</Provider>;
};
