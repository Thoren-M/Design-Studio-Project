export interface Card {
    _id: string;
    id: string | number ;
    front: string;
    back: string;
}

export type CreateCardDto = Omit<Card, '_id' | 'id'>;

export type UpdateCardDto = Partial<Omit<Card, 'id'>>;