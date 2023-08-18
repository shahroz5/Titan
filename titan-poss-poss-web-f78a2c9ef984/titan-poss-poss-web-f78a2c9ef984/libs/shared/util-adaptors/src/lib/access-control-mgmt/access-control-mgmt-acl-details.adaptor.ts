import { ACLDetails } from '@poss-web/shared/models';

export class ACLDetailsAdaptors {
  static fromJson(data: any): ACLDetails {
    return {
      aclCode: data.aclCode,
      description: data.description,
      isAssigned: data.isAssigned
    };
  }
}
