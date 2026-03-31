import moment from 'moment';

export type Status = 'Pending' | 'Approved' | 'Rejected';

export interface Club {
	id: string;
	avatar: string;
	name: string;
	foundedDate: string;
	description: string;
	manager: string;
	active: boolean;
}

export interface HistoryItem {
	id: string;
	action: string;
	by: string;
	at: string;
	reason?: string;
}

export interface Application {
	id: string;
	name: string;
	email: string;
	phone: string;
	gender: string;
	address: string;
	skills: string;
	clubId: string;
	reason: string;
	status: Status;
	note?: string;
	history: HistoryItem[];
}

export interface Member {
	id: string;
	name: string;
	email: string;
	phone: string;
	gender: string;
	address: string;
	skills: string;
	clubId: string;
	joinedAt: string;
}

export const initialClubs: Club[] = [
	{
		id: 'c1',
		avatar: 'https://i.pravatar.cc/80?img=10',
		name: 'CLB Lập trình',
		foundedDate: '2021-04-15',
		description: '<p>Yêu công nghệ, thực hành dự án và chia sẻ kiến thức.</p>',
		manager: 'Nguyễn Văn A',
		active: true,
	},
	{
		id: 'c2',
		avatar: 'https://i.pravatar.cc/80?img=20',
		name: 'CLB Tiếng Anh',
		foundedDate: '2020-09-10',
		description: '<p>Nâng cao kỹ năng giao tiếp và thuyết trình.</p>',
		manager: 'Trần Thị B',
		active: true,
	},
];

export const initialApplications: Application[] = [
	{
		id: 'a1',
		name: 'Lê Thị C',
		email: 'lethi.c@example.com',
		phone: '0901234567',
		gender: 'Nữ',
		address: 'Hà Nội',
		skills: 'Thiết kế, Photoshop',
		clubId: 'c2',
		reason: 'Muốn giao tiếp tự tin hơn',
		status: 'Pending',
		note: '',
		history: [],
	},
	{
		id: 'a2',
		name: 'Phạm Văn D',
		email: 'phamvd@example.com',
		phone: '0912345678',
		gender: 'Nam',
		address: 'Hồ Chí Minh',
		skills: 'React, Node',
		clubId: 'c1',
		reason: 'Tìm cơ hội thực hành dự án',
		status: 'Approved',
		note: '',
		history: [
			{
				id: 'h1',
				action: 'Approved',
				by: 'Admin',
				at: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
				reason: 'Đủ điều kiện',
			},
		],
	},
];
