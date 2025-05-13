import { IFilter } from './Common'

export interface IReviewFilter extends IFilter {}

export interface IReview {
    avatar: string
    fullName: string
    reviewDate: string
    rating: number
    comment: string
    images?: string[]
    likes: number
    dislikes: number
}
