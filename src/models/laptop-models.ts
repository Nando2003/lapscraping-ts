export interface LaptopReview {
    stars: number;
    amountReviews: number;
}

export interface Laptop {
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
    reviews: LaptopReview;
}
