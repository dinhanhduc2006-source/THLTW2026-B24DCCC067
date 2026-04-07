import { Button, Card, Col, List, Progress, Row, Space, Statistic, Table, Tag } from 'antd';
import type { Destination, MonthlyStat } from './data';

const columns = (onEdit: (destination: Destination) => void, onDelete: (id: string) => void) => [
	{
		title: 'Tên điểm đến',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Loại',
		dataIndex: 'type',
		key: 'type',
		render: (value: Destination['type']) => (
			<Tag color={value === 'biển' ? 'cyan' : value === 'núi' ? 'green' : 'purple'}>{value}</Tag>
		),
	},
	{
		title: 'Thành phố',
		dataIndex: 'city',
		key: 'city',
	},
	{
		title: 'Giá (VNĐ)',
		dataIndex: 'price',
		key: 'price',
		render: (value: number) => value.toLocaleString(),
	},
	{
		title: 'Hành động',
		key: 'actions',
		render: (_: any, record: Destination) => (
			<Space>
				<Button type='link' onClick={() => onEdit(record)}>
					Sửa
				</Button>
				<Button danger type='link' onClick={() => onDelete(record.id)}>
					Xóa
				</Button>
			</Space>
		),
	},
];

type Props = {
	destinations: Destination[];
	monthlyStats: MonthlyStat[];
	popularDestinations: Destination[];
	estimatedRevenue: number;
	onEditDestination: (destination: Destination) => void;
	onDeleteDestination: (id: string) => void;
	onOpenAddModal: () => void;
};

const AdminPanel = ({
	destinations,
	monthlyStats,
	popularDestinations,
	estimatedRevenue,
	onEditDestination,
	onDeleteDestination,
	onOpenAddModal,
}: Props) => {
	return (
		<div className='section'>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card
						title='Danh sách điểm đến'
						extra={
							<Button type='primary' onClick={onOpenAddModal}>
								Thêm điểm đến
							</Button>
						}
					>
						<Table
							dataSource={destinations}
							columns={columns(onEditDestination, onDeleteDestination)}
							rowKey='id'
							pagination={false}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title='Thống kê theo tháng' style={{ marginBottom: 16 }}>
						<List
							dataSource={monthlyStats}
							renderItem={(item) => (
								<List.Item>
									<div style={{ width: '100%' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<span>{item.month}</span>
											<strong>{item.count} đặt tour</strong>
										</div>
										<Progress percent={Math.min(100, item.count * 4)} showInfo={false} />
									</div>
								</List.Item>
							)}
						/>
					</Card>
					<Card title='Địa điểm phổ biến'>
						<List
							dataSource={popularDestinations}
							renderItem={(item) => (
								<List.Item>
									<div>
										<strong>{item.name}</strong>
										<div>{item.city}</div>
									</div>
								</List.Item>
							)}
						/>
						<div style={{ marginTop: 16 }}>
							<Statistic title='Doanh thu ước tính' value={estimatedRevenue} suffix='VNĐ' />
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AdminPanel;
