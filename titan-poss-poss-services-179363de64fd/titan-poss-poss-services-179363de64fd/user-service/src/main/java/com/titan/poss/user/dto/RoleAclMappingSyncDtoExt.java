/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.RoleAclMappingDaoExt;
import com.titan.poss.user.dto.sync.RoleAclMappingSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class RoleAclMappingSyncDtoExt extends RoleAclMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public RoleAclMappingSyncDtoExt() {

	}

	public RoleAclMappingSyncDtoExt(RoleAclMappingDaoExt roleAclMappingDao) {
		MapperUtil.getObjectMapping(roleAclMappingDao, this);
		this.setAcl(roleAclMappingDao.getAcl().getAclCode());
		this.setRole(roleAclMappingDao.getRole().getRoleCode());
	}

	public List<RoleAclMappingSyncDtoExt> getSyncDtoList(List<RoleAclMappingDaoExt> roleAclMappingList) {
		List<RoleAclMappingSyncDtoExt> dtoList = new ArrayList<>();
		for (RoleAclMappingDaoExt roleAclMapping : roleAclMappingList) {
			RoleAclMappingSyncDtoExt syncDto = new RoleAclMappingSyncDtoExt(roleAclMapping);
			dtoList.add(syncDto);
		}
		return dtoList;
	}

}
