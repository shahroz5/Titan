/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.response.UserRoleDto;

/**
 * Handles repository operations for <b>EmployeeRoleMapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserEmployeeRoleMappingRepositoryExt")
public interface EmployeeRoleMappingRepositoryExt extends JpaRepository<EmployeeRoleMappingDaoExt, String> {

	List<EmployeeRoleMappingDaoExt> findByEmployee(EmployeeDao employee);

	List<EmployeeRoleMappingDaoExt> findByEmployeeEmployeeCode(String employeeCode);

	EmployeeRoleMappingDaoExt findOneByEmployeeAndRole(EmployeeDao employee, RoleDao role);

	List<EmployeeRoleMappingDaoExt> findByEmployeeEmployeeCodeAndRoleRoleCodeIn(String empCode, List<String> roleCode);

	List<EmployeeRoleMappingDaoExt> findByEmployeeAndIsPrimary(EmployeeDao employee, Boolean isPrimary);

	List<EmployeeRoleMappingDaoExt> findByEmployeeEmployeeCodeAndIsPrimary(String employeeCode, Boolean isPrimary);

	// @formatter:off
	@Query("SELECT CASE WHEN COUNT(erm.employee.employeeCode) > 0 THEN true ELSE false END \r\n" + 
			"	FROM com.titan.poss.user.dao.EmployeeRoleMappingDao erm \r\n" + 
			"	WHERE erm.employee.employeeCode = :empName AND\r\n" + 
			"			erm.role.roleCode IN (SELECT rm.roleCode FROM UserRole rm WHERE rm.corpAccess = true"
			+ "				AND (rm.accessType LIKE '%__1__%' OR rm.accessType LIKE '%___1_%' OR rm.accessType LIKE '%____1%'))") 
	// @formatter:on
	Boolean isStoreEmployeePartOfCorp(@Param("empName") String empName);

	// @formatter:off
	@Query("select new com.titan.poss.user.dto.response.UserRoleDto(rm.roleCode, rm.roleName, rm.description, erm.isPrimary, erm.startDate, erm.expiryDate, rm.corpAccess)"
			+ " FROM UserEmployeeRoleMapping erm"
			+ " LEFT JOIN UserRole rm"
			+ " ON erm.role = rm"
			+ " WHERE erm.employee = :emp")
	// @formatter:on
	Set<UserRoleDto> listRolesDetailsAssignedToEmp(@Param("emp") EmployeeDao emp);

	@Query("SELECT erm.role.roleCode FROM UserEmployeeRoleMapping erm where erm.employee = :employee")
	List<String> listRolesOfAnEmployee(@Param("employee") EmployeeDao employee);

	EmployeeRoleMappingDaoExt findOneByEmployeeAndRoleRoleCodeAndIsPrimary(EmployeeDao employee, String roleCode,
			Boolean isPrimary);

	Integer countByRoleRoleCode(String roleCode);

	EmployeeRoleMappingDaoExt findOneByEmployeeEmployeeCodeAndIsPrimaryTrue(String empCode);
}
