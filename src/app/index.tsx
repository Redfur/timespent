import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '@/app/providers';
import { MainPage } from '@/pages/main';
import { initYandexMetrika } from '@/shared/lib/metrika';
import './styles';

initYandexMetrika();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Providers>
			<MainPage />
		</Providers>
	</React.StrictMode>,
);
