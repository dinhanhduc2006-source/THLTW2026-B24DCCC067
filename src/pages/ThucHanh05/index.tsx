import React, { useMemo, useState } from 'react';
import { Card, Layout, Modal, Table, Tabs } from 'antd';
import { TeamOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';
import ClubManagement from './ClubManagement';
import ApplicationManagement from './ApplicationManagement';
import MemberManagement from './MemberManagement';
import ReportDashboard from './ReportDashboard';
import { Club, Application, initialClubs, initialApplications } from './types';

const { Content } = Layout;
const { TabPane } = Tabs;

const ThucHanh05: React.FC = () => {
	const [clubs, setClubs] = useState<Club[]>(initialClubs);
	const [applications, setApplications] = useState<Application[]>(initialApplications);
	const [viewMembersClub, setViewMembersClub] = useState<Club | null>(null);

	const onSaveClub = (club: Club) => {
		setClubs((prev) =>
			prev.some((c) => c.id === club.id) ? prev.map((c) => (c.id === club.id ? club : c)) : [club, ...prev],
		);
	};

	const onDeleteClub = (id: string) => {
		setClubs((prev) => prev.filter((c) => c.id !== id));
		setApplications((prev) => prev.filter((a) => a.clubId !== id));
	};

	const onViewMembers = (club: Club) => setViewMembersClub(club);

	const onSaveApplication = (app: Application) => {
		setApplications((prev) =>
			prev.some((a) => a.id === app.id) ? prev.map((a) => (a.id === app.id ? app : a)) : [app, ...prev],
		);
	};

	const onDeleteApplication = (id: string) => {
		setApplications((prev) => prev.filter((a) => a.id !== id));
	};

	const onBulkStatus = (ids: string[], status: Application['status'], reason?: string) => {
		setApplications((prev) =>
			prev.map((a) => {
				if (!ids.includes(a.id)) return a;
				return {
					...a,
					status,
					note: status === 'Rejected' ? reason || a.note : a.note,
					history: [
						...a.history,
						{
							id: `h${Date.now()}${Math.random()}`,
							action: status,
							by: 'Admin',
							at: new Date().toISOString().slice(0, 16).replace('T', ' '),
							reason,
						},
					],
				};
			}),
		);
	};

	const approvedMembers = useMemo(
		() =>
			applications
				.filter((a) => a.status === 'Approved')
				.map((a) => ({ ...a, joinedAt: new Date().toISOString().slice(0, 10) })),
		[applications],
	);

	const onTransferMembers = (ids: string[], clubId: string) => {
		setApplications((prev) => prev.map((app) => (ids.includes(app.id) ? { ...app, clubId } : app)));
	};

	return (
		<Layout style={{ minHeight: '100vh', background: '#f0f2f5', padding: 16 }}>
			<Content>
				<Card style={{ marginBottom: 16 }}>
					<h2>Hệ thống quản lý CLB và đăng ký thành viên</h2>
				</Card>
				<Tabs defaultActiveKey='1' type='card'>
					<TabPane
						tab={
							<span>
								<TeamOutlined /> Danh sách CLB
							</span>
						}
						key='1'
					>
						<ClubManagement
							clubs={clubs}
							onSaveClub={onSaveClub}
							onDeleteClub={onDeleteClub}
							onViewMembers={onViewMembers}
						/>
					</TabPane>
					<TabPane
						tab={
							<span>
								<UnorderedListOutlined /> Quản lý đơn đăng ký
							</span>
						}
						key='2'
					>
						<ApplicationManagement
							clubs={clubs}
							applications={applications}
							onSave={onSaveApplication}
							onDelete={onDeleteApplication}
							onBulkStatus={onBulkStatus}
						/>
					</TabPane>
					<TabPane
						tab={
							<span>
								<UnorderedListOutlined /> Thành viên CLB
							</span>
						}
						key='3'
					>
						<MemberManagement members={approvedMembers} clubs={clubs} onTransfer={onTransferMembers} />
					</TabPane>
					<TabPane
						tab={
							<span>
								<BarChartOutlined /> Báo cáo
							</span>
						}
						key='4'
					>
						<ReportDashboard clubs={clubs} applications={applications} />
					</TabPane>
				</Tabs>

				<Modal
					title={viewMembersClub ? `Thành viên của ${viewMembersClub.name}` : 'Thành viên'}
					visible={!!viewMembersClub}
					onCancel={() => setViewMembersClub(null)}
					footer={null}
				>
					{viewMembersClub ? (
						<Table
							columns={[
								{ title: 'Họ tên', dataIndex: 'name', key: 'name' },
								{ title: 'Email', dataIndex: 'email', key: 'email' },
								{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
								{ title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
								{ title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
							]}
							dataSource={approvedMembers.filter((m) => m.clubId === viewMembersClub.id)}
							rowKey='id'
							pagination={{ pageSize: 6 }}
						/>
					) : null}
				</Modal>
			</Content>
		</Layout>
	);
};

export default ThucHanh05;
