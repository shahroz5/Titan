/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeRoleMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserEmployeeRoleMappingRepository")
public interface EmployeeRoleMappingRepository extends JpaRepository<EmployeeRoleMappingDao, String> {

	/**
	 * @param empCode
	 * @param roleCodes
	 * @return List<EmployeeRoleMappingDao>
	 */
	List<EmployeeRoleMappingDao> findByEmployeeEmployeeCodeAndRoleRoleCodeIn(String empCode, List<String> roleCodes);

	List<EmployeeRoleMappingDao> findByEmployeeEmployeeCodeIn(List<String> employeeCodes);

	/**
	 * @param currentDate
	 * @return
	 */
	// @formatter:off
	@Query("SELECT erm FROM UserEmployeeRoleMapping erm WHERE"
			+ " erm.isPrimary = false AND erm.expiryDate IS NOT NULL AND erm.expiryDate <= :currentDate")
	// @formatter:on
	List<EmployeeRoleMappingDao> findByIsPrimaryFalseAndExpiryTimeLessThan(@Param("currentDate") Date currentDate);

	/**
	 * @param employeeCode
	 * @param roleCode
	 * @return EmployeeRoleMappingDao
	 */
	EmployeeRoleMappingDao findByEmployeeEmployeeCodeAndRoleRoleCode(String employeeCode, String roleCode);
	
	// @formatter:off
			@Query("select erm" + " FROM UserEmployeeRoleMapping erm"
					+ " WHERE erm.employee.employeeCode = :empCode")
			// @formatter:on
			EmployeeRoleMappingDao findByEmployeeCode(@Param("empCode") String empCode);

}
