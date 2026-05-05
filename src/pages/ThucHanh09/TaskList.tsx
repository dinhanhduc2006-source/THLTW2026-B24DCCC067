import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Task, TaskStatus } from './types';
import { getTasks, deleteTask } from './utils';
import TaskForm from './TaskForm';
import moment from 'moment';

const { Option } = Select;

const TaskList: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		const allTasks = getTasks();
		setTasks(allTasks);
		setFilteredTasks(allTasks);
	}, []);

	useEffect(() => {
		let filtered = tasks;
		if (searchText) {
			filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()));
		}
		if (statusFilter) {
			filtered = filtered.filter((task) => task.status === statusFilter);
		}
		setFilteredTasks(filtered);
	}, [tasks, searchText, statusFilter]);

	const handleAddTask = () => {
		setEditingTask(null);
		setIsModalVisible(true);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setIsModalVisible(true);
	};

	const handleDeleteTask = (id: string) => {
		deleteTask(id);
		setTasks(getTasks());
	};

	const handleFormSubmit = () => {
		setTasks(getTasks());
		setIsModalVisible(false);
	};

	const columns = [
		{
			title: 'Tên Task',
			dataIndex: 'title',
			sorter: (a: Task, b: Task) => a.title.localeCompare(b.title),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			sorter: (a: Task, b: Task) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			filters: [
				{ text: 'Cao', value: 'Cao' },
				{ text: 'Trung bình', value: 'Trung bình' },
				{ text: 'Thấp', value: 'Thấp' },
			],
			onFilter: (value: string, record: Task) => record.priority === value,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			filters: [
				{ text: 'Cần làm', value: 'Cần làm' },
				{ text: 'Đang làm', value: 'Đang làm' },
				{ text: 'Hoàn thành', value: 'Hoàn thành' },
			],
			onFilter: (value: string, record: Task) => record.status === value,
		},
		{
			title: 'Hành động',
			render: (record: Task) => (
				<Space>
					<Button onClick={() => handleEditTask(record)}>Sửa</Button>
					<Button danger onClick={() => handleDeleteTask(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div>
			<h2>Danh sách Task</h2>
			<Space style={{ marginBottom: 16 }}>
				<Input
					placeholder='Tìm kiếm theo tên'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 200 }}
				/>
				<Select
					placeholder='Lọc theo trạng thái'
					value={statusFilter}
					onChange={(value: TaskStatus | '') => setStatusFilter(value)}
					style={{ width: 150 }}
					allowClear
				>
					<Option value='Cần làm'>Cần làm</Option>
					<Option value='Đang làm'>Đang làm</Option>
					<Option value='Hoàn thành'>Hoàn thành</Option>
				</Select>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAddTask}>
					Thêm Task
				</Button>
			</Space>
			<Table columns={columns} dataSource={filteredTasks} rowKey='id' pagination={{ pageSize: 10 }} />
			<TaskForm
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onSubmit={handleFormSubmit}
				task={editingTask}
			/>
		</div>
	);
};

export default TaskList;
