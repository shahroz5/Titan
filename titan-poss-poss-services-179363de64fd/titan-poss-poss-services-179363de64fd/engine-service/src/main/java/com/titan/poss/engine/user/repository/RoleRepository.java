/*  
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.RoleLiteDto;
import com.titan.poss.user.dao.RoleDao;

/**
 * Handles repository operations for <b>Employee</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineRoleRepository")
public interface RoleRepository extends JpaRepository<RoleDao, String> {

	// @formatter:off
	@Query("select erm.role.roleCode" + " FROM UserEmployeeRoleMapping erm"
			+ " WHERE erm.employee.employeeCode = :empCode")
	// @formatter:on
	List<String> listRoleCodes(@Param("empCode") String empCode);

	// @formatter:off
	@Query("select new com.titan.poss.core.dto.RoleLiteDto(rm.roleCode, rm.roleName)" + " FROM UserRole rm"
			+ " WHERE rm.isActive = 1")
	// @formatter:on
	List<RoleLiteDto> listActiveRoleCodes();

	Optional<RoleDao> findByRoleCodeAndIsActive(String id, boolean isActive);

	/**
	 * @param roleCode
	 * @return
	 */
	// @formatter:off
	@Query("select new com.titan.poss.core.dto.RoleLiteDto(rm.roleCode, rm.roleName)" + " FROM UserRole rm"
			+ " WHERE rm.roleCode = :roleCode")
	// @formatter:on
	RoleLiteDto listRoleDetails(@Param("roleCode") String roleCode);

}
