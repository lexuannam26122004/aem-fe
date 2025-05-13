import { IFilter } from './Common'

export interface IBlogPostCreate {
    postTitle: string
    postContent: string
    publishDate: string
    slug: string
    featuredImage: string
    description: string
    isPublished: boolean
}

export interface IBlogPostUpdate extends IBlogPostCreate {
    isActive: boolean
}

export interface IBlogPost extends IBlogPostUpdate {
    id: number
    createdAt: string
    createdBy: string
    authorName: string
    viewCount: number
    authorAvatar?: string | null
}

export interface IBlogPostFilter extends IFilter {
    isPublished?: boolean
}
