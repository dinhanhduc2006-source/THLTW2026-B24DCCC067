import { Button, Card, Col, InputNumber, List, Row, Select, Space, Tag } from 'antd';
import type { Destination } from './data';
import type { ItineraryDetail } from './utils';

type Props = {
	destinations: Destination[];
	itineraryDetails: ItineraryDetail[];
	selectedDay: number;
	selectedDest: string;
	onChangeDay: (value: number) => void;
	onChangeDest: (value: string) => void;
	onAddToItinerary: () => void;
	onMoveItem: (key: string, direction: 'up' | 'down') => void;
	onRemoveItem: (key: string) => void;
};

const ItineraryPlanner = ({
	destinations,
	itineraryDetails,
	selectedDay,
	selectedDest,
	onChangeDay,
	onChangeDest,
	onAddToItinerary,
	onMoveItem,
	onRemoveItem,
}: Props) => {
	return (
		<Row gutter={[16, 16]} className='section'>
			<Col xs={24} md={10}>
				<Card title='Chọn hành trình mới' bordered>
					<Space direction='vertical' style={{ width: '100%' }} size='middle'>
						<div>
							<div style={{ marginBottom: 8 }}>Ngày</div>
							<InputNumber
								min={1}
								max={14}
								value={selectedDay}
								onChange={(value) => onChangeDay(Number(value ?? 1))}
								style={{ width: '100%' }}
							/>
						</div>
						<div>
							<div style={{ marginBottom: 8 }}>Chọn điểm đến</div>
							<Select value={selectedDest} onChange={onChangeDest} style={{ width: '100%' }}>
								{destinations.map((destination) => (
									<Select.Option key={destination.id} value={destination.id}>
										{destination.name}
									</Select.Option>
								))}
							</Select>
						</div>
						<Button type='primary' block onClick={onAddToItinerary}>
							Thêm vào lịch trình
						</Button>
					</Space>
				</Card>
			</Col>

			<Col xs={24} md={14}>
				<Card title='Lịch trình hiện tại' bordered>
					{itineraryDetails.length === 0 ? (
						<div>Chưa có điểm đến trong lịch trình. Hãy thêm điểm đến vào lịch trình.</div>
					) : (
						<List
							dataSource={itineraryDetails}
							renderItem={(item, index) => (
								<List.Item>
									<div style={{ width: '100%' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div>
												<strong>Ngày {item.day}</strong> · {item.destination.name}
												<div style={{ marginTop: 6 }}>
													<Tag color='blue'>{item.destination.type}</Tag>
													<Tag color='gold'>Rating {item.destination.rating.toFixed(1)}</Tag>
													<Tag>{item.destination.city}</Tag>
												</div>
											</div>
											<Space>
												<Button size='small' onClick={() => onMoveItem(item.key, 'up')} disabled={index === 0}>
													Lên
												</Button>
												<Button
													size='small'
													onClick={() => onMoveItem(item.key, 'down')}
													disabled={index === itineraryDetails.length - 1}
												>
													Xuống
												</Button>
												<Button danger size='small' onClick={() => onRemoveItem(item.key)}>
													Xóa
												</Button>
											</Space>
										</div>
									</div>
								</List.Item>
							)}
						/>
					)}
				</Card>
			</Col>
		</Row>
	);
};

export default ItineraryPlanner;
