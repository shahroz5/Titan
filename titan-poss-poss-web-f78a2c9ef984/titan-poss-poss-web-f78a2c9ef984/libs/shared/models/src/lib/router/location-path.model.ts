import { NavigationExtras } from '@angular/router';

export class LocationPath {
  path: any[];
  query?: object;
  extras?: NavigationExtras;
  relativeTo?: boolean;
}
