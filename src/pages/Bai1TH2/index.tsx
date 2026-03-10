import React, { useState } from 'react';
import { Button, Card, Table, Typography, Space, Tag, Row, Col, Statistic } from 'antd';
import { RocketOutlined, AuditOutlined, BlockOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const choices = [
	{ name: 'Kéo', value: 'scissors', icon: <RocketOutlined /> },
	{ name: 'Búa', value: 'rock', icon: <BlockOutlined /> },
	{ name: 'Bao', value: 'paper', icon: <AuditOutlined /> },
];

const OanTuTi = () => {
	const [history, setHistory] = useState<any[]>([]);
	const [stats, setStats] = useState({ win: 0, lose: 0, draw: 0 });

	const play = (userChoice: string) => {
		const computerIndex = Math.floor(Math.random() * 3);
		const computerChoice = choices[computerIndex];
		const userChoiceObj = choices.find((c) => c.value === userChoice);

		let result = '';
		let statusColor = '';

		if (userChoice === computerChoice.value) {
			result = 'Hòa';
			statusColor = 'warning';
			setStats({ ...stats, draw: stats.draw + 1 });
		} else if (
			(userChoice === 'scissors' && computerChoice.value === 'paper') ||
			(userChoice === 'rock' && computerChoice.value === 'scissors') ||
			(userChoice === 'paper' && computerChoice.value === 'rock')
		) {
			result = 'Thắng';
			statusColor = 'success';
			setStats({ ...stats, win: stats.win + 1 });
		} else {
			result = 'Thua';
			statusColor = 'error';
			setStats({ ...stats, lose: stats.lose + 1 });
		}

		const newRecord = {
			key: history.length + 1,
			round: history.length + 1,
			user: userChoiceObj?.name,
			computer: computerChoice.name,
			result: <Tag color={statusColor}>{result}</Tag>,
		};

		setHistory([newRecord, ...history]);
	};

	const columns = [
		{ title: 'Ván', dataIndex: 'round', key: 'round' },
		{ title: 'Bạn chọn', dataIndex: 'user', key: 'user' },
		{ title: 'Máy chọn', dataIndex: 'computer', key: 'computer' },
		{ title: 'Kết quả', dataIndex: 'result', key: 'result' },
	];

	return (
		<div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
			<Card title={<Title level={3}>Trò chơi Oẳn Tù Tì</Title>} bordered={false}>
				<Row gutter={16} style={{ marginBottom: '24px' }}>
					<Col span={8}>
						<Statistic title='Thắng' value={stats.win} valueStyle={{ color: 'green' }} />
					</Col>
					<Col span={8}>
						<Statistic title='Thua' value={stats.lose} valueStyle={{ color: 'red' }} />
					</Col>
					<Col span={8}>
						<Statistic title='Hòa' value={stats.draw} />
					</Col>
				</Row>

				<div style={{ textAlign: 'center', marginBottom: '32px' }}>
					<Text strong>Chọn vũ khí của bạn:</Text>
					<br />
					<Space size='large' style={{ marginTop: '16px' }}>
						{choices.map((item) => (
							<Button key={item.value} type='primary' size='large' icon={item.icon} onClick={() => play(item.value)}>
								{item.name}
							</Button>
						))}
					</Space>
				</div>

				<Title level={4}>
					<HistoryOutlined /> Lịch sử kết quả
				</Title>
				<Table dataSource={history} columns={columns} pagination={{ pageSize: 5 }} size='middle' />
			</Card>
		</div>
	);
};

export default OanTuTi;
