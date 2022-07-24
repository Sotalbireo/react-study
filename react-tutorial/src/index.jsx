import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Game = lazy(() => import('./tutorial/index'))
const Game2 = lazy(() => import('./enhances-tutorial/index'))

const App = () => (
	<section>
		<h1>React tutorial</h1>
		<ul>
			<li><a href="tutorial">tutorial board game</a></li>
			<li><a href="enhances">enhanced tutorial board game</a></li>
		</ul>
	</section>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Router>
		<Suspense>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="tutorial" element={<Game />} />
				<Route path="enhances" element={<Game2 />} />
			</Routes>
		</Suspense>
	</Router>
);
