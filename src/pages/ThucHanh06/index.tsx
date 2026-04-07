import { useMemo, useState } from 'react';
import { Card, Tabs } from 'antd';
import './index.less';
import DestinationExplorer from './DestinationExplorer';
import ItineraryPlanner from './ItineraryPlanner';
import BudgetManager from './BudgetManager';
import AdminPanel from './AdminPanel';
import DestinationFormModal from './DestinationFormModal';
import {
	Destination,
	DestinationFormValues,
	ItineraryItem,
	defaultMonthlyStats,
	generateId,
	initialDestinations,
} from './data';
import { getFilteredDestinations, getItineraryDetails, getPopularDestinations, getTotalBudgets } from './utils';

const ThucHanh06 = () => {
	const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
	const [filterType, setFilterType] = useState<string>('all');
	const [filterRating, setFilterRating] = useState<number>(0);
	const [sortKey, setSortKey] = useState<string>('rating');
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [selectedDest, setSelectedDest] = useState<string>(initialDestinations[0]?.id ?? '');
	const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
	const [budgetCap, setBudgetCap] = useState<number>(3000);
	const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
	const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

	const filteredDestinations = useMemo(
		() => getFilteredDestinations(destinations, filterType, filterRating, sortKey),
		[destinations, filterType, filterRating, sortKey],
	);

	const itineraryDetails = useMemo(() => getItineraryDetails(itinerary, destinations), [itinerary, destinations]);
	const totalBudgets = useMemo(() => getTotalBudgets(itineraryDetails), [itineraryDetails]);
	const popularDestinations = useMemo(() => getPopularDestinations(itinerary, destinations), [itinerary, destinations]);

	const handleAddToItinerary = (destinationId?: string) => {
		const destId = destinationId ?? selectedDest;
		if (!destId) return;
		setSelectedDest(destId);
		setItinerary((current) => [...current, { key: generateId(), destId, day: selectedDay }]);
	};

	const handleMoveItem = (key: string, direction: 'up' | 'down') => {
		const next = [...itinerary];
		const index = next.findIndex((item) => item.key === key);
		if (index === -1) return;
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= next.length) return;
		[next[index], next[targetIndex]] = [next[targetIndex], next[index]];
		setItinerary(next);
	};

	const handleDeleteDestination = (id: string) => {
		setDestinations((current) => current.filter((item) => item.id !== id));
		setItinerary((current) => current.filter((item) => item.destId !== id));
	};

	const handleOpenAdminModal = () => {
		setEditingDestination(null);
		setIsAdminModalVisible(true);
	};

	const handleSaveDestination = (values: DestinationFormValues, id?: string) => {
		const destination: Destination = {
			id: id ?? `dest-${Date.now()}`,
			name: values.name,
			type: values.type,
			city: values.city,
			rating: Number(values.rating),
			price: Number(values.price),
			duration: Number(values.duration),
			budgets: {
				food: Number(values.food),
				stay: Number(values.stay),
				travel: Number(values.travel),
				other: Number(values.other),
			},
			description: values.description,
			image: values.image,
		};

		if (editingDestination) {
			setDestinations((current) => current.map((item) => (item.id === destination.id ? destination : item)));
		} else {
			setDestinations((current) => [destination, ...current]);
			setSelectedDest(destination.id);
		}

		setEditingDestination(null);
		setIsAdminModalVisible(false);
	};

	return (
		<div className='thuc-hanh-06'>
			<Card title='Ứng dụng lập kế hoạch du lịch' className='page-card'>
				<p>
					Ứng dụng demo tập trung trong ThucHanh06: khám phá điểm đến, lập lịch trình, quản lý ngân sách và trang quản
					trị.
				</p>
				<Tabs defaultActiveKey='1'>
					<Tabs.TabPane tab='1. Khám phá điểm đến' key='1'>
						<DestinationExplorer
							destinations={filteredDestinations}
							filterType={filterType}
							filterRating={filterRating}
							sortKey={sortKey}
							onChangeType={setFilterType}
							onChangeRating={(value) => setFilterRating(Number(value))}
							onChangeSort={setSortKey}
							onAddToItinerary={handleAddToItinerary}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane tab='2. Tạo lịch trình' key='2'>
						<ItineraryPlanner
							destinations={destinations}
							itineraryDetails={itineraryDetails}
							selectedDay={selectedDay}
							selectedDest={selectedDest}
							onChangeDay={setSelectedDay}
							onChangeDest={setSelectedDest}
							onAddToItinerary={() => handleAddToItinerary()}
							onMoveItem={handleMoveItem}
							onRemoveItem={(key) => setItinerary((current) => current.filter((item) => item.key !== key))}
						/>
						<BudgetManager totalBudgets={totalBudgets} budgetCap={budgetCap} onBudgetCapChange={setBudgetCap} />
					</Tabs.TabPane>
					<Tabs.TabPane tab='3. Quản lý ngân sách' key='3'>
						<BudgetManager totalBudgets={totalBudgets} budgetCap={budgetCap} onBudgetCapChange={setBudgetCap} />
					</Tabs.TabPane>
					<Tabs.TabPane tab='4. Trang quản trị' key='4'>
						<AdminPanel
							destinations={destinations}
							monthlyStats={defaultMonthlyStats}
							popularDestinations={popularDestinations}
							estimatedRevenue={Math.round(totalBudgets.total * 1.1)}
							onEditDestination={(destination) => {
								setEditingDestination(destination);
								setIsAdminModalVisible(true);
							}}
							onDeleteDestination={handleDeleteDestination}
							onOpenAddModal={handleOpenAdminModal}
						/>
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<DestinationFormModal
				visible={isAdminModalVisible}
				editingDestination={editingDestination}
				onCancel={() => {
					setEditingDestination(null);
					setIsAdminModalVisible(false);
				}}
				onSubmit={handleSaveDestination}
			/>
		</div>
	);
};

export default ThucHanh06;
