export interface Task {
	id: string;
	title: string;
	description: string;
	deadline: string; // ISO string
	priority: 'Cao' | 'Trung bình' | 'Thấp';
	tags: string[];
	status: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
	createdAt: string;
}

export type TaskStatus = Task['status'];
