/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.user.repository;

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

@Repository("engineRoleAclMappingRepository")
public interface RoleAclMappingRepository extends JpaRepository<RoleAclMappingDao, String> {

	RoleAclMappingDao findFirstByAclAclCode(String aclCode);
	
	 //@formatter:off
	@Query("select  uram.acl.aclCode" + " FROM UserRoleAclMapping uram"
			+ " WHERE uram.role.roleCode = :roleCode")
	// @formatter:on//uram.UserRole.roleCode,uram.UserAcl.aclCode
	List<String> listRoleAclCodes(@Param("roleCode") String roleCode);
}
