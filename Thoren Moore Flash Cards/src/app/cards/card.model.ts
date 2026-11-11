export interface Card {
    id: number ;
    front: string;
    back: string;
}

export type CreateCardDto = Omit<Card, 'id'>;

export type UpdateCardDto = Partial<Omit<Card, 'id'>>;