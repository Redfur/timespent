import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '@/app/providers';
import { MainPage } from '@/pages/main';
import './styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Providers>
			<MainPage />
		</Providers>
	</React.StrictMode>,
);
