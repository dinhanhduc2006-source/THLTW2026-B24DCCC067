import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTags, addTag, updateTag, deleteTag } from './services';
import { Tag as TagType } from './models';

const ManageTags: React.FC = () => {
	const [tags, setTags] = useState<TagType[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<TagType | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		setTags(getTags());
	};

	const handleAdd = () => {
		setEditingTag(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (tag: TagType) => {
		setEditingTag(tag);
		form.setFieldsValue(tag);
		setIsModalVisible(true);
	};

	const handleDelete = (id: number) => {
		deleteTag(id);
		loadData();
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingTag) {
				updateTag(editingTag.id, values);
			} else {
				addTag(values);
			}
			setIsModalVisible(false);
			loadData();
		});
	};

	const columns = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số bài viết',
			dataIndex: 'postCount',
			key: 'postCount',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: TagType) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa thẻ này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm thẻ
			</Button>
			<Table columns={columns} dataSource={tags} rowKey='id' />

			<Modal
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên thẻ' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ManageTags;
