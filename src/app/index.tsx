import React from 'react';
import ReactDOM from 'react-dom/client';
import { MainPage } from '~/pages/main';

import { Providers } from '~/app/providers';
import './styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <MainPage />
    </Providers>
  </React.StrictMode>,
);
