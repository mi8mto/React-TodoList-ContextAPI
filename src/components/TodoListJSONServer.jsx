import { useContext, useState } from 'react'; // Добавьте useState для работы с инпутом
import { TodoContext } from './TodoContext'; // Импортируем контекст
import styles from './TodoList.module.css';

// Хук для работы с инпутом
function useInput(defaultValue = '') {
	const [value, setValue] = useState(defaultValue);

	return {
		value,
		onChange: (event) => setValue(event.target.value),
		reset: () => setValue(''), // Оставляем метод reset для сброса состояния
	};
}

export const TodoListJsonServer = () => {
	const input = useInput();
	const {
		todoList,
		isLoading,
		editTodo,
		deleteTodo,
		addTodo,
		saveEditTodo,
		editingId,
		editingTitle,
		setEditingTitle,
		toggleSort,
		isSorted,
	} = useContext(TodoContext); // Используем контекст для состояния задач

	// Обновляем addTodo, чтобы очищать инпут
	const handleAddTodo = () => {
		addTodo(input.value); // Добавляем задачу
		input.reset(); // Очищаем поле ввода
	};

	return (
		<div className={styles.app}>
			<h2>Todolist</h2>
			{/* Кнопка для добавления новой задачи */}
			<button
				onClick={handleAddTodo}
				className={styles.addButton}
				disabled={isLoading}
			>
				Добавить задачу
			</button>
			{/* Кнопка для включения/выключения сортировки */}
			<button onClick={toggleSort} className={styles.sortButton}>
				{isSorted ? 'Отключить сортировку' : 'Включить сортировку'}
			</button>
			{/* Поле для поиска задач */}
			<input
				type="text"
				className="control"
				value={input.value}
				onChange={input.onChange}
			/>
			{/* Отображаем состояние загрузки или список задач */}
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				<div className={styles.taskList}>
					{todoList
						.filter((todo) =>
							todo.title.toLowerCase().includes(input.value.toLowerCase()),
						)
						.map(({ id, title }) => (
							<div key={id} className={styles.todoItem}>
								{/* Если задача редактируется, показываем инпут */}
								{editingId === id ? (
									<>
										<input
											className={styles.changeInput}
											type="text"
											value={editingTitle}
											onChange={(e) =>
												setEditingTitle(e.target.value)
											}
										/>
										<button
											className={styles.editButton}
											onClick={saveEditTodo}
										>
											ок
										</button>
									</>
								) : (
									<>
										<span>{title}</span>
										<div className={styles.buttonContainer}>
											{/* Кнопка для редактирования задачи */}
											<button
												onClick={() => editTodo(id, title)}
												className={styles.editButton}
											>
												Ред
											</button>
											{/* Кнопка для удаления задачи */}
											<button
												onClick={() => deleteTodo(id)}
												className={styles.deleteButton}
											>
												х
											</button>
										</div>
									</>
								)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};
