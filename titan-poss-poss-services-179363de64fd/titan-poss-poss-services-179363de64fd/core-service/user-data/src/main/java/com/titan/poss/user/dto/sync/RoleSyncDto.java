/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto.sync;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.RoleDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RoleSyncDto extends MasterSyncableEntity {

	private String roleCode;

	private String roleName;

	private String description;

	private String accessType;

	private Boolean corpAccess;

	public RoleSyncDto() {

	}

	public RoleSyncDto(RoleDao role) {
		MapperUtil.getObjectMapping(role, this);
	}

	public RoleDao getRoleDao(RoleSyncDto roleSyncDto) {
		return (RoleDao) MapperUtil.getObjectMapping(roleSyncDto, new RoleDao());
	}
}
