// ============ TYPES ============
export interface Workout {
	id: string;
	date: string;
	type: string;
	duration: number;
	calories: number;
	note: string;
	status: 'completed' | 'missed';
}

export interface HealthMetric {
	id: string;
	date: string;
	weight: number;
	height: number;
	restingHeartRate: number;
	sleepHours: number;
}

export interface Goal {
	id: string;
	name: string;
	type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'other';
	targetValue: number;
	currentValue: number;
	deadline: string;
	status: 'active' | 'achieved' | 'cancelled';
}

export interface Exercise {
	id: string;
	name: string;
	muscleGroup: string;
	difficulty: 'easy' | 'medium' | 'hard';
	description: string;
	caloriesPerHour: number;
	instructions: string;
}

export interface DashboardStats {
	totalSessions: number;
	totalCalories: number;
	streak: number;
	goalCompletion: number;
}

export interface WeeklyData {
	week: string;
	count: number;
}

export interface WeightData {
	date: string;
	weight: number;
}

export interface BMICategory {
	label: string;
	color: string;
}
