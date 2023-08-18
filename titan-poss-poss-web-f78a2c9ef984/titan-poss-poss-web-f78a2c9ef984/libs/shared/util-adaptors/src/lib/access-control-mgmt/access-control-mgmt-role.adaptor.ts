import { ACLRole } from '@poss-web/shared/models';

export class ACLRoleAdaptors {
  static fromJson(data: any): ACLRole {
    return { roleCode: data.roleCode, roleName: data.roleName };
  }
}
