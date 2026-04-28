import { useState } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	InputNumber,
	Tag,
	Space,
	Popconfirm,
	message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Workout } from '../types';
import { getStatusColor, getStatusLabel } from '../utils';

const { RangePicker } = DatePicker;

interface WorkoutLogProps {
	workouts: Workout[];
	onSave: (workout: Workout | null, values: any) => void;
	onDelete: (id: string) => void;
}

export default function WorkoutLog({ workouts, onSave, onDelete }: WorkoutLogProps) {
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<[string, string] | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
	const [form] = Form.useForm();

	// Filter workouts
	const filteredWorkouts = workouts
		.filter((w) => {
			const matchSearch =
				!search ||
				w.type.toLowerCase().includes(search.toLowerCase()) ||
				w.note.toLowerCase().includes(search.toLowerCase());
			const matchType = !typeFilter || w.type === typeFilter;
			const matchDate = !dateRange || (w.date >= dateRange[0] && w.date <= dateRange[1]);
			return matchSearch && matchType && matchDate;
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const columns: ColumnsType<Workout> = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{ title: 'Loại bài tập', dataIndex: 'type', key: 'type' },
		{ title: 'Thời lượng (ph)', dataIndex: 'duration', key: 'duration', sorter: (a, b) => a.duration - b.duration },
		{ title: 'Calo', dataIndex: 'calories', key: 'calories', sorter: (a, b) => a.calories - b.calories },
		{ title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingWorkout(record);
							form.setFieldsValue(record);
							setModalVisible(true);
						}}
					/>
					<Popconfirm title='Xóa buổi tập này?' onConfirm={() => onDelete(record.id)}>
						<Button type='text' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleSave = () => {
		form.validateFields().then((values) => {
			onSave(editingWorkout, values);
			setModalVisible(false);
			form.resetFields();
			setEditingWorkout(null);
			message.success(editingWorkout ? 'Cập nhật buổi tập thành công' : 'Thêm buổi tập thành công');
		});
	};

	return (
		<div>
			<Card style={{ marginBottom: 16 }}>
				<Space wrap>
					<Input
						placeholder='Tìm kiếm bài tập...'
						prefix={<SearchOutlined />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 200 }}
					/>
					<Select
						placeholder='Lọc theo loại'
						allowClear
						value={typeFilter}
						onChange={setTypeFilter}
						style={{ width: 150 }}
						options={[
							{ label: 'Cardio', value: 'Cardio' },
							{ label: 'Strength', value: 'Strength' },
							{ label: 'Yoga', value: 'Yoga' },
							{ label: 'HIIT', value: 'HIIT' },
							{ label: 'Other', value: 'Other' },
						]}
					/>
					<RangePicker
						onChange={(dates) => {
							if (dates) {
								setDateRange([dates[0]?.format('YYYY-MM-DD') || '', dates[1]?.format('YYYY-MM-DD') || '']);
							} else {
								setDateRange(null);
							}
						}}
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingWorkout(null);
							form.resetFields();
							setModalVisible(true);
						}}
					>
						Thêm buổi tập
					</Button>
				</Space>
			</Card>

			<Card>
				<Table columns={columns} dataSource={filteredWorkouts} rowKey='id' pagination={{ pageSize: 10 }} />
			</Card>

			<Modal
				title={editingWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
				open={modalVisible}
				onOk={handleSave}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
					setEditingWorkout(null);
				}}
				width={500}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='date' label='Ngày tập' rules={[{ required: true }]}>
						<Input type='date' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='type' label='Loại bài tập' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Cardio', value: 'Cardio' },
								{ label: 'Strength', value: 'Strength' },
								{ label: 'Yoga', value: 'Yoga' },
								{ label: 'HIIT', value: 'HIIT' },
								{ label: 'Other', value: 'Other' },
							]}
						/>
					</Form.Item>
					<Form.Item name='duration' label='Thời lượng (phút)' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='calories' label='Calo' rules={[{ required: true }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='note' label='Ghi chú'>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' initialValue='completed'>
						<Select
							options={[
								{ label: 'Hoàn thành', value: 'completed' },
								{ label: 'Bỏ lỡ', value: 'missed' },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
