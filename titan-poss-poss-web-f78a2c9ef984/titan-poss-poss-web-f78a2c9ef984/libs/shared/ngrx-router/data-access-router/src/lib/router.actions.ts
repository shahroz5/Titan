import { LocationPath } from '@poss-web/shared/models';

export interface Go {
  type: '[router] Go';
  payload: LocationPath;
}

export interface Back {
  type: '[router] BACK';
}

export interface Forward {
  type: '[router] FORWARD';
}

export type RouterAction = Go | Back | Forward;
