import { PermissionData } from '../permission/permission.model';

export class Navigation {
  name: string;
  url: string;
  permission: PermissionData;
  children?: Navigation[];
  icon?: string;
  external: boolean;
  isOffline?: string;
  isExactMatchForSearchInput?: boolean;
}
