/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclDao;
import com.titan.poss.user.dao.RoleAclMappingDaoExt;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.response.AclDto;

/**
 * Handles repository operations for <b>RoleAclMapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleAclMappingRepositoryExt")
public interface RoleAclMappingRepositoryExt extends JpaRepository<RoleAclMappingDaoExt, String> {

	List<RoleAclMappingDaoExt> findByAcl(AclDao acl);

	List<RoleAclMappingDaoExt> findByRoleIn(List<RoleDao> roles);

	List<RoleAclMappingDaoExt> findByRoleRoleCode(String roleCode);

	List<RoleAclMappingDaoExt> findByRoleRoleCodeAndAclAclCodeIn(String roleCode, List<String> aclCode);

	@Query("SELECT new com.titan.poss.user.dto.response.AclDto(ram.acl.aclCode, ram.acl.description, ram.acl.aclGroup)"
			+ " from com.titan.poss.user.dao.RoleAclMappingDao ram "
			+ " WHERE ram.role.roleCode = ?1 AND ram.acl.isActive = 1")
	List<AclDto> listAclByRoleCodeFields(String roleCode);

	@Query("SELECT ram.acl from UserRoleAclMapping ram WHERE ram.role.roleCode = ?1")
	List<AclDao> listAclByRoleCode(String roleCode);

}
