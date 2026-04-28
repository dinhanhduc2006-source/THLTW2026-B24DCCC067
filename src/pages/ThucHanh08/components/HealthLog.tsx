import { useState } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Space,
	Popconfirm,
	message,
	Typography,
	Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { HealthMetric } from '../types';
import { calculateBMI, getBMICategory } from '../utils';

const { Text } = Typography;

interface HealthLogProps {
	healthMetrics: HealthMetric[];
	onSave: (metric: HealthMetric | null, values: any) => void;
	onDelete: (id: string) => void;
}

export default function HealthLog({ healthMetrics, onSave, onDelete }: HealthLogProps) {
	const [modalVisible, setModalVisible] = useState(false);
	const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
	const [form] = Form.useForm();

	const columns: ColumnsType<HealthMetric> = [
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
		{ title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
		{
			title: 'BMI',
			key: 'bmi',
			render: (_, record) => {
				const bmi = calculateBMI(record.weight, record.height);
				const category = getBMICategory(bmi);
				return (
					<Space>
						<Text strong>{bmi}</Text>
						<Tag color={category.color}>{category.label}</Tag>
					</Space>
				);
			},
		},
		{ title: 'Nhịp tim (bpm)', dataIndex: 'restingHeartRate', key: 'restingHeartRate' },
		{ title: 'Giờ ngủ', dataIndex: 'sleepHours', key: 'sleepHours' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingMetric(record);
							form.setFieldsValue(record);
							setModalVisible(true);
						}}
					/>
					<Popconfirm title='Xóa chỉ số này?' onConfirm={() => onDelete(record.id)}>
						<Button type='text' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleSave = () => {
		form.validateFields().then((values) => {
			onSave(editingMetric, values);
			setModalVisible(false);
			form.resetFields();
			setEditingMetric(null);
			message.success(editingMetric ? 'Cập nhật chỉ số thành công' : 'Thêm chỉ số thành công');
		});
	};

	return (
		<div>
			<Card style={{ marginBottom: 16 }}>
				<Space>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingMetric(null);
							form.resetFields();
							setModalVisible(true);
						}}
					>
						Thêm chỉ số
					</Button>
				</Space>
			</Card>

			<Card>
				<Table
					columns={columns}
					dataSource={[...healthMetrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
					rowKey='id'
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<Modal
				title={editingMetric ? 'Sửa chỉ số' : 'Thêm chỉ số mới'}
				open={modalVisible}
				onOk={handleSave}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
					setEditingMetric(null);
				}}
				width={500}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='date' label='Ngày' rules={[{ required: true }]}>
						<Input type='date' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='weight' label='Cân nặng (kg)' rules={[{ required: true }]}>
						<InputNumber min={1} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='height' label='Chiều cao (cm)' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='restingHeartRate' label='Nhịp tim lúc nghỉ (bpm)'>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='sleepHours' label='Giờ ngủ'>
						<InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
