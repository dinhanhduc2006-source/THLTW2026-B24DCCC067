import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';

const { Option } = Select;

interface Course {
	id: string;
	name: string;
	instructor: string;
	studentCount: number;
	status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
	description: string;
}

interface CourseFormProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (course: Omit<Course, 'id'>) => void;
	initialValues?: Course;
	courses: Course[];
	instructors: string[];
}

const CourseForm: React.FC<CourseFormProps> = ({
	visible,
	onCancel,
	onSubmit,
	initialValues,
	courses,
	instructors,
}) => {
	const [form] = Form.useForm();
	const [description, setDescription] = useState(initialValues?.description || '');

	useEffect(() => {
		if (visible) {
			form.setFieldsValue(initialValues || {});
			setDescription(initialValues?.description || '');
		}
	}, [visible, initialValues, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const courseData = { ...values, description };
			const existingCourse = courses.find((c) => c.name === courseData.name && c.id !== initialValues?.id);
			if (existingCourse) {
				message.error('Tên khóa học đã tồn tại!');
				return;
			}

			onSubmit(courseData);
			form.resetFields();
			setDescription('');
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setDescription('');
		onCancel();
	};

	return (
		<Modal
			title={initialValues ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
			visible={visible}
			onOk={handleSubmit}
			onCancel={handleCancel}
			width={800}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='name'
					label='Tên khóa học'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên khóa học!' },
						{ max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự!' },
					]}
				>
					<Input placeholder='Nhập tên khóa học' />
				</Form.Item>
				<Form.Item
					name='instructor'
					label='Giảng viên'
					rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
				>
					<Select placeholder='Chọn giảng viên'>
						{instructors.map((instructor) => (
							<Option key={instructor} value={instructor}>
								{instructor}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='studentCount'
					label='Số lượng học viên'
					rules={[
						{ required: true, message: 'Vui lòng nhập số lượng học viên!' },
						{ type: 'number', min: 0, message: 'Số lượng học viên phải là số không âm!' },
					]}
				>
					<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số lượng học viên' />
				</Form.Item>
				<Form.Item label='Mô tả khóa học'>
					<Input.TextArea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Nhập mô tả khóa học (HTML)'
						rows={4}
					/>
				</Form.Item>
				<Form.Item
					name='status'
					label='Trạng thái khóa học'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
				>
					<Select placeholder='Chọn trạng thái'>
						<Option value='Đang mở'>Đang mở</Option>
						<Option value='Đã kết thúc'>Đã kết thúc</Option>
						<Option value='Tạm dừng'>Tạm dừng</Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CourseForm;
