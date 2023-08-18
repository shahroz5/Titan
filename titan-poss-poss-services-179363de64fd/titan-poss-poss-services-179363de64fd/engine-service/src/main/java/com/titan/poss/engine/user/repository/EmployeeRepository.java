/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.engine.dto.response.UserRoleDto;
import com.titan.poss.user.dao.EmployeeDao;

/**
 * Handles repository operations for <b>Employee</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineEmployeeRepository")
public interface EmployeeRepository extends JpaRepository<EmployeeDao, String> {

	// @formatter:off
	@Query("SELECT new com.titan.poss.core.dto.LiteEmployeeListDto(em.employeeCode, em.empName, em.locationCode, em.mobileNo, ul.isLoginActive) "
			+ " FROM UserEmployee em\r\n" + " LEFT JOIN UserEmployeeRoleMapping erm \r\n"
			+ " ON em.employeeCode = erm.employee.employeeCode AND erm.isPrimary = true \r\n" + "LEFT JOIN UserLogin ul \r\n"
			+ " ON em.employeeCode=ul.employee.employeeCode \r\n"
			+ " WHERE (:employeeCodes IS NULL OR em.employeeCode IN (:employeeCodes)) \r\n"
			+ " AND (nullif(CHOOSE(1,:locationCodes),'') IS NULL OR em.locationCode IN (:locationCodes)) \r\n"
			+ " AND (nullif(CHOOSE(1,:roleCodes),'') IS NULL OR erm.role.roleCode IN (:roleCodes)) AND em.isActive = true")
	Page<LiteEmployeeListDto> listEmployees(@Param("locationCodes") Set<String> locationCodes,
			@Param("roleCodes") Set<String> roleCodes, @Param("employeeCodes")  Set<String> employeeCodes, Pageable pageable);
	// @formatter:on

	Optional<EmployeeDao> findByEmployeeCodeAndOrgCode(String id, String orgCode);

	// @formatter:off
	@Query("select new com.titan.poss.engine.dto.response.UserRoleDto(rm.roleCode, rm.roleName, rm.description, erm.isPrimary, erm.startDate, erm.expiryDate, rm.corpAccess)"
			+ " FROM UserEmployeeRoleMapping erm" + " LEFT JOIN UserRole rm" + " ON erm.role = rm"
			+ " WHERE erm.employee = :emp")
	// @formatter:on
	Set<UserRoleDto> listRolesDetailsAssignedToEmp(@Param("emp") EmployeeDao emp);

	// @formatter:off
	@Query("select erm.role.roleCode" + " FROM UserEmployeeRoleMapping erm"
			+ " WHERE erm.employee.employeeCode = :empCode")
	// @formatter:on
	List<String> listRoleCodes(@Param("empCode") String empCode);

	Optional<EmployeeDao> findByEmployeeCode(String employeeCode);
	
	Optional<EmployeeDao> findByEmployeeCodeAndLocationCode(String employeeCode, String locationCode);
	
	@Query(nativeQuery = true ,value = "SELECT em.employee_code,em.emp_name,em.email_id,em.mobile_no,em.location_code,em.org_code,em.user_type,em.has_login_access,em.is_active,em.created_by,em.created_date,\r\n"
			+ "em.last_modified_by,em.last_modified_date,em.employee_type,rm.role_code,rm.description,erm.start_date,erm.expiry_date,erm.is_primary \r\n"
			+ "from employee_master em "
			+ "join employee_role_mapping erm on em.employee_code = erm.employee_code "
			+ "join role_master rm on rm.role_code = erm.role_code ")
	List<Object[]> findByUniqueCombination();
	
	@Query(nativeQuery = true ,value = "SELECT em.employee_code,em.emp_name,em.email_id,em.mobile_no,em.location_code,em.org_code,em.user_type,em.has_login_access,em.is_active,em.created_by,em.created_date,"
			+ "em.last_modified_by,em.last_modified_date,em.employee_type,rm.role_code,rm.description,erm.start_date,erm.expiry_date,erm.is_primary "
			+ "from employee_master em "
			+ "join employee_role_mapping erm on em.employee_code = erm.employee_code "
			+ "join role_master rm on rm.role_code = erm.role_code "
			+ "where em.last_modified_date IS NULL OR (em.last_modified_date >= :#{#edcBankRequestDto.fromDocDate} AND em.last_modified_date <= :#{#edcBankRequestDto.toDocDate})" )
	List<Object[]> findByUniqueCombinationWithDateRange(@Param("edcBankRequestDto")EdcBankRequestDto edcBankRequestDto);

}
