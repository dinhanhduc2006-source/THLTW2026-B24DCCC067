import { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Destination, DestinationFormValues } from './data';

type Props = {
	visible: boolean;
	editingDestination: Destination | null;
	onCancel: () => void;
	onSubmit: (values: DestinationFormValues, id?: string) => void;
};

const DestinationFormModal = ({ visible, editingDestination, onCancel, onSubmit }: Props) => {
	const [form] = Form.useForm<DestinationFormValues>();
	const [imagePreview, setImagePreview] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	useEffect(() => {
		if (editingDestination) {
			setImagePreview(editingDestination.image);
			setFileList([
				{
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url: editingDestination.image,
				},
			]);
			form.setFieldsValue({
				name: editingDestination.name,
				type: editingDestination.type,
				city: editingDestination.city,
				rating: editingDestination.rating,
				price: editingDestination.price,
				duration: editingDestination.duration,
				food: editingDestination.budgets.food,
				stay: editingDestination.budgets.stay,
				travel: editingDestination.budgets.travel,
				other: editingDestination.budgets.other,
				description: editingDestination.description,
				image: editingDestination.image,
			});
		} else {
			form.resetFields();
			setImagePreview('');
			setFileList([]);
		}
	}, [editingDestination, form, visible]);

	const handleUploadImage = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			const url = reader.result as string;
			setImagePreview(url);
			setFileList([
				{
					uid: `-${Date.now()}`,
					name: file.name,
					status: 'done',
					url,
				},
			]);
			form.setFieldsValue({ image: url });
		};
		reader.readAsDataURL(file);
		return false;
	};

	return (
		<Modal
			title={editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			destroyOnClose
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					type: 'biển',
					rating: 4.5,
					price: 1000,
					duration: 4,
					food: 300,
					stay: 300,
					travel: 150,
					other: 100,
				}}
				onFinish={(values) => onSubmit(values, editingDestination?.id)}
				onValuesChange={(_, values) => {
					if (values.image && typeof values.image === 'string') {
						setImagePreview(values.image);
					}
					return undefined;
				}}
			>
				<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='type' label='Loại hình' rules={[{ required: true }]}>
					<Select>
						<Select.Option value='biển'>Biển</Select.Option>
						<Select.Option value='núi'>Núi</Select.Option>
						<Select.Option value='thành phố'>Thành phố</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='city' label='Thành phố' rules={[{ required: true, message: 'Nhập thành phố' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='rating' label='Rating' rules={[{ required: true }]}>
					<InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='price' label='Giá ước tính (VNĐ)' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='duration' label='Thời gian tham quan (giờ)' rules={[{ required: true }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='food' label='Chi phí ăn uống' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='stay' label='Chi phí lưu trú' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='travel' label='Chi phí di chuyển' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='other' label='Chi phí khác' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Nhập mô tả điểm đến' }]}>
					<Input.TextArea rows={3} />
				</Form.Item>
				<Form.Item name='image' label='Ảnh điểm đến'>
					<Input placeholder='Dán URL ảnh hoặc tải lên bên dưới' />
				</Form.Item>
				<Form.Item label='Upload ảnh'>
					<Upload
						accept='image/*'
						listType='picture'
						beforeUpload={(file) => handleUploadImage(file as File)}
						fileList={fileList}
						onRemove={() => {
							setFileList([]);
							setImagePreview('');
							form.setFieldsValue({ image: '' });
						}}
					>
						<Button>Chọn file</Button>
					</Upload>
				</Form.Item>
				{imagePreview ? (
					<div style={{ textAlign: 'center', marginBottom: 16 }}>
						<img src={imagePreview} alt='preview' style={{ maxWidth: '100%', borderRadius: 8 }} />
					</div>
				) : null}
				<Form.Item>
					<Space>
						<Button type='primary' htmlType='submit'>
							{editingDestination ? 'Lưu thay đổi' : 'Thêm mới'}
						</Button>
						<Button onClick={onCancel}>Hủy</Button>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DestinationFormModal;
