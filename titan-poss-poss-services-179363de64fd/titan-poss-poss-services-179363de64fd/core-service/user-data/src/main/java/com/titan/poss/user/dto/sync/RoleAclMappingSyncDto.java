/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto.sync;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.AclDao;
import com.titan.poss.user.dao.RoleAclMappingDao;
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
public class RoleAclMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String acl;

	private String role;


	public List<RoleAclMappingDao> getDaoList(List<RoleAclMappingSyncDto> syncDtoList) {
		List<RoleAclMappingDao> daoList = new ArrayList<>();
		for (RoleAclMappingSyncDto roleAclMappingSyncDto : syncDtoList) {
			RoleAclMappingSyncDto syncDto = new RoleAclMappingSyncDto();
			daoList.add(syncDto.getRoleAclMappingDao(roleAclMappingSyncDto));
		}
		return daoList;
	}

	public RoleAclMappingDao getRoleAclMappingDao(RoleAclMappingSyncDto roleAclMappingSyncDto) {

		RoleAclMappingDao roleAclMappingDao = new RoleAclMappingDao();
		roleAclMappingDao = (RoleAclMappingDao) MapperUtil.getObjectMapping(roleAclMappingSyncDto, roleAclMappingDao);

		AclDao aclDao = new AclDao();
		aclDao.setAclCode(roleAclMappingSyncDto.getAcl());

		roleAclMappingDao.setAcl(aclDao);

		RoleDao roleDao = new RoleDao();
		roleDao.setRoleCode(roleAclMappingSyncDto.getRole());

		roleAclMappingDao.setRole(roleDao);

		return roleAclMappingDao;

	}
}
