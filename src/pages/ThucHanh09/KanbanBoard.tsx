import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Task, TaskStatus } from './types';
import { getTasks, updateTask } from './utils';
import TaskForm from './TaskForm';

const KanbanBoard: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		setTasks(getTasks());
	}, []);

	const onDragEnd = (result: any) => {
		if (!result.destination) return;

		const { source, destination } = result;
		const newTasks = [...tasks];
		const [movedTask] = newTasks.splice(source.index, 1);
		movedTask.status = destination.droppableId as TaskStatus;
		newTasks.splice(destination.index, 0, movedTask);
		setTasks(newTasks);
		updateTask(movedTask);
	};

	const handleAddTask = () => {
		setEditingTask(null);
		setIsModalVisible(true);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setIsModalVisible(true);
	};

	const handleFormSubmit = () => {
		setTasks(getTasks());
		setIsModalVisible(false);
	};

	const columns: { id: TaskStatus; title: string }[] = [
		{ id: 'Cần làm', title: 'Cần làm' },
		{ id: 'Đang làm', title: 'Đang làm' },
		{ id: 'Hoàn thành', title: 'Hoàn thành' },
	];

	return (
		<div>
			<h2>Kanban Board</h2>
			<Button type='primary' icon={<PlusOutlined />} onClick={handleAddTask} style={{ marginBottom: 16 }}>
				Thêm Task
			</Button>
			<DragDropContext onDragEnd={onDragEnd}>
				<div style={{ display: 'flex', gap: '16px' }}>
					{columns.map((column) => (
						<div key={column.id} style={{ flex: 1 }}>
							<h3>{column.title}</h3>
							<Droppable droppableId={column.id}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										style={{ minHeight: '400px', background: '#f0f0f0', padding: '8px', borderRadius: '4px' }}
									>
										{tasks
											.filter((task) => task.status === column.id)
											.map((task, index) => (
												<Draggable key={task.id} draggableId={task.id} index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided.draggableProps.style,
																marginBottom: '8px',
															}}
														>
															<Card size='small' onClick={() => handleEditTask(task)}>
																<p>
																	<strong>{task.title}</strong>
																</p>
																<p>{task.description}</p>
																<p>Deadline: {task.deadline}</p>
																<p>Ưu tiên: {task.priority}</p>
															</Card>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>
			<TaskForm
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onSubmit={handleFormSubmit}
				task={editingTask}
			/>
		</div>
	);
};

export default KanbanBoard;
