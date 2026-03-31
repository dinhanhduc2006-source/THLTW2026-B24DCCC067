import React, { useMemo, useState } from 'react';
import { Button, Card, Form, Modal, Select, Space, Table } from 'antd';
import { Member, Club } from './types';

interface Props {
	members: Member[];
	clubs: Club[];
	onTransfer: (ids: string[], clubId: string) => void;
}

const MemberManagement: React.FC<Props> = ({ members, clubs, onTransfer }) => {
	const [clubFilter, setClubFilter] = useState<'all' | string>('all');
	const [selected, setSelected] = useState<React.Key[]>([]);
	const [transferModal, setTransferModal] = useState(false);
	const [transferClubId, setTransferClubId] = useState('');

	const filtered = useMemo(() => {
		if (clubFilter === 'all') return members;
		return members.filter((m) => m.clubId === clubFilter);
	}, [clubFilter, members]);

	const columns = [
		{ title: 'Họ tên', dataIndex: 'name', key: 'name' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
		{ title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
		{ title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
		{
			title: 'CLB',
			dataIndex: 'clubId',
			key: 'clubId',
			render: (id: string) => clubs.find((c) => c.id === id)?.name || '---',
		},
		{ title: 'Ngày vào', dataIndex: 'joinedAt', key: 'joinedAt' },
	];

	return (
		<Card title='Quản lý thành viên CLB' style={{ marginBottom: 16 }}>
			<Form layout='inline' style={{ marginBottom: 12 }}>
				<Form.Item label='CLB lọc'>
					<Select value={clubFilter} onChange={(value) => setClubFilter(value)} style={{ width: 200 }}>
						<Select.Option value='all'>Tất cả CLB</Select.Option>
						{clubs.map((c) => (
							<Select.Option key={c.id} value={c.id}>
								{c.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Space>
						<Button disabled={!selected.length} onClick={() => setTransferModal(true)}>
							Chuyển CLB ({selected.length})
						</Button>
					</Space>
				</Form.Item>
			</Form>
			<Table
				rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
				columns={columns}
				dataSource={filtered}
				rowKey='id'
				pagination={{ pageSize: 8 }}
			/>

			<Modal
				title='Chuyển CLB'
				visible={transferModal}
				onCancel={() => setTransferModal(false)}
				onOk={() => {
					onTransfer(selected as string[], transferClubId);
					setSelected([]);
					setTransferModal(false);
				}}
			>
				<Form layout='vertical'>
					<Form.Item label='CLB nhận'>
						<Select value={transferClubId} onChange={setTransferClubId}>
							{clubs.map((c) => (
								<Select.Option key={c.id} value={c.id}>
									{c.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<p>Chuyển {selected.length} thành viên.</p>
				</Form>
			</Modal>
		</Card>
	);
};

export default MemberManagement;
