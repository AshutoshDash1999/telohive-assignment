import type { BookingStatus, SpaceCategory } from "@/types/entities";

export interface BookingListItem {
  id: number;
  spaceId: number;
  spaceName: string;
  date: string;
  startDate: string;
  endDate: string;
  type: SpaceCategory;
  status: BookingStatus;
  amount: number;
}
