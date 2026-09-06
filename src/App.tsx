import './App.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
