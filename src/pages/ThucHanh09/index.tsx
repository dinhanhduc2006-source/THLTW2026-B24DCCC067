import React from 'react';
import { Tabs } from 'antd';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import TaskList from './TaskList';

const { TabPane } = Tabs;

const ThucHanh09: React.FC = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h1>Ứng dụng Theo dõi Công việc Cá nhân</h1>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Dashboard' key='1'>
					<Dashboard />
				</TabPane>
				<TabPane tab='Kanban Board' key='2'>
					<KanbanBoard />
				</TabPane>
				<TabPane tab='Danh sách Task' key='3'>
					<TaskList />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default ThucHanh09;
