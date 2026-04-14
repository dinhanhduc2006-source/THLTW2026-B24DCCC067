import React from 'react';
import { Popconfirm, message } from 'antd';

interface Course {
	id: string;
	name: string;
	instructor: string;
	studentCount: number;
	status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
	description: string;
}

interface CourseDeleteProps {
	course: Course;
	onDelete: (id: string) => void;
}

const CourseDelete: React.FC<CourseDeleteProps> = ({ course, onDelete }) => {
	const handleDelete = () => {
		if (course.studentCount > 0) {
			message.error('Không thể xóa khóa học đã có học viên!');
			return;
		}
		onDelete(course.id);
		message.success('Xóa khóa học thành công!');
	};

	return (
		<Popconfirm
			title={`Bạn có chắc chắn muốn xóa khóa học "${course.name}"?`}
			onConfirm={handleDelete}
			okText='Xóa'
			cancelText='Hủy'
		>
			<a href='#' style={{ color: 'red' }}>
				Xóa
			</a>
		</Popconfirm>
	);
};

export default CourseDelete;
