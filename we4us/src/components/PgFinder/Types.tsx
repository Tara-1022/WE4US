export type PgPostData = {
    name: string,
    body: PgPostBody,
    url: string
}

export type PgPostBody = {
    location: string,
    acAvailable: boolean,
    foodType: string,
    description: string
}

export type Ratings = {
    cost: number | null,
    safety: number | null,
    food: number | null,
    cleanliness: number | null
}