import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface ProductItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

const ProductManager: React.FC = () => {
	// 1. Dữ liệu mẫu khởi tạo
	const initialData: ProductItem[] = [
		{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
		{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
		{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
		{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
		{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
	];

	const [products, setProducts] = useState<ProductItem[]>(initialData);
	const [searchText, setSearchText] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	// 2. Hàm xử lý Xóa
	const handleDelete = (id: number) => {
		const newData = products.filter((item) => item.id !== id);
		setProducts(newData);
		message.success('Xóa sản phẩm thành công!');
	};

	// 3. Hàm xử lý Thêm mới
	const handleAdd = (values: any) => {
		const newProduct: ProductItem = {
			id: Date.now(), // Tạo ID tạm thời
			...values,
		};
		setProducts([...products, newProduct]);
		setIsModalVisible(false);
		form.resetFields();
		message.success('Thêm sản phẩm thành công!');
	};

	// 4. Logic Tìm kiếm
	const filteredProducts = products.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));

	// Cấu hình các cột của Table
	const columns = [
		{ title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 80 },
		{ title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
		},
		{ title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: ProductItem) => (
				<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => handleDelete(record.id)}>
					<Button type='link' danger>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<Card title='QUẢN LÝ DANH SÁCH SẢN PHẨM'>
			<Space style={{ marginBottom: 16, justifyContent: 'space-between', display: 'flex' }}>
				{/* Ô tìm kiếm */}
				<Input
					placeholder='Tìm kiếm theo tên...'
					prefix={<SearchOutlined />}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>
				{/* Nút thêm mới */}
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
					Thêm sản phẩm
				</Button>
			</Space>

			<Table dataSource={filteredProducts} columns={columns} rowKey='id' />

			{/* Modal Form thêm sản phẩm */}
			<Modal
				title='Thêm sản phẩm mới'
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleAdd}>
					<Form.Item
						label='Tên sản phẩm'
						name='name'
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Giá'
						name='price'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá!' },
							{ type: 'number', min: 1, message: 'Giá phải là số dương!' },
						]}
					>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label='Số lượng'
						name='quantity'
						rules={[
							{ required: true, message: 'Vui lòng nhập số lượng!' },
							{ type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' },
						]}
					>
						<InputNumber style={{ width: '100%' }} precision={0} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default ProductManager;
