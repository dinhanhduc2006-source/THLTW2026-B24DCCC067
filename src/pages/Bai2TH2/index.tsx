import React, { useState } from 'react';
import {
	Layout,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Space,
	Tag,
	InputNumber,
	Card,
	Typography,
	message,
	Row,
	Col,
} from 'antd';
import { PlusOutlined, ThunderboltOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const levels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
const knowledgeBlocks = ['Tổng quan', 'Chuyên sâu', 'Thực hành'];

const ExamSystem = () => {
	const [subjects] = useState([
		{ id: 1, code: 'IT101', name: 'Lập trình React', credits: 3 },
		{ id: 2, code: 'DB202', name: 'SQL Server', credits: 2 },
	]);

	const [questions, setQuestions] = useState([
		{ id: 'Q1', subjectId: 1, content: 'React Hook là gì?', level: 'Dễ', block: 'Tổng quan' },
		{ id: 'Q2', subjectId: 1, content: 'Phân biệt UseMemo và UseCallback?', level: 'Khó', block: 'Chuyên sâu' },
	]);

	const [exams, setExams] = useState<any[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

	const [form] = Form.useForm();
	const [questionForm] = Form.useForm();

	const handleAddQuestion = (values: any) => {
		const newQuestion = {
			id: `Q${Date.now()}`,
			...values,
		};
		setQuestions([...questions, newQuestion]);
		message.success('Đã thêm câu hỏi vào ngân hàng dữ liệu!');
		setIsQuestionModalOpen(false);
		questionForm.resetFields();
	};

	const handleGenerateExam = (values: any) => {
		const { examName, subjectId, structures } = values;
		let finalQuestions: any[] = [];
		let isSuccess = true;

		for (const config of structures) {
			const pool = questions.filter(
				(q) => q.subjectId === subjectId && q.level === config.level && q.block === config.block,
			);

			if (pool.length < config.quantity) {
				message.error(
					`Không đủ câu hỏi: ${config.level} - ${config.block} (Cần ${config.quantity}, có ${pool.length})`,
				);
				isSuccess = false;
				break;
			}

			const randomItems = [...pool].sort(() => 0.5 - Math.random()).slice(0, config.quantity);
			finalQuestions = [...finalQuestions, ...randomItems];
		}

		if (isSuccess) {
			const newExam = {
				id: Date.now(),
				name: examName,
				subject: subjects.find((s) => s.id === subjectId)?.name,
				questionCount: finalQuestions.length,
				details: finalQuestions,
				createdAt: new Date().toLocaleString(),
			};
			setExams([newExam, ...exams]);
			message.success('Tạo đề thi thành công!');
			setIsModalOpen(false);
			form.resetFields();
		}
	};

	const questionColumns = [
		{ title: 'Nội dung', dataIndex: 'content', key: 'content' },
		{ title: 'Mức độ', dataIndex: 'level', key: 'level', render: (l: string) => <Tag color='blue'>{l}</Tag> },
		{ title: 'Khối', dataIndex: 'block', key: 'block' },
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			render: (id: number) => subjects.find((s) => s.id === id)?.name,
		},
	];

	const examColumns = [
		{ title: 'Tên đề thi', dataIndex: 'name', key: 'name' },
		{ title: 'Môn học', dataIndex: 'subject', key: 'subject' },
		{ title: 'Số câu', dataIndex: 'questionCount', key: 'questionCount' },
		{ title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
		{
			title: 'Hành động',
			render: (_: any, record: any) => (
				<Button
					type='link'
					onClick={() =>
						Modal.info({
							title: record.name,
							content: (
								<div>
									{record.details.map((q: any, i: number) => (
										<p key={i}>
											{i + 1}. {q.content}
										</p>
									))}
								</div>
							),
						})
					}
				>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<Layout style={{ minHeight: '100vh', padding: '24px', background: '#f0f2f5' }}>
			<Content>
				<Space direction='vertical' size='large' style={{ width: '100%' }}>
					<Title level={2}>Hệ thống Quản lý Ngân hàng câu hỏi & Đề thi</Title>

					<Card>
						<Space>
							<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsQuestionModalOpen(true)}>
								Thêm câu hỏi mới
							</Button>
							<Button danger icon={<ThunderboltOutlined />} onClick={() => setIsModalOpen(true)}>
								Tạo đề thi tự động
							</Button>
						</Space>
					</Card>

					<Row gutter={16}>
						<Col span={12}>
							<Card
								title={
									<span>
										<DatabaseOutlined /> Ngân hàng câu hỏi
									</span>
								}
							>
								<Table dataSource={questions} columns={questionColumns} rowKey='id' pagination={{ pageSize: 5 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card
								title={
									<span>
										<PlusOutlined /> Danh sách đề thi đã tạo
									</span>
								}
							>
								<Table dataSource={exams} columns={examColumns} rowKey='id' pagination={{ pageSize: 5 }} />
							</Card>
						</Col>
					</Row>
				</Space>

				<Modal
					title='Thêm câu hỏi mới'
					visible={isQuestionModalOpen}
					onCancel={() => setIsQuestionModalOpen(false)}
					onOk={() => questionForm.submit()}
				>
					<Form form={questionForm} layout='vertical' onFinish={handleAddQuestion}>
						<Form.Item name='subjectId' label='Môn học' rules={[{ required: true }]}>
							<Select options={subjects.map((s) => ({ label: s.name, value: s.id }))} />
						</Form.Item>
						<Form.Item name='content' label='Nội dung câu hỏi' rules={[{ required: true }]}>
							<Input.TextArea rows={3} placeholder='Nhập câu hỏi tự luận...' />
						</Form.Item>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='block' label='Khối kiến thức' rules={[{ required: true }]}>
									<Select options={knowledgeBlocks.map((b) => ({ label: b, value: b }))} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='level' label='Mức độ' rules={[{ required: true }]}>
									<Select options={levels.map((l) => ({ label: l, value: l }))} />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>

				<Modal
					title='Cấu trúc đề thi mới'
					visible={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					onOk={() => form.submit()}
					width={800}
				>
					<Form form={form} layout='vertical' onFinish={handleGenerateExam}>
						<Form.Item name='examName' label='Tên đề thi' rules={[{ required: true }]}>
							<Input placeholder='Ví dụ: Đề thi cuối kỳ đợt 1' />
						</Form.Item>
						<Form.Item name='subjectId' label='Môn học' rules={[{ required: true }]}>
							<Select options={subjects.map((s) => ({ label: s.name, value: s.id }))} />
						</Form.Item>
						<Title level={5}>Cấu trúc chi tiết</Title>
						<Form.List name='structures' initialValue={[{}]}>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
											<Form.Item
												{...restField}
												name={[name, 'block']}
												label='Khối kiến thức'
												rules={[{ required: true }]}
											>
												<Select style={{ width: 150 }} options={knowledgeBlocks.map((b) => ({ label: b, value: b }))} />
											</Form.Item>
											<Form.Item {...restField} name={[name, 'level']} label='Mức độ' rules={[{ required: true }]}>
												<Select style={{ width: 120 }} options={levels.map((l) => ({ label: l, value: l }))} />
											</Form.Item>
											<Form.Item {...restField} name={[name, 'quantity']} label='Số lượng' rules={[{ required: true }]}>
												<InputNumber min={1} />
											</Form.Item>
											<Button type='link' danger onClick={() => remove(name)}>
												Xóa
											</Button>
										</Space>
									))}
									<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
										Thêm điều kiện
									</Button>
								</>
							)}
						</Form.List>
					</Form>
				</Modal>
			</Content>
		</Layout>
	);
};

export default ExamSystem;
