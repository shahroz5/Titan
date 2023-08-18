import { ACLModuleDetails } from '@poss-web/shared/models';

export class ACLModuleDetailsAdaptors {
  static fromJson(data: any): ACLModuleDetails {
    return {
      aclGroupCode: data.aclGroupCode,
      description: data.description,
      isLeaf: data.isLeaf,
      parentAclGroupCode: data.parentAclGroupCode
    };
  }
}
