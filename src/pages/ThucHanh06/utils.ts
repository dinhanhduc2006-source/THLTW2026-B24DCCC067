import type { Destination, ItineraryItem } from './data';

export type ItineraryDetail = {
	key: string;
	destination: Destination;
	day: number;
};

export const getFilteredDestinations = (
	destinations: Destination[],
	filterType: string,
	filterRating: number,
	sortKey: string,
) => {
	return destinations
		.filter((destination) => (filterType === 'all' ? true : destination.type === filterType))
		.filter((destination) => destination.rating >= filterRating)
		.sort((a, b) => {
			if (sortKey === 'price') {
				return a.price - b.price;
			}
			return b.rating - a.rating;
		});
};

export const getItineraryDetails = (itinerary: ItineraryItem[], destinations: Destination[]) => {
	return itinerary
		.map((item) => {
			const destination = destinations.find((dest) => dest.id === item.destId);
			return destination ? { key: item.key, destination, day: item.day } : null;
		})
		.filter((detail): detail is { key: string; destination: Destination; day: number } => detail !== null);
};

export const getTotalBudgets = (itineraryDetails: Array<{ destination: Destination; day: number; key: string }>) => {
	const totals = itineraryDetails.reduce(
		(acc, item) => ({
			food: acc.food + item.destination.budgets.food,
			stay: acc.stay + item.destination.budgets.stay,
			travel: acc.travel + item.destination.budgets.travel,
			other: acc.other + item.destination.budgets.other,
			total: acc.total + Object.values(item.destination.budgets).reduce((sum, value) => sum + value, 0),
		}),
		{ food: 0, stay: 0, travel: 0, other: 0, total: 0 },
	);

	return totals;
};

export const getPopularDestinations = (itinerary: ItineraryItem[], destinations: Destination[]) => {
	const counts = itinerary.reduce<Record<string, number>>((acc, item) => {
		acc[item.destId] = (acc[item.destId] ?? 0) + 1;
		return acc;
	}, {});

	return Object.entries(counts)
		.sort(([, aCount], [, bCount]) => bCount - aCount)
		.slice(0, 3)
		.map(([destId]) => destinations.find((dest) => dest.id === destId))
		.filter((dest): dest is Destination => Boolean(dest));
};
