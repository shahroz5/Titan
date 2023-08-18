/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class BaseRoleMaster for the role_master database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseRole extends MasterSyncableEntity {

	@Id
	@Column(name = "role_code", unique = true, nullable = false, length = 20)
	private String roleCode;

	@Column(name = "role_name", nullable = false)
	private String roleName;

	@Column(name = "description", nullable = false, columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "corp_access", nullable = false)
	private Boolean corpAccess;

	@Column(name = "access_type", nullable = false)
	private String accessType;

	@Column(name = "is_location_mapping_required", nullable = false)
	private Boolean isLocationMappingRequired;
	
	
	@Override
	public String toString() {
		return "BaseRole [roleCode=" + roleCode + ", roleName=" + roleName + ", description=" + description
				+ ", corpAccess=" + corpAccess + ", accessType=" + accessType + "]";
	}

}
