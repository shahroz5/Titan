import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissionSource: string[];

  clearPermissions = () => (this.permissionSource = []);

  loadPermissions = (keys: string | string[]) =>
    (this.permissionSource = this.permissionSource.concat(
      this.transformStringToArray(keys)
    ));

  hasPermission = (key: string): boolean => this.permissionSource.includes(key);

  getPermissions = (): string[] => this.permissionSource;

  transformStringToArray(value: any): string[] {
    if (this.isString(value)) {
      return [value];
    }
    return value;
  }

  isString = (value: any): value is string =>
    !!value && typeof value === 'string';
}
