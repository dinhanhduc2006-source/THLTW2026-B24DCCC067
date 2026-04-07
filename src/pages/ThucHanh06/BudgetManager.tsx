import { Card, Col, Progress, Row, Statistic } from 'antd';

type Props = {
	totalBudgets: {
		food: number;
		stay: number;
		travel: number;
		other: number;
		total: number;
	};
	budgetCap: number;
	onBudgetCapChange: (value: number) => void;
};

const BudgetManager = ({ totalBudgets, budgetCap, onBudgetCapChange }: Props) => {
	const progress = budgetCap > 0 ? Math.min(100, Math.round((totalBudgets.total / budgetCap) * 100)) : 0;

	return (
		<Row gutter={[16, 16]} className='section'>
			<Col xs={24} md={12}>
				<Card title='Tổng ngân sách' bordered>
					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Statistic title='Ăn uống' value={totalBudgets.food} suffix='VNĐ' />
						</Col>
						<Col span={12}>
							<Statistic title='Lưu trú' value={totalBudgets.stay} suffix='VNĐ' />
						</Col>
						<Col span={12}>
							<Statistic title='Di chuyển' value={totalBudgets.travel} suffix='VNĐ' />
						</Col>
						<Col span={12}>
							<Statistic title='Khác' value={totalBudgets.other} suffix='VNĐ' />
						</Col>
						<Col span={24} style={{ marginTop: 16 }}>
							<Statistic title='Tổng chi' value={totalBudgets.total} suffix='VNĐ' />
						</Col>
					</Row>
				</Card>
			</Col>

			<Col xs={24} md={12}>
				<Card title='Giới hạn ngân sách' bordered>
					<Statistic title='Ngân sách tối đa' value={budgetCap} suffix='VNĐ' />
					<Progress percent={progress} status={progress >= 100 ? 'exception' : 'active'} />
					<div style={{ marginTop: 16 }}>
						<Statistic title='Chênh lệch' value={budgetCap - totalBudgets.total} suffix='VNĐ' />
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default BudgetManager;
