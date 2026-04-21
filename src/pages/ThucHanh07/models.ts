export interface Post {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverImage: string;
	author: string;
	publishedAt: string;
	tags: string[];
	status: 'draft' | 'published';
	views: number;
}

export interface Tag {
	id: number;
	name: string;
	postCount: number;
}
