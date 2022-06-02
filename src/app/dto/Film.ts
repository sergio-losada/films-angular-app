export interface Film {
    title: string;
    synopsis: string;
    poster: string;
    budget: number;
    release: Date;
    all_ages: boolean;
    production: Production;
    cast: Cast[];
    genres: string[];
}

export interface Production {
    producer: string;
    country: string;
}

export interface Cast {
    actor: string;
    role: string;
}