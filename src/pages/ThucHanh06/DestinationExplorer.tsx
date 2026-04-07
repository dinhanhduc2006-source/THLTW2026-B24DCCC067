import { Button, Card, Col, Row, Select, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Destination } from './data';

type Props = {
	destinations: Destination[];
	filterType: string;
	filterRating: number;
	sortKey: string;
	onChangeType: (value: string) => void;
	onChangeRating: (value: number) => void;
	onChangeSort: (value: string) => void;
	onAddToItinerary: (id: string) => void;
};

const DestinationExplorer = ({
	destinations,
	filterType,
	filterRating,
	sortKey,
	onChangeType,
	onChangeRating,
	onChangeSort,
	onAddToItinerary,
}: Props) => {
	return (
		<Row gutter={[16, 16]} className='section'>
			<Col xs={24} sm={24} md={8}>
				<Card title='Bộ lọc & sắp xếp' bordered>
					<Space direction='vertical' style={{ width: '100%' }} size='middle'>
						<Select value={filterType} onChange={onChangeType} style={{ width: '100%' }}>
							<Select.Option value='all'>Tất cả loại hình</Select.Option>
							<Select.Option value='biển'>Biển</Select.Option>
							<Select.Option value='núi'>Núi</Select.Option>
							<Select.Option value='thành phố'>Thành phố</Select.Option>
						</Select>
						<Select value={sortKey} onChange={onChangeSort} style={{ width: '100%' }}>
							<Select.Option value='rating'>Xếp theo đánh giá</Select.Option>
							<Select.Option value='price'>Xếp theo giá</Select.Option>
						</Select>
						<Select value={filterRating} onChange={onChangeRating} style={{ width: '100%' }}>
							<Select.Option value={0}>Tất cả đánh giá</Select.Option>
							<Select.Option value={4}>4.0+</Select.Option>
							<Select.Option value={4.5}>4.5+</Select.Option>
							<Select.Option value={4.7}>4.7+</Select.Option>
						</Select>
					</Space>
				</Card>
			</Col>

			<Col xs={24} sm={24} md={16}>
				<Row gutter={[16, 16]}>
					{destinations.map((destination) => (
						<Col xs={24} sm={12} md={12} key={destination.id}>
							<Card
								hoverable
								cover={
									<img alt={destination.name} src={destination.image} style={{ height: 180, objectFit: 'cover' }} />
								}
								actions={[
									<Button type='primary' block icon={<PlusOutlined />} onClick={() => onAddToItinerary(destination.id)}>
										Thêm vào lịch trình
									</Button>,
								]}
							>
								<Card.Meta title={destination.name} description={destination.description} />
								<div style={{ marginTop: 12 }}>
									<Tag color={destination.type === 'biển' ? 'cyan' : destination.type === 'núi' ? 'green' : 'purple'}>
										{destination.type}
									</Tag>
									<Tag color='gold'>Rating {destination.rating.toFixed(1)}</Tag>
									<Tag color='volcano'>{destination.city}</Tag>
								</div>
								<div style={{ marginTop: 12, fontWeight: 600 }}>
									Giá dự kiến: {destination.price.toLocaleString()} VNĐ
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</Col>
		</Row>
	);
};

export default DestinationExplorer;
