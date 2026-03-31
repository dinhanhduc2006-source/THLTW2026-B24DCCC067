import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Club } from './types';

interface ClubManagementProps {
	clubs: Club[];
	onSaveClub: (club: Club) => void;
	onDeleteClub: (id: string) => void;
	onViewMembers: (club: Club) => void;
}

const ClubManagement: React.FC<ClubManagementProps> = ({ clubs, onSaveClub, onDeleteClub, onViewMembers }) => {
	const [search, setSearch] = useState('');
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<Club | null>(null);
	const [form] = Form.useForm();

	const filteredClubs = useMemo(
		() => clubs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
		[clubs, search],
	);

	const openForEdit = (club: Club) => {
		setEditing(club);
		form.setFieldsValue({
			name: club.name,
			manager: club.manager,
			foundedDate: moment(club.foundedDate),
			description: club.description,
			avatar: club.avatar,
			active: club.active ? 'yes' : 'no',
		});
		setVisible(true);
	};

	const onFinish = (values: any) => {
		onSaveClub({
			id: editing?.id || `c${Date.now()}`,
			avatar: values.avatar || 'https://i.pravatar.cc/80',
			name: values.name,
			foundedDate: values.foundedDate.format('YYYY-MM-DD'),
			description: values.description || '',
			manager: values.manager,
			active: values.active === 'yes',
		});
		setVisible(false);
		setEditing(null);
		form.resetFields();
	};

	const columns = [
		{ title: 'Ảnh đại diện', dataIndex: 'avatar', key: 'avatar', render: (avatar: string) => <Avatar src={avatar} /> },
		{ title: 'Tên CLB', dataIndex: 'name', key: 'name', sorter: (a: Club, b: Club) => a.name.localeCompare(b.name) },
		{
			title: 'Ngày thành lập',
			dataIndex: 'foundedDate',
			key: 'foundedDate',
			sorter: (a: Club, b: Club) => moment(a.foundedDate).diff(moment(b.foundedDate)),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			render: (html: string) => (
				<div
					dangerouslySetInnerHTML={{ __html: html }}
					style={{ maxWidth: 300, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
				/>
			),
		},
		{ title: 'Chủ nhiệm', dataIndex: 'manager', key: 'manager' },
		{
			title: 'Hoạt động',
			dataIndex: 'active',
			key: 'active',
			render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Club) => (
				<Space>
					<Button type='link' onClick={() => openForEdit(record)}>
						Chỉnh sửa
					</Button>
					<Popconfirm title='Xác nhận xóa CLB?' onConfirm={() => onDeleteClub(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
					<Button type='link' onClick={() => onViewMembers(record)}>
						Thành viên
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card title='Danh sách CLB' style={{ marginBottom: 16 }}>
			<Row justify='space-between' style={{ marginBottom: 12 }}>
				<Input.Search
					placeholder='Tìm CLB'
					style={{ width: 260 }}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					allowClear
				/>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditing(null);
						setVisible(true);
						form.resetFields();
					}}
				>
					Thêm CLB
				</Button>
			</Row>
			<Table rowKey='id' columns={columns} dataSource={filteredClubs} pagination={{ pageSize: 6 }} />

			<Modal
				title={editing ? 'Chỉnh sửa CLB' : 'Thêm CLB'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				width={720}
			>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={16}>
						<Form.Item name='name' label='Tên CLB' rules={[{ required: true, message: 'Nhập tên CLB' }]}>
							<Input />
						</Form.Item>
						<Form.Item name='manager' label='Chủ nhiệm' rules={[{ required: true, message: 'Nhập chủ nhiệm' }]}>
							<Input />
						</Form.Item>
					</Row>
					<Row gutter={16}>
						<Form.Item
							name='foundedDate'
							label='Ngày thành lập'
							rules={[{ required: true, message: 'Chọn ngày thành lập' }]}
						>
							<DatePicker style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item name='active' label='Hoạt động' rules={[{ required: true, message: 'Chọn hoạt động' }]}>
							<Select>
								<Select.Option value='yes'>Có</Select.Option>
								<Select.Option value='no'>Không</Select.Option>
							</Select>
						</Form.Item>
					</Row>
					<Form.Item name='avatar' label='Avatar (URL)'>
						<Input placeholder='URL ảnh' />
					</Form.Item>
					<Form.Item name='description' label='Mô tả (HTML)'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default ClubManagement;
