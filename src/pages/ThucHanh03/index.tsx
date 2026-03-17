import React, { useState, useMemo } from 'react';
import {
	Layout,
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	TimePicker,
	Tag,
	Rate,
	Space,
	Typography,
	Row,
	Col,
	Statistic,
	List,
	Avatar,
	message,
} from 'antd';
import {
	PlusOutlined,
	CalendarOutlined,
	UserOutlined,
	ScissorOutlined,
	LineChartOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
// Chuyển sang dùng moment để khớp với type của antd v4 trong project của bạn
import moment, { Moment } from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;

const BookingSystem = () => {
	// --- STATE DỮ LIỆU ---
	const [services] = useState([
		{ id: 's1', name: 'Cắt tóc nam', price: 100000, duration: 30 },
		{ id: 's2', name: 'Combo Chăm sóc da', price: 500000, duration: 60 },
	]);

	const [staffs] = useState([
		{ id: 'st1', name: 'Nguyễn Văn A', maxPerDay: 8, rating: 4.5, feedbackCount: 10 },
		{ id: 'st2', name: 'Trần Thị B', maxPerDay: 5, rating: 5.0, feedbackCount: 2 },
	]);

	const [appointments, setAppointments] = useState<any[]>([
		{
			id: 1,
			customer: 'Jason Goodman',
			serviceId: 's1',
			staffId: 'st1',
			date: '2026-03-20',
			time: '09:00',
			status: 'Confirmed',
		},
	]);

	const [isBookingOpen, setIsBookingOpen] = useState(false);
	const [form] = Form.useForm();

	// --- LOGIC XỬ LÝ ---

	const handleBooking = (values: any) => {
		const { date, time, staffId } = values;
		// date và time ở đây là đối tượng Moment
		const dateStr = date.format('YYYY-MM-DD');
		const timeStr = time.format('HH:mm');

		const isOverlapped = appointments.some(
			(app) => app.staffId === staffId && app.date === dateStr && app.time === timeStr,
		);

		const dailyCount = appointments.filter((app) => app.staffId === staffId && app.date === dateStr).length;
		const staff = staffs.find((s) => s.id === staffId);

		if (isOverlapped) {
			return message.error('Nhân viên này đã có lịch vào giờ này!');
		}
		if (staff && dailyCount >= staff.maxPerDay) {
			return message.error('Nhân viên này đã đạt giới hạn khách trong ngày!');
		}

		const newApp = {
			id: Date.now(),
			customer: values.customer,
			serviceId: values.serviceId,
			staffId: values.staffId,
			date: dateStr,
			time: timeStr,
			status: 'Pending',
		};

		setAppointments([newApp, ...appointments]);
		message.success('Đặt lịch thành công! Vui lòng chờ duyệt.');
		setIsBookingOpen(false);
		form.resetFields();
	};

	const totalRevenue = useMemo(() => {
		return appointments
			.filter((app) => app.status === 'Completed')
			.reduce((sum, app) => sum + (services.find((s) => s.id === app.serviceId)?.price || 0), 0);
	}, [appointments, services]);

	// --- CẤU TRÚC BẢNG ---
	const columns = [
		{ title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
		{
			title: 'Dịch vụ',
			render: (record: any) => services.find((s) => s.id === record.serviceId)?.name,
		},
		{
			title: 'Nhân viên',
			render: (record: any) => staffs.find((s) => s.id === record.staffId)?.name,
		},
		{ title: 'Thời gian', render: (record: any) => `${record.date} ${record.time}` },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: string) => (
				<Tag color={status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'blue'}>
					{status.toUpperCase()}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Space>
					{record.status === 'Pending' && (
						<Button
							size='small'
							type='primary'
							onClick={() => {
								const newApps = appointments.map((a) => (a.id === record.id ? { ...a, status: 'Confirmed' } : a));
								setAppointments(newApps);
							}}
						>
							Xác nhận
						</Button>
					)}
					{record.status === 'Confirmed' && (
						<Button
							size='small'
							type='primary'
							style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
							onClick={() => {
								const newApps = appointments.map((a) => (a.id === record.id ? { ...a, status: 'Completed' } : a));
								setAppointments(newApps);
							}}
						>
							Hoàn thành
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<Layout style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
			<Content>
				<Title level={2}>
					<CalendarOutlined /> Quản lý Đặt lịch Dịch vụ
				</Title>

				<Row gutter={16} style={{ marginBottom: 24 }}>
					<Col span={6}>
						<Card>
							<Statistic title='Tổng lịch hẹn' value={appointments.length} prefix={<CalendarOutlined />} />
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Doanh thu (VNĐ)'
								value={totalRevenue}
								prefix={<LineChartOutlined />}
								valueStyle={{ color: '#3f8600' }}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic title='Nhân viên' value={staffs.length} prefix={<UserOutlined />} />
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic title='Dịch vụ' value={services.length} prefix={<ScissorOutlined />} />
						</Card>
					</Col>
				</Row>

				<Button
					type='primary'
					size='large'
					icon={<PlusOutlined />}
					style={{ marginBottom: 16 }}
					onClick={() => setIsBookingOpen(true)}
				>
					Đặt lịch hẹn mới
				</Button>

				<Row gutter={24}>
					<Col span={16}>
						<Card title='Danh sách lịch hẹn'>
							<Table dataSource={appointments} columns={columns} rowKey='id' />
						</Card>
					</Col>
					<Col span={8}>
						<Card title='Đội ngũ & Đánh giá'>
							<List
								itemLayout='horizontal'
								dataSource={staffs}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											avatar={<Avatar icon={<UserOutlined />} />}
											title={item.name}
											description={
												<>
													<Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
													<br />
													<Text type='secondary'>Giới hạn: {item.maxPerDay} khách/ngày</Text>
												</>
											}
										/>
									</List.Item>
								)}
							/>
						</Card>
					</Col>
				</Row>

				<Modal
					title='Thông tin đặt lịch'
					visible={isBookingOpen}
					onCancel={() => setIsBookingOpen(false)}
					onOk={() => form.submit()}
				>
					<Form form={form} layout='vertical' onFinish={handleBooking}>
						<Form.Item name='customer' label='Tên khách hàng' rules={[{ required: true }]}>
							<Input placeholder='Nhập tên khách hàng' />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true }]}>
									<Select placeholder='Chọn dịch vụ'>
										{services.map((s) => (
											<Select.Option key={s.id} value={s.id}>
												{s.name} - {s.price.toLocaleString()}đ
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='staffId' label='Nhân viên' rules={[{ required: true }]}>
									<Select placeholder='Chọn nhân viên'>
										{staffs.map((st) => (
											<Select.Option key={st.id} value={st.id}>
												{st.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='date' label='Ngày hẹn' rules={[{ required: true }]}>
									<DatePicker
										style={{ width: '100%' }}
										disabledDate={(current) => current && current < moment().startOf('day')}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='time' label='Giờ hẹn' rules={[{ required: true }]}>
									<TimePicker format='HH:mm' minuteStep={30} style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</Content>
		</Layout>
	);
};

export default BookingSystem;
