import { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Exercise } from '../types';
import { getDifficultyColor, getDifficultyLabel } from '../utils';

interface ExerciseLibraryProps {
	exercises: Exercise[];
	onSave: (exercise: Exercise | null, values: any) => void;
	onDelete: (id: string) => void;
}

export default function ExerciseLibrary({ exercises, onSave, onDelete }: ExerciseLibraryProps) {
	const [search, setSearch] = useState('');
	const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
	const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [detailVisible, setDetailVisible] = useState(false);
	const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
	const [form] = Form.useForm();

	const filteredExercises = exercises.filter((e) => {
		const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
		const matchMuscle = !muscleFilter || e.muscleGroup === muscleFilter;
		const matchDifficulty = !difficultyFilter || e.difficulty === difficultyFilter;
		return matchSearch && matchMuscle && matchDifficulty;
	});

	const handleSave = () => {
		form.validateFields().then((values) => {
			onSave(editingExercise, values);
			setModalVisible(false);
			form.resetFields();
			setEditingExercise(null);
			message.success(editingExercise ? 'Cập nhật bài tập thành công' : 'Thêm bài tập thành công');
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
						placeholder='Nhóm cơ'
						allowClear
						value={muscleFilter}
						onChange={setMuscleFilter}
						style={{ width: 150 }}
						options={[
							{ label: 'Chest', value: 'Chest' },
							{ label: 'Back', value: 'Back' },
							{ label: 'Legs', value: 'Legs' },
							{ label: 'Shoulders', value: 'Shoulders' },
							{ label: 'Arms', value: 'Arms' },
							{ label: 'Core', value: 'Core' },
							{ label: 'Full Body', value: 'Full Body' },
						]}
					/>
					<Select
						placeholder='Mức độ khó'
						allowClear
						value={difficultyFilter}
						onChange={setDifficultyFilter}
						style={{ width: 150 }}
						options={[
							{ label: 'Dễ', value: 'easy' },
							{ label: 'Trung bình', value: 'medium' },
							{ label: 'Khó', value: 'hard' },
						]}
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingExercise(null);
							form.resetFields();
							setModalVisible(true);
						}}
					>
						Thêm bài tập
					</Button>
				</Space>
			</Card>

			<Row gutter={[16, 16]}>
				{filteredExercises.map((exercise) => (
					<Col xs={24} sm={12} lg={8} key={exercise.id}>
						<Card
							hoverable
							onClick={() => {
								setSelectedExercise(exercise);
								setDetailVisible(true);
							}}
							actions={[
								<EditOutlined
									key='edit'
									onClick={(e) => {
										e.stopPropagation();
										setEditingExercise(exercise);
										form.setFieldsValue(exercise);
										setModalVisible(true);
									}}
								/>,
								<Popconfirm title='Xóa bài tập này?' onConfirm={() => onDelete(exercise.id)}>
									<DeleteOutlined key='delete' onClick={(e) => e.stopPropagation()} />
								</Popconfirm>,
							]}
						>
							<Card.Meta
								title={exercise.name}
								description={
									<div>
										<div style={{ color: '#666' }}>Nhóm cơ: {exercise.muscleGroup}</div>
										<div style={{ color: '#666' }}>Calo/giờ: {exercise.caloriesPerHour}</div>
										<div>{exercise.description}</div>
									</div>
								}
							/>
							<div style={{ marginTop: 12 }}>
								<Tag color={getDifficultyColor(exercise.difficulty)}>{getDifficultyLabel(exercise.difficulty)}</Tag>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			{/* Exercise Detail Modal */}
			<Modal
				title={selectedExercise?.name}
				open={detailVisible}
				onCancel={() => setDetailVisible(false)}
				footer={null}
				width={600}
			>
				{selectedExercise && (
					<div>
						<p>
							<strong>Nhóm cơ:</strong> {selectedExercise.muscleGroup}
						</p>
						<p>
							<strong>Mức độ khó:</strong>{' '}
							<Tag color={getDifficultyColor(selectedExercise.difficulty)}>
								{getDifficultyLabel(selectedExercise.difficulty)}
							</Tag>
						</p>
						<p>
							<strong>Calo đốt trung bình/giờ:</strong> {selectedExercise.caloriesPerHour} kcal
						</p>
						<p>
							<strong>Mô tả:</strong> {selectedExercise.description}
						</p>
						<p>
							<strong>Hướng dẫn thực hiện:</strong>
						</p>
						<pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
							{selectedExercise.instructions}
						</pre>
					</div>
				)}
			</Modal>

			{/* Exercise Form Modal */}
			<Modal
				title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập mới'}
				open={modalVisible}
				onOk={handleSave}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
					setEditingExercise(null);
				}}
				width={500}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên bài tập' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='muscleGroup' label='Nhóm cơ' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Chest', value: 'Chest' },
								{ label: 'Back', value: 'Back' },
								{ label: 'Legs', value: 'Legs' },
								{ label: 'Shoulders', value: 'Shoulders' },
								{ label: 'Arms', value: 'Arms' },
								{ label: 'Core', value: 'Core' },
								{ label: 'Full Body', value: 'Full Body' },
							]}
						/>
					</Form.Item>
					<Form.Item name='difficulty' label='Mức độ khó' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Dễ', value: 'easy' },
								{ label: 'Trung bình', value: 'medium' },
								{ label: 'Khó', value: 'hard' },
							]}
						/>
					</Form.Item>
					<Form.Item name='description' label='Mô tả ngắn'>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='caloriesPerHour' label='Calo đốt trung bình/giờ' rules={[{ required: true }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='instructions' label='Hướng dẫn thực hiện'>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
