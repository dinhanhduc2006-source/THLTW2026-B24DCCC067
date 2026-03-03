import React, { useState, useEffect } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	Space,
	Typography,
	Progress,
	message,
	Popconfirm,
	Divider,
	List,
	Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Category {
	id: string;
	name: string;
}
interface StudyRecord {
	id: string;
	courseId: string;
	courseName: string;
	date: string;
	duration: number;
	content: string;
}

const StudyManager: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [records, setRecords] = useState<StudyRecord[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isCatModalVisible, setIsCatModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [catForm] = Form.useForm();

	useEffect(() => {
		const savedCats = localStorage.getItem('study_cats');
		const savedRecords = localStorage.getItem('study_records');

		if (savedCats) setCategories(JSON.parse(savedCats));
		else
			setCategories([
				{ id: '1', name: 'Toán' },
				{ id: '2', name: 'Văn' },
			]);

		if (savedRecords) setRecords(JSON.parse(savedRecords));
	}, []);

	useEffect(() => {
		localStorage.setItem('study_cats', JSON.stringify(categories));
		localStorage.setItem('study_records', JSON.stringify(records));
	}, [categories, records]);

	const handleAddCategory = (values: { name: string }) => {
		const newCat: Category = {
			id: Date.now().toString(),
			name: values.name,
		};
		setCategories([...categories, newCat]);
		setIsCatModalVisible(false);
		catForm.resetFields();
		message.success('Đã thêm môn học mới!');
	};

	const deleteCategory = (id: string) => {
		setCategories(categories.filter((c) => c.id !== id));
		setRecords(records.filter((r) => r.courseId !== id));
		message.warning('Đã xóa môn học và các dữ liệu liên quan');
	};

	const handleAddRecord = (values: any) => {
		const newRecord: StudyRecord = {
			id: Date.now().toString(),
			courseId: values.courseId,
			courseName: categories.find((c) => c.id === values.courseId)?.name || '',
			date: values.date.format('YYYY-MM-DD HH:mm'),
			duration: Number(values.duration),
			content: values.content,
		};
		setRecords([newRecord, ...records]);
		setIsModalVisible(false);
		form.resetFields();
		message.success('Đã thêm tiến độ học tập!');
	};

	const calculateProgress = (courseId: string) => {
		return records
			.filter((r) => r.courseId === courseId && dayjs(r.date).isAfter(dayjs().startOf('month')))
			.reduce((sum, r) => sum + r.duration, 0);
	};

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2}>
				<BookOutlined /> Quản lý Tiến độ Học tập
			</Title>

			<Card title='Danh mục môn học' style={{ marginBottom: 20 }}>
				<Button
					type='dashed'
					onClick={() => setIsCatModalVisible(true)}
					icon={<PlusOutlined />}
					style={{ marginBottom: 16 }}
				>
					Thêm môn học khác
				</Button>

				<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
					{categories.map((cat) => (
						<Tag
							key={cat.id}
							color='blue'
							closable
							onClose={(e) => {
								e.preventDefault();
								deleteCategory(cat.id);
							}}
							style={{ padding: '5px 10px', fontSize: '14px' }}
						>
							{cat.name}
						</Tag>
					))}
				</div>
			</Card>

			{categories.map((cat) => {
				const learned = calculateProgress(cat.id);
				const target = 120;
				return (
					<Card key={cat.id} size='small' title={cat.name} style={{ width: 200, borderRadius: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Tháng này:</Text>
						<Progress
							percent={Math.round(Math.min(100, (learned / target) * 100))}
							status={learned >= target ? 'success' : 'active'}
							strokeWidth={10}
						/>
						<Text type='secondary'>
							{learned}/{target} phút
						</Text>
					</Card>
				);
			})}

			<Card title='Nhật ký học tập'>
				<Button
					type='primary'
					onClick={() => setIsModalVisible(true)}
					icon={<PlusOutlined />}
					style={{ marginBottom: 16 }}
				>
					Ghi nhận buổi học
				</Button>
				<Table
					dataSource={records}
					rowKey='id'
					columns={[
						{ title: 'Môn học', dataIndex: 'courseName', key: 'courseName' },
						{ title: 'Ngày giờ', dataIndex: 'date', key: 'date' },
						{ title: 'Thời lượng', dataIndex: 'duration', key: 'duration', render: (v) => `${v} phút` },
						{ title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
						{
							title: 'Thao tác',
							render: (_, record) => (
								<Popconfirm
									title='Xóa bản ghi này?'
									onConfirm={() => setRecords(records.filter((r) => r.id !== record.id))}
								>
									<Button type='link' danger>
										Xóa
									</Button>
								</Popconfirm>
							),
						},
					]}
				/>
			</Card>

			<Modal
				title='Thêm môn học mới'
				visible={isCatModalVisible}
				onCancel={() => setIsCatModalVisible(false)}
				onOk={() => catForm.submit()}
				destroyOnClose
			>
				<Form form={catForm} layout='vertical' onFinish={handleAddCategory}>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}>
						<Input placeholder='Ví dụ: Công nghệ, Kỹ năng mềm...' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Ghi nhận buổi học'
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleAddRecord}>
					<Form.Item name='courseId' label='Môn học' rules={[{ required: true }]}>
						<Select placeholder='Chọn môn'>
							{categories.map((c) => (
								<Option key={c.id} value={c.id}>
									{c.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='date' label='Thời gian' rules={[{ required: true }]} initialValue={dayjs()}>
						<DatePicker showTime style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='duration' label='Thời lượng (phút)' rules={[{ required: true }]}>
						<Input type='number' min={1} />
					</Form.Item>
					<Form.Item name='content' label='Nội dung bài học'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default StudyManager;
