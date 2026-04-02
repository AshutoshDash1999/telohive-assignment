export type SpaceCategory =
  | "Coworking"
  | "Meeting Room"
  | "Private Office"
  | "Event Space"
  | "Studio";

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Space {
  id: number;
  name: string;
  city: string;
  category: SpaceCategory;
  pricePerDay: number;
  capacity: number;
  rating: number;
  amenities: string[];
  imageUrl: string;
  description: string;
}

export interface Booking {
  id: number;
  spaceId: number;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface SavedItem {
  id: number;
  userId: string;
  spaceId: number;
  savedAt: string;
}

export interface MockDb {
  spaces: Space[];
  bookings: Booking[];
  saved: SavedItem[];
}
