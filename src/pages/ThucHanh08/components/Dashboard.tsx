import { Row, Col, Card, Statistic, Progress } from 'antd';
import { CalendarOutlined, FireOutlined, RocketOutlined, TrophyOutlined } from '@ant-design/icons';
import { Typography, Timeline } from 'antd';
import { Workout, Goal, HealthMetric, DashboardStats, WeeklyData, WeightData } from '../types';

const { Text } = Typography;

interface DashboardProps {
	workouts: Workout[];
	goals: Goal[];
	healthMetrics: HealthMetric[];
	stats: DashboardStats;
	weeklyData: WeeklyData[];
	weightData: WeightData[];
}

// Component biểu đồ cột đơn giản
const SimpleBarChart = ({ data }: { data: WeeklyData[] }) => {
	const maxCount = Math.max(...data.map(d => d.count), 1);
	return (
		<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 250, padding: '20px 10px' }}>
			{data.map((item, index) => (
				<div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
					<div style={{ 
						width: '60%', 
						height: `${(item.count / maxCount) * 180}px`, 
						background: '#1890ff', 
						borderRadius: '4px 4px 0 0',
						minHeight: item.count > 0 ? '20px' : '0px',
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'center',
						marginBottom: '8px'
					}}>
						<Text style={{ color: '#fff', fontSize: '12px', padding: '4px' }}>{item.count}</Text>
					</div>
					<Text type="secondary">{item.week}</Text>
				</div>
			))}
		</div>
	);
};

// Component biểu đồ đường đơn giản
const SimpleLineChart = ({ data }: { data: WeightData[] }) => {
	if (data.length < 2) return <div style={{ height: 250, padding: 20 }}>Chưa đủ dữ liệu</div>;
	
	const minWeight = Math.min(...data.map(d => d.weight)) - 1;
	const maxWeight = Math.max(...data.map(d => d.weight)) + 1;
	const range = maxWeight - minWeight;
	
	const points = data.map((d, i) => ({
		x: (i / (data.length - 1)) * 100,
		y: ((maxWeight - d.weight) / range) * 100,
		weight: d.weight,
		date: d.date
	})).reverse();
	
	return (
		<div style={{ height: 250, padding: '20px', position: 'relative' }}>
			{/* Grid lines */}
			<div style={{ position: 'absolute', top: 20, left: 40, right: 20, bottom: 40 }}>
				{[0, 1, 2, 3, 4].map(i => (
					<div key={i} style={{ 
						position: 'absolute', 
						top: `${i * 25}%`, 
						left: 0, 
						right: 0, 
						borderTop: '1px dashed #f0f0f0' 
					}} />
				))}
			</div>
			{/* Line and points */}
			<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
				<polyline
					fill="none"
					stroke="#52c41a"
					strokeWidth="2"
					points={points.map(p => `${p.x},${p.y}`).join(' ')}
				/>
				{points.map((p, i) => (
					<circle key={i} cx={p.x} cy={p.y} r="2" fill="#52c41a" />
				))}
			</svg>
			{/* Labels */}
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
				{data.map((d, i) => (
					<Text key={i} type="secondary" style={{ fontSize: 11 }}>{d.date.slice(5)}</Text>
				))}
			</div>
		</div>
	);
};

export default function Dashboard({ workouts, goals, healthMetrics, stats, weeklyData, weightData }: DashboardProps) {
	return (
		<div>
			{/* Stats Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Tổng buổi tập trong tháng'
							value={stats.totalSessions}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Tổng calo đã đốt'
							value={stats.totalCalories}
							prefix={<FireOutlined />}
							suffix='kcal'
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Số ngày tập liên tiếp'
							value={stats.streak}
							prefix={<RunOutlined />}
							suffix='ngày'
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Mục tiêu hoàn thành'
							value={stats.goalCompletion}
							prefix={<TrophyOutlined />}
							suffix='%'
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Số buổi tập theo tuần'>
						<SimpleBarChart data={weeklyData} />
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Cân nặng theo thời gian'>
						<SimpleLineChart data={weightData} />
					</Card>
				</Col>
			</Row>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Cân nặng theo thời gian'>
						<Line
							data={weightData}
							xField='date'
							yField='weight'
							color='#52c41a'
							label={{ position: 'top' as const }}
							height={250}
						/>
					</Card>
				</Col>
			</Row>

			{/* Recent Workouts Timeline */}
			<Card title='5 buổi tập gần nhất'>
				<Timeline
					items={workouts.slice(0, 5).map((w) => ({
						color: w.status === 'completed' ? 'green' : 'red',
						children: (
							<div>
								<Text strong>{w.type}</Text>
								<br />
								<Text type='secondary'>
									{w.date} - {w.duration} phút - {w.calories} calo
								</Text>
								{w.note && <> - {w.note}</>}
							</div>
						),
					}))}
				/>
			</Card>
		</div>
	);
}
