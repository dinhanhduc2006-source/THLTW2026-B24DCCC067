import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CourseList from './CourseList';
import CourseForm from './CourseForm';

interface Course {
	id: string;
	name: string;
	instructor: string;
	studentCount: number;
	status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
	description: string;
}

const instructors = ['Đinh Anh Đức', 'Phan Quang Thành', 'Ngô Văn Nhận', 'Đặng Anh Tuấn', 'Ngô Hương Hà'];
const LOCAL_STORAGE_KEY = 'kiemtragiuki_courses';

const defaultCourses: Course[] = [
	{
		id: '1',
		name: 'Khóa học React',
		instructor: 'Đinh Anh Đức',
		studentCount: 50,
		status: 'Đang mở',
		description: 'Học React cơ bản',
	},
	{
		id: '2',
		name: 'Khóa học Node.js',
		instructor: 'Phan Quang Thành',
		studentCount: 30,
		status: 'Đã kết thúc',
		description: 'Backend với Node.js',
	},
	{
		id: '3',
		name: 'Khóa học Python',
		instructor: 'Ngô Văn Nhận',
		studentCount: 0,
		status: 'Tạm dừng',
		description: 'Lập trình Python',
	},
	{
		id: '4',
		name: 'Khóa học Java',
		instructor: 'Đặng Anh Tuấn',
		studentCount: 20,
		status: 'Đang mở',
		description: 'Lập trình Java căn bản và nâng cao',
	},
	{
		id: '5',
		name: 'Khóa học C++',
		instructor: 'Ngô Hương Hà',
		studentCount: 10,
		status: 'Đang mở',
		description: 'Lập trình C++ cho người mới bắt đầu',
	},
];

const generateCourseId = (courses: Course[]) => {
	const numericIds = courses.map((course) => Number(course.id)).filter((id) => !Number.isNaN(id));
	if (numericIds.length === 0) {
		return '1';
	}
	const nextId = Math.max(...numericIds) + 1;
	return String(nextId);
};

const normalizeCourses = (courses: Course[]) => {
	const normalized: Course[] = [];
	const usedIds = new Set<string>();

	for (const course of courses) {
		if (!usedIds.has(course.id)) {
			normalized.push(course);
			usedIds.add(course.id);
		} else {
			const newCourseId = generateCourseId(normalized);
			normalized.push({ ...course, id: newCourseId });
			usedIds.add(newCourseId);
		}
	}

	return normalized;
};

const KiemTraGiuaKi: React.FC = () => {
	const [courses, setCourses] = useState<Course[]>(() => {
		if (typeof window === 'undefined') {
			return defaultCourses;
		}
		const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!stored) {
			return defaultCourses;
		}
		try {
			const parsed = JSON.parse(stored) as Course[];
			const normalized = normalizeCourses(parsed);
			const missingDefaults = defaultCourses.filter(
				(defaultCourse) => !normalized.some((course) => course.name === defaultCourse.name),
			);
			const merged = [...normalized];
			for (const missingCourse of missingDefaults) {
				merged.push({ ...missingCourse, id: generateCourseId(merged) });
			}
			return merged;
		} catch {
			return defaultCourses;
		}
	});
	const [formVisible, setFormVisible] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | undefined>();

	useEffect(() => {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
	}, [courses]);

	const handleAdd = () => {
		setEditingCourse(undefined);
		setFormVisible(true);
	};

	const handleEdit = (course: Course) => {
		setEditingCourse(course);
		setFormVisible(true);
	};

	const handleFormSubmit = (courseData: Omit<Course, 'id'>) => {
		if (editingCourse) {
			setCourses(courses.map((c) => (c.id === editingCourse.id ? { ...courseData, id: editingCourse.id } : c)));
		} else {
			const newCourse: Course = { ...courseData, id: generateCourseId(courses) };
			setCourses([...courses, newCourse]);
		}
		setFormVisible(false);
	};

	const handleDelete = (id: string) => {
		setCourses(courses.filter((c) => c.id !== id));
	};

	return (
		<PageContainer title='Quản lí khoá học'>
			<CourseList
				courses={courses}
				instructors={instructors}
				onAdd={handleAdd}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
			<CourseForm
				visible={formVisible}
				onCancel={() => setFormVisible(false)}
				onSubmit={handleFormSubmit}
				initialValues={editingCourse}
				courses={courses}
				instructors={instructors}
			/>
		</PageContainer>
	);
};

export default KiemTraGiuaKi;
