import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import CourseDelete from './CourseDelete';

const { Option } = Select;

interface Course {
	id: string;
	name: string;
	instructor: string;
	studentCount: number;
	status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
	description: string;
}

interface CourseListProps {
	courses: Course[];
	instructors: string[];
	onAdd: () => void;
	onEdit: (course: Course) => void;
	onDelete: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, instructors, onAdd, onEdit, onDelete }) => {
	const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
	const [searchText, setSearchText] = useState('');
	const [instructorFilter, setInstructorFilter] = useState<string | undefined>();
	const [statusFilter, setStatusFilter] = useState<string | undefined>();

	useEffect(() => {
		let filtered = courses.filter((course) => course.name.toLowerCase().includes(searchText.toLowerCase()));
		if (instructorFilter) {
			filtered = filtered.filter((course) => course.instructor === instructorFilter);
		}
		if (statusFilter && statusFilter !== 'all') {
			filtered = filtered.filter((course) => course.status === statusFilter);
		}
		setFilteredCourses(filtered);
	}, [courses, searchText, instructorFilter, statusFilter]);

	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	const handleInstructorFilter = (value: string | undefined) => {
		setInstructorFilter(value);
	};

	const handleStatusFilter = (value: string | undefined) => {
		setStatusFilter(value);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giảng viên',
			dataIndex: 'instructor',
			key: 'instructor',
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'studentCount',
			key: 'studentCount',
			sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				let color = 'green';
				if (status === 'Đã kết thúc') color = 'red';
				if (status === 'Tạm dừng') color = 'orange';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (record: Course) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
						Chỉnh sửa
					</Button>
					<CourseDelete course={record} onDelete={onDelete} />
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Input
					placeholder='Tìm kiếm theo tên khóa học'
					prefix={<SearchOutlined />}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ width: 200 }}
				/>
				<Select placeholder='Bộ lọc giảng viên' allowClear onChange={handleInstructorFilter} style={{ width: 150 }}>
					{instructors.map((instructor) => (
						<Option key={instructor} value={instructor}>
							{instructor}
						</Option>
					))}
				</Select>
				<Select placeholder='Bộ lọc trạng thái' allowClear onChange={handleStatusFilter} style={{ width: 150 }}>
					<Option value='all'>Tất cả</Option>
					<Option value='Đang mở'>Đang mở</Option>
					<Option value='Đã kết thúc'>Đã kết thúc</Option>
					<Option value='Tạm dừng'>Tạm dừng</Option>
				</Select>
				<Button type='primary' icon={<PlusOutlined />} onClick={onAdd}>
					Thêm mới
				</Button>
			</Space>
			<Table columns={columns} dataSource={filteredCourses} rowKey='id' />
		</div>
	);
};

export default CourseList;
