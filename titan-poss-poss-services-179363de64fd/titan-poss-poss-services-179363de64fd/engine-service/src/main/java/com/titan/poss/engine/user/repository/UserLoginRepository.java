/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.user.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.user.dao.UserLoginDao;

/**
 * Handles repository operations for <b>UserLogin</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineUserLoginRepository")
public interface UserLoginRepository extends JpaRepository<UserLoginDao, String> {

	UserLoginDao findOneByEmployeeEmployeeCode(String employeeCode);

	// @formatter:off
	@Query("select ul.userName"
			+ " FROM UserLogin ul"
			+ "	LEFT JOIN UserEmployee em"
			+ "		ON ul.employee = em"
			+ " LEFT JOIN UserEmployeeRoleMapping erm"
			+ "		ON erm.employee = em"
			+ " LEFT JOIN UserRole rm"
			+ "		ON erm.role = rm"
			+ " LEFT JOIN UserRoleAclMapping ram"
			+ "		ON erm.role = ram.role"
			+ " WHERE em.isActive = 1 AND rm.isActive = 1 "
			+ "		AND ram.acl.aclCode = :aclCode"
			+ "		AND (:locationCode IS NULL or em.locationCode = :locationCode)")
	// @formatter:on
	Set<String> listUserNames(@Param("aclCode") String aclCode, @Param("locationCode") String locationCode);
	
	
	@Query(nativeQuery = true ,value = "SELECT user_name,password,employee_code,salt,password_changed_date,is_locked,is_login_active,created_by,created_date,last_modified_by,\r\n"
			+ "last_modified_date,last_login_date,password_history \r\n"
			+ "from user_login ")
	List<Object[]> findByUniqueCombination();
	

	@Query(nativeQuery = true ,value = "SELECT user_name,password,employee_code,salt,password_changed_date,is_locked,is_login_active,created_by,created_date,last_modified_by,\r\n"
			+ "last_modified_date,last_login_date,password_history \r\n"
			+ "from user_login "
			+ "where last_modified_date IS NULL OR (last_modified_date >= :#{#edcBankRequestDto.fromDocDate} AND last_modified_date <= :#{#edcBankRequestDto.toDocDate} )")
	List<Object[]> findByUniqueCombinationWithDateRange(@Param("edcBankRequestDto")EdcBankRequestDto edcBankRequestDto);
	
	
	

}
