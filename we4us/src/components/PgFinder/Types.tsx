import { PostView, CommentView } from "lemmy-js-client"

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
    cost: number,
    safety: number,
    food: number,
    cleanliness: number
}

export type ReviewContent = {
    content: string,
    ratings: Ratings
}

export function getPgPostBody(postView: PostView) {
    if (!postView.post.body) return null
    return JSON.parse(postView.post.body) as PgPostBody
}

export function getReviewContent(review: CommentView) {
    return JSON.parse(review.comment.content) as ReviewContent
}

function Add(r1: Ratings, r2: Ratings) {
    return {
        cost: (r1.cost || 0) + (r2.cost || 0),
        cleanliness: (r1.cleanliness || 0) + (r2.cleanliness || 0),
        food: (r1.food || 0) + (r2.food || 0),
        safety: (r1.safety || 0) + (r2.safety || 0),
    } as Ratings
}

export function Average(ratings: Ratings[]) {
    const counts: Ratings = {
        cost: ratings.filter(rating => rating.cost != null).length,
        cleanliness: ratings.filter(rating => rating.cleanliness != null).length,
        food: ratings.filter(rating => rating.food != null).length,
        safety: ratings.filter(rating => rating.safety != null).length,
    }

    const sum: Ratings = ratings.reduce((prev: Ratings, curr: Ratings) => Add(prev, curr))
    
    return {
        cost: counts.cost ? (sum.cost || 0) / counts.cost : 0,
        cleanliness: counts.cleanliness ? (sum.cleanliness || 0) / counts.cleanliness : 0,
        food: counts.food ? (sum.food || 0) / counts.food : 0,
        safety: counts.safety ? (sum.safety || 0) / counts.safety : 0,
    } as Ratings
}