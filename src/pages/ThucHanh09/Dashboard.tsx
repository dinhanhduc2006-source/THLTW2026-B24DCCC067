import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getTasks } from './utils';
import moment from 'moment';

const Dashboard: React.FC = () => {
	const tasks = getTasks();
	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((t) => t.status === 'Hoàn thành').length;
	const overdueTasks = tasks.filter((t) => moment(t.deadline).isBefore(moment()) && t.status !== 'Hoàn thành').length;

	return (
		<div>
			<h2>Dashboard</h2>
			<Row gutter={16}>
				<Col span={8}>
					<Card>
						<Statistic title='Tổng số Task' value={totalTasks} prefix={<ClockCircleOutlined />} />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Task Hoàn thành'
							value={completedTasks}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Task Quá hạn'
							value={overdueTasks}
							prefix={<ExclamationCircleOutlined />}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
