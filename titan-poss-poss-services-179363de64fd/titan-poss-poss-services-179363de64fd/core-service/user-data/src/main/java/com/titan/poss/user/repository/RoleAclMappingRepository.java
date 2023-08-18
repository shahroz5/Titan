/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.RoleAclMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleAclMappingRepository")
public interface RoleAclMappingRepository extends JpaRepository<RoleAclMappingDao, String> {

	List<RoleAclMappingDao> findByRoleRoleCodeAndAclAclCodeIn(String roleCode, List<String> aclCode);

	// @formatter:off
	@Query("select am.aclCode"
			+ " FROM UserRoleAclMapping ram"
			+ " LEFT JOIN UserAcl am"
			+ " 	ON ram.acl = am"
			+ " WHERE am.isActive = 1 AND ram.role.roleCode IN (:roleCodes)")
	// @formatter:on
	List<String> getActiveAclByRoles(@Param("roleCodes") List<String> roleCodes);

}
