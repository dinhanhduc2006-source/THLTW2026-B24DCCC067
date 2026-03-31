import React, { useState } from 'react';
import { Button, Card, Empty, Form, Input, List, Modal, Popconfirm, Row, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Application, Club, Status } from './types';

interface Props {
	applications: Application[];
	clubs: Club[];
	onSave: (application: Application) => void;
	onDelete: (id: string) => void;
	onBulkStatus: (ids: string[], status: Status, reason?: string) => void;
}

const ApplicationManagement: React.FC<Props> = ({ applications, clubs, onSave, onDelete, onBulkStatus }) => {
	const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingApp, setEditingApp] = useState<Application | null>(null);
	const [appForm] = Form.useForm();

	const [rejectModal, setRejectModal] = useState(false);
	const [rejectIds, setRejectIds] = useState<string[]>([]);
	const [rejectReason, setRejectReason] = useState('');

	const [historyModal, setHistoryModal] = useState(false);
	const [historyTarget, setHistoryTarget] = useState<Application | null>(null);

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Application, b: Application) => a.name.localeCompare(b.name),
		},
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
		{ title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
		{ title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			key: 'clubId',
			render: (id: string) => clubs.find((c) => c.id === id)?.name || '---',
		},
		{ title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason', ellipsis: true },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: Status) => {
				const color = status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{ title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
		{
			title: 'Thao tác',
			key: 'action',
			width: 240,
			render: (_: any, record: Application) => (
				<Space size='small' wrap>
					<Button
						size='small'
						type='link'
						onClick={() => {
							setEditingApp(record);
							appForm.setFieldsValue({ ...record });
							setModalVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Xác nhận xóa?' onConfirm={() => onDelete(record.id)}>
						<Button size='small' type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
					<Button size='small' type='link' onClick={() => onBulkStatus([record.id], 'Approved')}>
						Duyệt
					</Button>
					<Button
						size='small'
						type='link'
						onClick={() => {
							setRejectIds([record.id]);
							setRejectModal(true);
						}}
					>
						Từ chối
					</Button>
					<Button
						size='small'
						type='link'
						onClick={() => {
							setHistoryTarget(record);
							setHistoryModal(true);
						}}
					>
						Lịch sử
					</Button>
				</Space>
			),
		},
	];

	const onFinish = (values: any) => {
		onSave({
			id: editingApp?.id || `a${Date.now()}`,
			name: values.name,
			email: values.email,
			phone: values.phone,
			gender: values.gender,
			address: values.address,
			skills: values.skills,
			clubId: values.clubId,
			reason: values.reason,
			status: editingApp?.status || 'Pending',
			note: values.note || editingApp?.note || '',
			history: editingApp?.history || [],
		});
		setModalVisible(false);
		setEditingApp(null);
		appForm.resetFields();
	};

	const confirmReject = () => {
		if (!rejectReason.trim()) {
			return;
		}
		onBulkStatus(rejectIds, 'Rejected', rejectReason);
		setRejectReason('');
		setRejectModal(false);
		setRejectIds([]);
	};

	return (
		<Card title='Quản lý đơn đăng ký' style={{ marginBottom: 16 }}>
			<Row justify='space-between' style={{ marginBottom: 12 }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingApp(null);
						setModalVisible(true);
						appForm.resetFields();
					}}
				>
					Thêm đơn mới
				</Button>
				<Space>
					<Button disabled={!selectedKeys.length} onClick={() => onBulkStatus(selectedKeys as string[], 'Approved')}>
						Duyệt {selectedKeys.length} đơn
					</Button>
					<Button
						danger
						disabled={!selectedKeys.length}
						onClick={() => {
							setRejectIds(selectedKeys as string[]);
							setRejectModal(true);
						}}
					>
						Từ chối {selectedKeys.length} đơn
					</Button>
				</Space>
			</Row>
			<Table
				rowSelection={{
					selectedRowKeys: selectedKeys,
					onChange: setSelectedKeys,
				}}
				columns={columns}
				dataSource={applications}
				rowKey='id'
				pagination={{ pageSize: 8 }}
			/>

			<Modal
				title={editingApp ? 'Sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
				visible={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					setEditingApp(null);
				}}
				onOk={() => appForm.submit()}
				width={820}
			>
				<Form form={appForm} layout='vertical' onFinish={onFinish}>
					<Row gutter={16}>
						<Form.Item name='name' label='Họ tên' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
							<Input />
						</Form.Item>
					</Row>
					<Row gutter={16}>
						<Form.Item name='phone' label='SĐT' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item name='gender' label='Giới tính' rules={[{ required: true }]}>
							<Select>
								<Select.Option value='Nam'>Nam</Select.Option>
								<Select.Option value='Nữ'>Nữ</Select.Option>
								<Select.Option value='Khác'>Khác</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item name='clubId' label='CLB' rules={[{ required: true }]}>
							<Select>
								{clubs.map((club) => (
									<Select.Option key={club.id} value={club.id}>
										{club.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Row>
					<Row gutter={16}>
						<Form.Item name='address' label='Địa chỉ'>
							<Input />
						</Form.Item>
						<Form.Item name='skills' label='Sở trường'>
							<Input />
						</Form.Item>
					</Row>
					<Form.Item name='reason' label='Lý do đăng ký'>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='note' label='Ghi chú (lý do từ chối)'>
						<Input.TextArea rows={2} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal title='Lý do từ chối' visible={rejectModal} onCancel={() => setRejectModal(false)} onOk={confirmReject}>
				<Form layout='vertical'>
					<Form.Item label='Lý do từ chối' required>
						<Input.TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Lịch sử thao tác'
				visible={historyModal}
				footer={null}
				onCancel={() => setHistoryModal(false)}
				width={700}
			>
				{historyTarget ? (
					<List
						dataSource={historyTarget.history}
						renderItem={(item) => (
							<List.Item>
								<List.Item.Meta
									title={`${item.action} bởi ${item.by} (${item.at})`}
									description={item.reason || 'Không có lý do'}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty description='Chưa có lịch sử' />
				)}
			</Modal>
		</Card>
	);
};

export default ApplicationManagement;
