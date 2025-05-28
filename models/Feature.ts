import { IFilter } from './Common'

export interface IFeature {
    id: number
    featureName: string
}

export interface IFeatureCreate {
    featureName: string
}

export interface IFeatureUpdate extends IFeatureCreate {
    id: number
}

export interface IFeatureFilter extends IFilter {}
