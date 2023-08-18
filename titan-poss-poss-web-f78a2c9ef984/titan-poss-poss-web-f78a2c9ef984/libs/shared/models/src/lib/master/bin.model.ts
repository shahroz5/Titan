import { BinGroup } from './bin-group.model';

export interface Bin{
  binCode: string,
  binGroups: BinGroup[],
  description: string
}
