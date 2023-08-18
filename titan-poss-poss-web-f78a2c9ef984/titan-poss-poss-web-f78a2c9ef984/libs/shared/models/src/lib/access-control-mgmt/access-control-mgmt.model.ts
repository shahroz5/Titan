export interface ACLDetails {
  aclCode: string;
  description: string;
  isAssigned: boolean;
}

export interface ACLModuleDetails {
  aclGroupCode: string;
  description: string;
  isLeaf: boolean;
  parentAclGroupCode: string;
}

export interface ACLLoadRequest {
  aclGroupCode: string;
  roleCode: string;
}

export interface ACLUpdateRequest {
  addedAclCodes: string[];
  removedAclCodes: string[];
  roleCode?: string;
}

export interface ACLRole {
  roleCode: string;
  roleName: string;
}
