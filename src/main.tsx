import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './AuthProvider';
import './index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</StrictMode>,
);
