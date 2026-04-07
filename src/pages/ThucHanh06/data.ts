export type DestinationType = 'biển' | 'núi' | 'thành phố';

export type Destination = {
	id: string;
	name: string;
	type: DestinationType;
	city: string;
	rating: number;
	price: number;
	duration: number;
	budgets: {
		food: number;
		stay: number;
		travel: number;
		other: number;
	};
	description: string;
	image: string;
};

export type ItineraryItem = {
	key: string;
	destId: string;
	day: number;
};

export type MonthlyStat = {
	month: string;
	count: number;
};

export type DestinationFormValues = {
	name: string;
	type: DestinationType;
	city: string;
	rating: number;
	price: number;
	duration: number;
	food: number;
	stay: number;
	travel: number;
	other: number;
	description: string;
	image: string;
};

export const initialDestinations: Destination[] = [
	{
		id: 'd1',
		name: 'Bãi biển Nha Trang',
		type: 'biển',
		city: 'Nha Trang',
		rating: 4.8,
		price: 1200,
		duration: 4,
		budgets: { food: 320, stay: 520, travel: 180, other: 120 },
		description: 'Bờ cát trắng dài, nước trong, hoạt động biển đa dạng.',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
	},
	{
		id: 'd2',
		name: 'Đỉnh Fansipan',
		type: 'núi',
		city: 'Sapa',
		rating: 4.7,
		price: 1400,
		duration: 8,
		budgets: { food: 280, stay: 400, travel: 260, other: 200 },
		description: 'Chinh phục nóc nhà Đông Dương, ngắm mây trời và hoa tam giác mạch.',
		image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=900&q=80',
	},
	{
		id: 'd3',
		name: 'Phố cổ Hội An',
		type: 'thành phố',
		city: 'Hội An',
		rating: 4.9,
		price: 900,
		duration: 5,
		budgets: { food: 260, stay: 360, travel: 120, other: 160 },
		description: 'Khám phá phố đèn lồng, ẩm thực và kiến trúc cổ.',
		image: 'https://images.unsplash.com/photo-1526884352861-2a2b83f40d47?auto=format&fit=crop&w=900&q=80',
	},
	{
		id: 'd4',
		name: 'Vịnh Hạ Long',
		type: 'biển',
		city: 'Quảng Ninh',
		rating: 4.6,
		price: 1800,
		duration: 6,
		budgets: { food: 420, stay: 700, travel: 300, other: 180 },
		description: 'Du thuyền ngắm hàng nghìn đảo đá vôi và hang động nổi tiếng.',
		image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80',
	},
	{
		id: 'd5',
		name: 'Đà Lạt mộng mơ',
		type: 'núi',
		city: 'Đà Lạt',
		rating: 4.5,
		price: 1000,
		duration: 5,
		budgets: { food: 240, stay: 380, travel: 140, other: 130 },
		description: 'Khung cảnh rừng thông, quán cà phê và hồ nước yên bình.',
		image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
	},
	{
		id: 'd6',
		name: 'Hà Nội cổ kính',
		type: 'thành phố',
		city: 'Hà Nội',
		rating: 4.4,
		price: 800,
		duration: 3,
		budgets: { food: 220, stay: 280, travel: 100, other: 120 },
		description: 'Thăm Hồ Gươm, Văn Miếu và thưởng thức ẩm thực đường phố.',
		image: 'https://images.unsplash.com/photo-1546484959-f30b3f1406e0?auto=format&fit=crop&w=900&q=80',
	},
];

export const generateId = () => `item-${Math.random().toString(36).slice(2, 9)}`;

export const defaultMonthlyStats: MonthlyStat[] = [
	{ month: 'Tháng 1', count: 18 },
	{ month: 'Tháng 2', count: 13 },
	{ month: 'Tháng 3', count: 24 },
	{ month: 'Tháng 4', count: 21 },
	{ month: 'Tháng 5', count: 19 },
	{ month: 'Tháng 6', count: 28 },
];
