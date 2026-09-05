import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.scss';

import MainPage from './pages/MainPage';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
