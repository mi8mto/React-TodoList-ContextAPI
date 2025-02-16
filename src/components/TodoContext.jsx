import React, { createContext, useState, useEffect } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
	const [todoList, setTodoList] = useState([]); // Список задач (по умолчанию пустой)
	const [isSorted, setIsSorted] = useState(false); // Стейт для сортировки
	const [isLoading, setIsLoading] = useState(false); // Стейт для загрузки
	const [editingId, setEditingId] = useState(null); // Стейт для редактирования задачи
	const [editingTitle, setEditingTitle] = useState(''); // Стейт для редактирования задачи

	// Загружаем задачи с сервера
	const loadTodos = () => {
		setIsLoading(true);
		fetch('http://localhost:3030/todos')
			.then((response) => response.json())
			.then((data) => setTodoList(data))
			.finally(() => setIsLoading(false));
	};

	// Добавляем задачу
	const addTodo = (title) => {
		if (title.trim()) {
			const newTodo = { title };

			setIsLoading(true);
			fetch('http://localhost:3030/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTodo),
			})
				.then((response) => response.json())
				.then((newTodo) => {
					setTodoList((prevList) => [...prevList, newTodo]);
				})
				.finally(() => setIsLoading(false));
		}
	};

	// Удаляем задачу
	const deleteTodo = (id) => {
		setIsLoading(true);
		fetch(`http://localhost:3030/todos/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				setTodoList((prevList) => prevList.filter((todo) => todo.id !== id));
			})
			.finally(() => setIsLoading(false));
	};

	// Редактируем задачу
	const editTodo = (id, title) => {
		setEditingId(id);
		setEditingTitle(title);
	};

	// Сохраняем редактированную задачу
	const saveEditTodo = () => {
		setIsLoading(true);
		fetch(`http://localhost:3030/todos/${editingId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: editingTitle }),
		})
			.then((response) => response.json())
			.then((updatedTodo) => {
				setTodoList((prevList) =>
					prevList.map((todo) =>
						todo.id === editingId
							? { ...todo, title: updatedTodo.title }
							: todo,
					),
				);
			})
			.finally(() => {
				setEditingId(null);
				setEditingTitle('');
				setIsLoading(false);
			});
	};

	// Переключение сортировки
	const toggleSort = () => {
		setIsSorted((prevState) => !prevState);
	};

	// Сортировка задач
	const sortedTodos = isSorted
		? [...todoList].sort((a, b) => a.title.localeCompare(b.title))
		: todoList;

	// Оборачиваем все состояние и функции в контекст
	return (
		<TodoContext.Provider
			value={{
				todoList: sortedTodos,
				isLoading,
				editTodo,
				deleteTodo,
				addTodo,
				saveEditTodo,
				editingId,
				setEditingId,
				editingTitle,
				setEditingTitle,
				toggleSort,
				isSorted, // Добавили isSorted в контекст
			}}
		>
			{children}
		</TodoContext.Provider>
	);
};
