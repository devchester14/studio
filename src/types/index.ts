export interface Content {
  id: string;
  title: string;
  platform: string;
  availability: string;
  imageUrl: string;
  aiHint: string;
  reason?: string;
  plot?: string;
  actors?: string;
  genre?: string;
}

export interface AvailabilityOption {
  platform: string;
  availability: 'Subscription' | 'Rental' | 'Purchase';
  price: string;
}
