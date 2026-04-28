import { useState, useMemo } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { CalendarOutlined, RocketOutlined, HeartOutlined, AimOutlined, FireOutlined } from '@ant-design/icons';

import Dashboard from './components/Dashboard';
import WorkoutLog from './components/WorkoutLog';
import HealthLog from './components/HealthLog';
import GoalManager from './components/GoalManager';
import ExerciseLibrary from './components/ExerciseLibrary';

import { Workout, HealthMetric, Goal, Exercise, DashboardStats, WeeklyData, WeightData } from './types';
import { initialWorkouts, initialHealthMetrics, initialGoals, initialExercises } from './mockData';

const { Title } = Typography;

type TabKey = 'dashboard' | 'workout' | 'health' | 'goals' | 'exercises';

const tabConfig = [
	{ key: 'dashboard', label: 'Dashboard', icon: <CalendarOutlined /> },
	{ key: 'workout', label: 'Nhật ký tập luyện', icon: <RocketOutlined /> },
	{ key: 'health', label: 'Nhật ký chỉ số', icon: <HeartOutlined /> },
	{ key: 'goals', label: 'Quản lý mục tiêu', icon: <AimOutlined /> },
	{ key: 'exercises', label: 'Thư viện bài tập', icon: <FireOutlined /> },
];

export default function ThucHanh08() {
	const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

	// Data states
	const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
	const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(initialHealthMetrics);
	const [goals, setGoals] = useState<Goal[]>(initialGoals);
	const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

	// ============ DASHBOARD CALCULATIONS ============
	const dashboardStats = useMemo((): DashboardStats => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const monthlyWorkouts = workouts.filter((w) => {
			const date = new Date(w.date);
			return date.getMonth() === currentMonth && date.getFullYear() === currentYear && w.status === 'completed';
		});

		const totalSessions = monthlyWorkouts.length;
		const totalCalories = monthlyWorkouts.reduce((sum, w) => sum + w.calories, 0);

		// Calculate streak
		let streak = 0;
		const sortedDates = [...new Set(workouts.filter((w) => w.status === 'completed').map((w) => w.date))]
			.sort()
			.reverse();
		if (sortedDates.length > 0) {
			const today = new Date().toISOString().split('T')[0];
			const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

			if (sortedDates[0] === today || sortedDates[0] === yesterday) {
				streak = 1;
				let checkDate = new Date(sortedDates[0]);
				for (let i = 1; i < sortedDates.length; i++) {
					const prevDate = new Date(checkDate.getTime() - 86400000);
					const prevDateStr = prevDate.toISOString().split('T')[0];
					if (sortedDates[i] === prevDateStr) {
						streak++;
						checkDate = prevDate;
					} else {
						break;
					}
				}
			}
		}

		// Goal completion
		const activeGoals = goals.filter((g) => g.status === 'active');
		const goalCompletion =
			activeGoals.length > 0
				? Math.round(
						activeGoals.reduce((sum, g) => sum + (g.currentValue / g.targetValue) * 100, 0) / activeGoals.length,
				  )
				: 0;

		return { totalSessions, totalCalories, streak, goalCompletion };
	}, [workouts, goals]);

	const weeklyData = useMemo((): WeeklyData[] => {
		const weeks: WeeklyData[] = [];
		const now = new Date();

		for (let i = 3; i >= 0; i--) {
			const weekStart = new Date(now);
			weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6);

			const count = workouts.filter((w) => {
				const date = new Date(w.date);
				return date >= weekStart && date <= weekEnd && w.status === 'completed';
			}).length;

			weeks.push({ week: `Tuần ${4 - i}`, count });
		}

		return weeks;
	}, [workouts]);

	const weightData = useMemo((): WeightData[] => {
		return healthMetrics
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map((m) => ({ date: m.date, weight: m.weight }));
	}, [healthMetrics]);

	// ============ HANDLERS ============
	const handleWorkoutSave = (workout: Workout | null, values: any) => {
		if (workout) {
			setWorkouts((prev) => prev.map((w) => (w.id === workout.id ? { ...w, ...values } : w)));
		} else {
			const newWorkout: Workout = {
				...values,
				id: Date.now().toString(),
				status: values.status || 'completed',
			};
			setWorkouts((prev) => [newWorkout, ...prev]);
		}
	};

	const handleWorkoutDelete = (id: string) => {
		setWorkouts((prev) => prev.filter((w) => w.id !== id));
	};

	const handleHealthSave = (metric: HealthMetric | null, values: any) => {
		if (metric) {
			setHealthMetrics((prev) => prev.map((m) => (m.id === metric.id ? { ...m, ...values } : m)));
		} else {
			const newMetric: HealthMetric = {
				...values,
				id: Date.now().toString(),
			};
			setHealthMetrics((prev) => [newMetric, ...prev]);
		}
	};

	const handleHealthDelete = (id: string) => {
		setHealthMetrics((prev) => prev.filter((m) => m.id !== id));
	};

	const handleGoalSave = (goal: Goal | null, values: any) => {
		if (goal) {
			setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, ...values } : g)));
		} else {
			const newGoal: Goal = {
				...values,
				id: Date.now().toString(),
				status: 'active',
			};
			setGoals((prev) => [newGoal, ...prev]);
		}
	};

	const handleGoalDelete = (id: string) => {
		setGoals((prev) => prev.filter((g) => g.id !== id));
	};

	const handleGoalValueChange = (id: string, value: number) => {
		setGoals((prev) =>
			prev.map((g) => {
				if (g.id === id) {
					const newStatus = value >= g.targetValue ? 'achieved' : g.status;
					return { ...g, currentValue: value, status: newStatus };
				}
				return g;
			}),
		);
	};

	const handleExerciseSave = (exercise: Exercise | null, values: any) => {
		if (exercise) {
			setExercises((prev) => prev.map((e) => (e.id === exercise.id ? { ...e, ...values } : e)));
		} else {
			const newExercise: Exercise = {
				...values,
				id: Date.now().toString(),
			};
			setExercises((prev) => [newExercise, ...prev]);
		}
	};

	const handleExerciseDelete = (id: string) => {
		setExercises((prev) => prev.filter((e) => e.id !== id));
	};

	// ============ RENDER ============
	const renderContent = () => {
		switch (activeTab) {
			case 'dashboard':
				return (
					<Dashboard
						workouts={workouts}
						goals={goals}
						healthMetrics={healthMetrics}
						stats={dashboardStats}
						weeklyData={weeklyData}
						weightData={weightData}
					/>
				);
			case 'workout':
				return <WorkoutLog workouts={workouts} onSave={handleWorkoutSave} onDelete={handleWorkoutDelete} />;
			case 'health':
				return <HealthLog healthMetrics={healthMetrics} onSave={handleHealthSave} onDelete={handleHealthDelete} />;
			case 'goals':
				return (
					<GoalManager
						goals={goals}
						onSave={handleGoalSave}
						onDelete={handleGoalDelete}
						onUpdateValue={handleGoalValueChange}
					/>
				);
			case 'exercises':
				return <ExerciseLibrary exercises={exercises} onSave={handleExerciseSave} onDelete={handleExerciseDelete} />;
			default:
				return null;
		}
	};

	return (
		<div style={{ padding: '0 16px' }}>
			<Card>
				<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
					<Col>
						<Title level={2} style={{ margin: 0 }}>
							💪 Ứng dụng Thể dục & Sức khỏe
						</Title>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} md={4}>
						<Card bodyStyle={{ padding: 8 }}>
							{tabConfig.map((item) => (
								<div
									key={item.key}
									onClick={() => setActiveTab(item.key as TabKey)}
									style={{
										padding: '12px 16px',
										cursor: 'pointer',
										borderRadius: 8,
										background: activeTab === item.key ? '#e6f7ff' : 'transparent',
										color: activeTab === item.key ? '#1890ff' : '#666',
										fontWeight: activeTab === item.key ? 600 : 400,
										marginBottom: 4,
										display: 'flex',
										alignItems: 'center',
										gap: 8,
									}}
								>
									{item.icon}
									<span>{item.label}</span>
								</div>
							))}
						</Card>
					</Col>
					<Col xs={24} md={20}>
						{renderContent()}
					</Col>
				</Row>
			</Card>
		</div>
	);
}
