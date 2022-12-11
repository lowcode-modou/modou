import { appAtom } from './app'
import {
  entitiesSelector,
  entityByIdSelector,
  entityRelationsBySourceEntityNameMapSelector,
  entityRelationsByTargetEntityNameMapSelector,
  entityRelationsSelector,
  entitySelector,
} from './entity'
import { pageByIdSelector, pageSelector, pagesSelector } from './page'

export const Metadata = {
  appAtom,
  pagesSelector,
  pageByIdSelector,
  pageSelector,
  entitySelector,
  entityByIdSelector,
  entitiesSelector,
  entityRelationsSelector,
  entityRelationsBySourceEntityNameMapSelector,
  entityRelationsByTargetEntityNameMapSelector,
}
