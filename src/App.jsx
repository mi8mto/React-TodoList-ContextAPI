import React from 'react';
import { Header } from './components/Header/Header';

import { TodoListJsonServer } from './components/TodoListJSONServer';
import { TodoProvider } from './components/TodoContext';
import styles from './App.module.css';

export const App = () => {
	return (
		<div>
			<TodoProvider>
				{<Header />}
				<div className={styles.container}>{<TodoListJsonServer />}</div>
			</TodoProvider>
		</div>
	);
};
