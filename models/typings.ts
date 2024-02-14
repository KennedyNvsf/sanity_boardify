


export enum ACTION {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}
  
export enum ENTITY_TYPE {
    BOARD = 'BOARD',
    LIST = 'LIST',
    CARD = 'CARD'
}

export type Ref = {
    _type?: string;
    _ref: string;
}


export type Card = {
    _id: string;
    _ref?: string;
    title: string;
    order: number;
    description?: string;
    listId: string;
    // list: List;
    createdAt?: string;
    updatedAt?: string;
}

export type List = {
    _id: string;
    _ref?: string;
    title: string;
    order?: number;
    boardId: string;
    cards?: Card[];
    createdAt?: string;
    updatedAt?: string;
}


export type Board = {
    _id: string;
    _ref?: string;
    orgId?: string;
    title?: string;
    imageId?: string;
    imageThumbUrl?: string;
    imageFullUrl?: string;
    imageUsername?: string;
    imageLinkHTML?: string;
    lists?: List[];
    createdAt?: string;
    updatedAt?: string;
}

export type AuditLog = {
    _id: string;
    orgId: string;
    action: ACTION;
    entityId: string;
    entityType: ENTITY_TYPE;
    entityTitle: string;
    userId: string;
    userImage: string;
    userName: string;
    createdAt?: string;
    updatedAt?: string;
}

export type OrgLimit = {
    _id: string;
    orgId: string;
    count: number;
    createdAt?: string;
    updatedAt?: string;
}

export type OrgSubscription = {
    _id: string;
    orgId: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    stripeCurrentPeriodEnd?: string;
}