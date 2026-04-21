import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Popconfirm, Space, Input as SearchInput } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getPosts, addPost, updatePost, deletePost, getTags } from './services';
import { Post, Tag as TagType } from './models';

const { Option } = Select;

const ManagePosts: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<TagType[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [searchTitle, setSearchTitle] = useState('');
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		filterPosts();
	}, [posts, searchTitle, statusFilter]);

	const loadData = () => {
		setPosts(getPosts());
		setTags(getTags());
	};

	const filterPosts = () => {
		let filtered = posts;
		if (searchTitle) {
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(searchTitle.toLowerCase()));
		}
		if (statusFilter) {
			filtered = filtered.filter((post) => post.status === statusFilter);
		}
		setFilteredPosts(filtered);
	};

	const handleAdd = () => {
		setEditingPost(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (post: Post) => {
		setEditingPost(post);
		form.setFieldsValue({
			...post,
			author: post.author || 'Đinh Anh Đức', // Default author
		});
		setIsModalVisible(true);
	};

	const handleDelete = (id: number) => {
		deletePost(id);
		loadData();
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const postData = {
				...values,
				publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString().split('T')[0],
				views: editingPost ? editingPost.views : 0,
			};
			if (editingPost) {
				updatePost(editingPost.id, postData);
			} else {
				addPost(postData);
			}
			setIsModalVisible(false);
			loadData();
		});
	};

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>{status === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'views',
			key: 'views',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'publishedAt',
			key: 'publishedAt',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Post) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa bài viết này?'
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
			<Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
				<SearchInput
					placeholder='Tìm kiếm theo tiêu đề'
					prefix={<SearchOutlined />}
					value={searchTitle}
					onChange={(e) => setSearchTitle(e.target.value)}
					style={{ width: 200 }}
				/>
				<Select
					placeholder='Lọc theo trạng thái'
					style={{ width: 150 }}
					allowClear
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
				>
					<Option value='draft'>Nháp</Option>
					<Option value='published'>Đã đăng</Option>
				</Select>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm bài viết
				</Button>
			</Space>
			<Table columns={columns} dataSource={filteredPosts} rowKey='id' />

			<Modal
				title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={800}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='title' label='Tiêu đề' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='slug' label='Slug' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='content' label='Nội dung' rules={[{ required: true }]}>
						<Input.TextArea rows={8} />
					</Form.Item>
					<Form.Item name='excerpt' label='Tóm tắt' rules={[{ required: true }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='coverImage' label='Ảnh đại diện (URL)' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='author' label='Tác giả' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='tags' label='Thẻ' rules={[{ required: true }]}>
						<Select mode='tags' placeholder='Chọn hoặc nhập thẻ'>
							{tags.map((tag) => (
								<Option key={tag.name} value={tag.name}>
									{tag.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
						<Select>
							<Option value='draft'>Nháp</Option>
							<Option value='published'>Đã đăng</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ManagePosts;
