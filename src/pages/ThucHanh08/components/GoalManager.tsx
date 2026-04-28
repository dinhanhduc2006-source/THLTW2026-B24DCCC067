import { useState } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Drawer,
	Form,
	Input,
	Select,
	InputNumber,
	Space,
	Popconfirm,
	Progress,
	Tag,
	message,
	Segmented,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Goal } from '../types';
import { getStatusColor, getGoalTypeLabel, getStatusLabel } from '../utils';

interface GoalManagerProps {
	goals: Goal[];
	onSave: (goal: Goal | null, values: any) => void;
	onDelete: (id: string) => void;
	onUpdateValue: (id: string, value: number) => void;
}

export default function GoalManager({ goals, onSave, onDelete, onUpdateValue }: GoalManagerProps) {
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [form] = Form.useForm();

	const filteredGoals = statusFilter === 'all' ? goals : goals.filter((g) => g.status === statusFilter);

	const handleSave = () => {
		form.validateFields().then((values) => {
			onSave(editingGoal, values);
			setDrawerVisible(false);
			form.resetFields();
			setEditingGoal(null);
			message.success(editingGoal ? 'Cập nhật mục tiêu thành công' : 'Thêm mục tiêu thành công');
		});
	};

	return (
		<div>
			<Card style={{ marginBottom: 16 }}>
				<Space>
					<Segmented
						options={[
							{ label: 'Tất cả', value: 'all' },
							{ label: 'Đang thực hiện', value: 'active' },
							{ label: 'Đã đạt', value: 'achieved' },
							{ label: 'Đã hủy', value: 'cancelled' },
						]}
						value={statusFilter}
						onChange={(val) => setStatusFilter(val as string)}
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingGoal(null);
							form.resetFields();
							setDrawerVisible(true);
						}}
					>
						Thêm mục tiêu
					</Button>
				</Space>
			</Card>

			<Row gutter={[16, 16]}>
				{filteredGoals.map((goal) => {
					const progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
					return (
						<Col xs={24} sm={12} lg={8} key={goal.id}>
							<Card
								actions={[
									<EditOutlined
										key='edit'
										onClick={() => {
											setEditingGoal(goal);
											form.setFieldsValue(goal);
											setDrawerVisible(true);
										}}
									/>,
									<Popconfirm title='Xóa mục tiêu này?' onConfirm={() => onDelete(goal.id)}>
										<DeleteOutlined key='delete' />
									</Popconfirm>,
								]}
							>
								<Card.Meta
									title={goal.name}
									description={
										<div>
											<span style={{ color: '#666' }}>Loại: {getGoalTypeLabel(goal.type)}</span>
											<br />
											<span style={{ color: '#666' }}>Deadline: {goal.deadline}</span>
											<br />
											<Tag color={getStatusColor(goal.status)} style={{ marginTop: 8 }}>
												{getStatusLabel(goal.status)}
											</Tag>
										</div>
									}
								/>
								<div style={{ marginTop: 16 }}>
									<Progress percent={progress} status={goal.status === 'achieved' ? 'success' : 'active'} />
									<div style={{ marginTop: 8 }}>
										<span>Giá trị hiện tại: </span>
										<InputNumber
											size='small'
											value={goal.currentValue}
											onChange={(val) => val && onUpdateValue(goal.id, val as number)}
											style={{ width: 80 }}
											min={0}
										/>
										<span> / {goal.targetValue}</span>
									</div>
								</div>
							</Card>
						</Col>
					);
				})}
			</Row>

			<Drawer
				title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
				width={400}
				open={drawerVisible}
				onClose={() => {
					setDrawerVisible(false);
					form.resetFields();
					setEditingGoal(null);
				}}
				onOk={handleSave}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên mục tiêu' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Giảm cân', value: 'weight_loss' },
								{ label: 'Tăng cơ', value: 'muscle_gain' },
								{ label: 'Cải thiện sức bền', value: 'endurance' },
								{ label: 'Khác', value: 'other' },
							]}
						/>
					</Form.Item>
					<Form.Item name='targetValue' label='Giá trị mục tiêu' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='currentValue' label='Giá trị hiện tại' initialValue={0}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='deadline' label='Deadline' rules={[{ required: true }]}>
						<Input type='date' style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
}
