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
	Space,
	Tag,
	Row,
	Col,
	Statistic,
	List,
	Empty,
	Descriptions,
	Divider,
	message,
	InputNumber,
	Typography,
	Tabs,
} from 'antd';
import {
	BookOutlined,
	FileProtectOutlined,
	SettingOutlined,
	SearchOutlined,
	PlusOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ConfigField {
	id: string;
	label: string;
	type: 'String' | 'Number' | 'Date';
}

interface Diploma {
	id: string;
	soVaoSo: number;
	soHieu: string;
	maSV: string;
	hoTen: string;
	ngaySinh: string;
	decisionId: string;
	dynamicData: Record<string, any>;
}

const DiplomaManagementSystem = () => {
	const [configFields, setConfigFields] = useState<ConfigField[]>([
		{ id: 'dt', label: 'Dân tộc', type: 'String' },
		{ id: 'ns', label: 'Nơi sinh', type: 'String' },
		{ id: 'dtb', label: 'Điểm trung bình', type: 'Number' },
		{ id: 'nnh', label: 'Ngày nhập học', type: 'Date' },
	]);

	const [books] = useState([
		{ id: 'B2025', year: 2025, nextNumber: 10 },
		{ id: 'B2026', year: 2026, nextNumber: 1 },
	]);

	const [decisions] = useState([
		{
			id: 'D1',
			soQD: '101/QĐ-ĐH',
			ngayBanHanh: '2026-01-10',
			trichYeu: 'Tốt nghiệp đợt 1 - 2026',
			bookId: 'B2026',
			searchCount: 0,
		},
		{
			id: 'D2',
			soQD: '202/QĐ-ĐH',
			ngayBanHanh: '2026-03-15',
			trichYeu: 'Tốt nghiệp đợt 2 - 2026',
			bookId: 'B2026',
			searchCount: 0,
		},
	]);

	const [diplomas, setDiplomas] = useState<Diploma[]>([
		{
			id: '1',
			soVaoSo: 1,
			soHieu: 'VB0001',
			maSV: 'SV202601',
			hoTen: 'Jason Goodman',
			ngaySinh: '2004-05-10',
			decisionId: 'D1',
			dynamicData: { dt: 'Kinh', ns: 'Hà Nội', dtb: 8.5 },
		},
	]);

	const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [searchResult, setSearchResult] = useState<Diploma | null>(null);
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();

	const handleAddDiploma = (values: any) => {
		const { staticInfo, dynamicInfo } = values;

		const relatedDecision = decisions.find((d) => d.id === staticInfo.decisionId);
		const diplomaInSameBook = diplomas.filter((d) => {
			const dec = decisions.find((dec) => dec.id === d.decisionId);
			return dec?.bookId === relatedDecision?.bookId;
		});

		const nextSoVaoSo = diplomaInSameBook.length > 0 ? Math.max(...diplomaInSameBook.map((d) => d.soVaoSo)) + 1 : 1;

		const newDiploma: Diploma = {
			id: Date.now().toString(),
			soVaoSo: nextSoVaoSo,
			...staticInfo,
			ngaySinh: staticInfo.ngaySinh.format('YYYY-MM-DD'),
			dynamicData: dynamicInfo || {},
		};

		setDiplomas([newDiploma, ...diplomas]);
		message.success(`Cấp văn bằng thành công! Số vào sổ tự động: ${nextSoVaoSo}`);
		setIsDiplomaModalOpen(false);
		form.resetFields();
	};

	const handleSearch = (values: any) => {
		const criteria = Object.values(values).filter((v) => v !== undefined && v !== '');

		if (criteria.length < 2) {
			return message.error('Yêu cầu nhập ít nhất 2 tham số để tra cứu (Số hiệu, Mã SV, Họ tên...)');
		}

		const result = diplomas.find(
			(d) =>
				(values.soHieu && d.soHieu === values.soHieu) ||
				(values.soVaoSo && d.soVaoSo === Number(values.soVaoSo)) ||
				(values.maSV && d.maSV === values.maSV) ||
				(values.hoTen && d.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())),
		);

		if (result) {
			setSearchResult(result);
			const decision = decisions.find((d) => d.id === result.decisionId);
			if (decision) decision.searchCount += 1;
			message.success('Tìm thấy thông tin văn bằng!');
		} else {
			setSearchResult(null);
			message.warning('Không tìm thấy thông tin phù hợp trong hệ thống.');
		}
	};

	return (
		<Layout style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
			<Content>
				<Card bordered={false} style={{ marginBottom: 24 }}>
					<Row justify='space-between' align='middle'>
						<Col>
							<Title level={2} style={{ margin: 0 }}>
								<BookOutlined /> Quản lý Văn bằng Tốt nghiệp
							</Title>
						</Col>
						<Col>
							<Space size='middle'>
								<Button type='primary' danger icon={<SearchOutlined />} onClick={() => setIsSearchModalOpen(true)}>
									Tra cứu công khai
								</Button>
								<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsDiplomaModalOpen(true)}>
									Cấp văn bằng mới
								</Button>
							</Space>
						</Col>
					</Row>
				</Card>

				<Tabs defaultActiveKey='1' type='card'>
					<TabPane
						tab={
							<span>
								<FileProtectOutlined /> Danh sách văn bằng
							</span>
						}
						key='1'
					>
						<Table
							dataSource={diplomas}
							rowKey='id'
							columns={[
								{
									title: 'Số vào sổ',
									dataIndex: 'soVaoSo',
									key: 'soVaoSo',
									width: 100,
									render: (n) => <Tag color='blue'>{n}</Tag>,
								},
								{ title: 'Số hiệu', dataIndex: 'soHieu', key: 'soHieu' },
								{ title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
								{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
								{ title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
								{
									title: 'Quyết định',
									dataIndex: 'decisionId',
									render: (id) => decisions.find((d) => d.id === id)?.soQD,
								},
							]}
						/>
					</TabPane>

					<TabPane
						tab={
							<span>
								<HistoryOutlined /> Thống kê Quyết định
							</span>
						}
						key='2'
					>
						<Table
							dataSource={decisions}
							rowKey='id'
							columns={[
								{ title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
								{ title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
								{ title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh' },
								{ title: 'Lượt tra cứu', dataIndex: 'searchCount', key: 'searchCount', render: (c) => <b>{c} lượt</b> },
							]}
						/>
					</TabPane>

					<TabPane
						tab={
							<span>
								<SettingOutlined /> Cấu hình biểu mẫu
							</span>
						}
						key='3'
					>
						<Card title='Các trường thông tin phụ lục hiện có'>
							<List
								dataSource={configFields}
								renderItem={(item) => (
									<List.Item
										actions={[
											<Button type='link' danger>
												Xóa
											</Button>,
										]}
									>
										<List.Item.Meta title={item.label} description={`Kiểu dữ liệu: ${item.type}`} />
									</List.Item>
								)}
							/>
						</Card>
					</TabPane>
				</Tabs>

				{/* MODAL CẤP VĂN BẰNG */}
				<Modal
					title='Cấp văn bằng tốt nghiệp'
					visible={isDiplomaModalOpen}
					onCancel={() => setIsDiplomaModalOpen(false)}
					onOk={() => form.submit()}
					width={850}
				>
					<Form form={form} layout='vertical' onFinish={handleAddDiploma}>
						<Title level={5}>1. Thông tin cơ bản (Mặc định)</Title>
						<Row gutter={16}>
							<Col span={6}>
								<Form.Item name={['staticInfo', 'maSV']} label='Mã sinh viên' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={10}>
								<Form.Item name={['staticInfo', 'hoTen']} label='Họ và tên' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name={['staticInfo', 'ngaySinh']} label='Ngày sinh' rules={[{ required: true }]}>
									<DatePicker style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item name={['staticInfo', 'soHieu']} label='Số hiệu văn bằng' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={16}>
								<Form.Item
									name={['staticInfo', 'decisionId']}
									label='Theo Quyết định tốt nghiệp'
									rules={[{ required: true }]}
								>
									<Select placeholder='Chọn quyết định tốt nghiệp'>
										{decisions.map((d) => (
											<Select.Option key={d.id} value={d.id}>
												{d.soQD} - {d.trichYeu}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Text type='secondary'>
									<i>* Số vào sổ sẽ được hệ thống tự động cấp sau khi lưu.</i>
								</Text>
							</Col>
						</Row>

						<Divider />
						<Title level={5}>2. Phụ lục văn bằng (Cấu hình động)</Title>
						<Row gutter={16}>
							{configFields.map((field) => (
								<Col span={12} key={field.id}>
									<Form.Item name={['dynamicInfo', field.id]} label={field.label}>
										{field.type === 'String' && <Input placeholder={`Nhập ${field.label.toLowerCase()}`} />}
										{field.type === 'Number' && <InputNumber style={{ width: '100%' }} placeholder='Nhập số' />}
										{field.type === 'Date' && <DatePicker style={{ width: '100%' }} placeholder='Chọn ngày' />}
									</Form.Item>
								</Col>
							))}
						</Row>
					</Form>
				</Modal>

				<Modal
					title='Hệ thống tra cứu văn bằng tốt nghiệp'
					visible={isSearchModalOpen}
					onCancel={() => {
						setIsSearchModalOpen(false);
						setSearchResult(null);
						searchForm.resetFields();
					}}
					footer={null}
					width={900}
				>
					<div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, marginBottom: 20 }}>
						<Form form={searchForm} layout='vertical' onFinish={handleSearch}>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item name='soHieu' label='Số hiệu văn bằng'>
										<Input placeholder='VB00...' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item name='soVaoSo' label='Số vào sổ'>
										<Input placeholder='Số tự nhiên' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item name='maSV' label='Mã sinh viên'>
										<Input placeholder='SV...' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item name='hoTen' label='Họ và tên'>
										<Input placeholder='Nguyễn Văn A' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item name='ngaySinh' label='Ngày sinh (Dùng để đối chiếu)'>
										<DatePicker style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							</Row>
							<Button type='primary' block size='large' htmlType='submit' icon={<SearchOutlined />}>
								Bắt đầu tra cứu
							</Button>
						</Form>
					</div>

					{searchResult ? (
						<Card bordered={false} style={{ background: '#fff', border: '2px solid #1890ff' }}>
							<Descriptions title='THÔNG TIN CHI TIẾT VĂN BẰNG' bordered column={2}>
								<Descriptions.Item label='Họ và tên' span={1}>
									<b>{searchResult.hoTen.toUpperCase()}</b>
								</Descriptions.Item>
								<Descriptions.Item label='Mã sinh viên'>{searchResult.maSV}</Descriptions.Item>
								<Descriptions.Item label='Ngày sinh'>{searchResult.ngaySinh}</Descriptions.Item>
								<Descriptions.Item label='Số hiệu văn bằng'>
									<Tag color='red'>{searchResult.soHieu}</Tag>
								</Descriptions.Item>
								<Descriptions.Item label='Số vào sổ sổ gốc'>
									<Tag color='blue'>{searchResult.soVaoSo}</Tag>
								</Descriptions.Item>
								<Descriptions.Item label='Quyết định tốt nghiệp'>
									{decisions.find((d) => d.id === searchResult.decisionId)?.soQD}
								</Descriptions.Item>

								<Descriptions.Item
									label='THÔNG TIN PHỤ LỤC'
									span={2}
									labelStyle={{ fontWeight: 'bold', color: '#1890ff' }}
								>
									<Row gutter={[16, 16]}>
										{configFields.map((f) => (
											<Col span={12} key={f.id}>
												<Text type='secondary'>{f.label}:</Text>{' '}
												<b>
													{searchResult.dynamicData[f.id] instanceof moment
														? searchResult.dynamicData[f.id].format('DD/MM/YYYY')
														: searchResult.dynamicData[f.id] || '---'}
												</b>
											</Col>
										))}
									</Row>
								</Descriptions.Item>
							</Descriptions>
						</Card>
					) : (
						<Empty description='Nhập thông tin để thực hiện tra cứu' />
					)}
				</Modal>
			</Content>
		</Layout>
	);
};

export default DiplomaManagementSystem;
