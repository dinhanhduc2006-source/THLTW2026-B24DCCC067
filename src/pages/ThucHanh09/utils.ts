import { Task } from './types';

const STORAGE_KEY = 'thuchanh09_tasks';

export const getTasks = (): Task[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Task) => {
	const tasks = getTasks();
	tasks.push(task);
	saveTasks(tasks);
};

export const updateTask = (updatedTask: Task) => {
	const tasks = getTasks();
	const index = tasks.findIndex((t) => t.id === updatedTask.id);
	if (index !== -1) {
		tasks[index] = updatedTask;
		saveTasks(tasks);
	}
};

export const deleteTask = (id: string) => {
	const tasks = getTasks();
	const filtered = tasks.filter((t) => t.id !== id);
	saveTasks(filtered);
};
