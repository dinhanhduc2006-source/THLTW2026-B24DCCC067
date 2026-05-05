import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { Task } from './types';
import { addTask, updateTask } from './utils';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface TaskFormProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: () => void;
	task?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, task }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (task) {
			form.setFieldsValue({
				...task,
				deadline: moment(task.deadline),
				tags: task.tags.join(', '),
			});
		} else {
			form.resetFields();
		}
	}, [task, form]);

	const handleFinish = (values: any) => {
		const newTask: Task = {
			id: task?.id || Date.now().toString(),
			title: values.title,
			description: values.description,
			deadline: values.deadline.format('YYYY-MM-DD'),
			priority: values.priority,
			tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
			status: task?.status || 'Cần làm',
			createdAt: task?.createdAt || new Date().toISOString(),
		};

		if (task) {
			updateTask(newTask);
		} else {
			addTask(newTask);
		}
		onSubmit();
	};

	return (
		<Modal
			title={task ? 'Chỉnh sửa Task' : 'Thêm Task'}
			visible={visible}
			onCancel={onCancel}
			onOk={() => form.submit()}
		>
			<Form form={form} layout='vertical' onFinish={handleFinish}>
				<Form.Item name='title' label='Tên Task' rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<TextArea rows={3} />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}>
					<DatePicker format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item name='priority' label='Ưu tiên' rules={[{ required: true, message: 'Vui lòng chọn ưu tiên!' }]}>
					<Select>
						<Option value='Cao'>Cao</Option>
						<Option value='Trung bình'>Trung bình</Option>
						<Option value='Thấp'>Thấp</Option>
					</Select>
				</Form.Item>
				<Form.Item name='tags' label='Tag (phân cách bằng dấu phẩy)'>
					<Input placeholder='tag1, tag2, tag3' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskForm;
