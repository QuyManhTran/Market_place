export interface ISearchProduct {
    products: {
        meta: IMeta;
        data: IProduct[];
    };
}

export interface IProduct {
    id: number;
    storeId: number;
    name: string;
    description: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    image: {
        id: number;
        url: string;
    };
}

export interface IMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
}

export interface IPagination {
    per_page: number;
    cur_page: number;
}
