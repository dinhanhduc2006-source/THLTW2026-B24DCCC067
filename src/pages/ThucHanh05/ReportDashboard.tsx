import React from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { Application, Club } from './types';

interface Props {
	clubs: Club[];
	applications: Application[];
}

const ReportDashboard: React.FC<Props> = ({ clubs, applications }) => {
	const pendingCount = applications.filter((a) => a.status === 'Pending').length;
	const approvedCount = applications.filter((a) => a.status === 'Approved').length;
	const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

	const series = [
		{
			name: 'Pending',
			data: clubs.map((club) => applications.filter((a) => a.clubId === club.id && a.status === 'Pending').length),
		},
		{
			name: 'Approved',
			data: clubs.map((club) => applications.filter((a) => a.clubId === club.id && a.status === 'Approved').length),
		},
		{
			name: 'Rejected',
			data: clubs.map((club) => applications.filter((a) => a.clubId === club.id && a.status === 'Rejected').length),
		},
	];

	const options = {
		chart: { toolbar: { show: true } },
		xaxis: { categories: clubs.map((club) => club.name) },
		plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
		legend: { position: 'top' as 'top' },
		dataLabels: { enabled: false },
	};

	return (
		<Card
			title={
				<span>
					<BarChartOutlined /> Báo cáo thống kê
				</span>
			}
		>
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Card>
						<Statistic title='Số CLB' value={clubs.length} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Đơn Pending' value={pendingCount} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Đơn Approved' value={approvedCount} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Đơn Rejected' value={rejectedCount} />
					</Card>
				</Col>
			</Row>
			<ReactApexChart options={options} series={series} type='bar' height={360} />
		</Card>
	);
};

export default ReportDashboard;
