import { IUser } from 'nooket-common';

export interface ILane {
  id: string;
  title: string;
  label?: string;
  style?: any;
  cards: ICard[];
  order: number;
}

export interface ICard {
  id: string;
  laneId: string;
  title: string;
  assigned?: string;
  assignedUser?: IUser;
  dueDate?: Date;
  hoursOfWork: number;
  order: number;
  color: string;
  noFiltered: boolean;
}

export interface IColor {
  color: string;
  name: string;
}

export interface IBoardData {
  lanes: ILane[];
  totalCards?: number;
  users?: IUser[];
  colors?: IColor[];
}
