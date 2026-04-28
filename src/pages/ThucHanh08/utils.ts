import { BMICategory } from './types';

// Tính BMI theo công thức: BMI = Cân nặng (kg) / (Chiều cao (m))²
export const calculateBMI = (weight: number, height: number): number => {
	const heightInM = height / 100;
	return Number((weight / (heightInM * heightInM)).toFixed(1));
};

// Phân loại BMI và trả về label + color
export const getBMICategory = (bmi: number): BMICategory => {
	if (bmi < 18.5) return { label: 'Thiếu cân', color: '#1890ff' };
	if (bmi <= 24.9) return { label: 'Bình thường', color: '#52c41a' };
	if (bmi <= 29.9) return { label: 'Thừa cân', color: '#faad14' };
	return { label: 'Béo phì', color: '#ff4d4f' };
};

// Lấy màu theo độ khó
export const getDifficultyColor = (difficulty: string): string => {
	switch (difficulty) {
		case 'easy':
			return 'green';
		case 'medium':
			return 'orange';
		case 'hard':
			return 'red';
		default:
			return 'default';
	}
};

// Lấy label độ khó tiếng Việt
export const getDifficultyLabel = (difficulty: string): string => {
	switch (difficulty) {
		case 'easy':
			return 'Dễ';
		case 'medium':
			return 'Trung bình';
		case 'hard':
			return 'Khó';
		default:
			return difficulty;
	}
};

// Lấy màu theo trạng thái
export const getStatusColor = (status: string): string => {
	switch (status) {
		case 'completed':
			return 'green';
		case 'missed':
			return 'red';
		case 'active':
			return 'blue';
		case 'achieved':
			return 'green';
		case 'cancelled':
			return 'default';
		default:
			return 'default';
	}
};

// Lấy label loại mục tiêu tiếng Việt
export const getGoalTypeLabel = (type: string): string => {
	switch (type) {
		case 'weight_loss':
			return 'Giảm cân';
		case 'muscle_gain':
			return 'Tăng cơ';
		case 'endurance':
			return 'Cải thiện sức bền';
		case 'other':
			return 'Khác';
		default:
			return type;
	}
};

// Lấy label trạng thái tiếng Việt
export const getStatusLabel = (status: string): string => {
	switch (status) {
		case 'completed':
			return 'Hoàn thành';
		case 'missed':
			return 'Bỏ lỡ';
		case 'active':
			return 'Đang thực hiện';
		case 'achieved':
			return 'Đã đạt';
		case 'cancelled':
			return 'Đã hủy';
		default:
			return status;
	}
};
