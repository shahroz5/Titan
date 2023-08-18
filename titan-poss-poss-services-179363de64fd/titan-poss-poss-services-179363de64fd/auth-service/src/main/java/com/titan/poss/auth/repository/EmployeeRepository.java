/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.auth.dao.EmployeeDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("authEmployeeRepo")
public interface EmployeeRepository extends JpaRepository<EmployeeDao, String> {

	public EmployeeDao findOneByEmployeeCode(String userName);

	// @formatter:off
	@Modifying
	@Query(nativeQuery = true, 
	value = "   UPDATE employee_master SET resignation_date = NULL, is_active = 1, last_modified_date = :lmd, last_modified_by = :lmb \r\n"
			+ " WHERE employee_code LIKE 'SM%' OR employee_code LIKE 'BOS%' OR employee_code LIKE 'rso%' \r\n"
			+ " OR employee_code IN (:corpUsers)")
	// @formatter:on
	int activateEmployees(@Param("corpUsers") List<String> corpUsers, @Param("lmb") String lmb, @Param("lmd") Date lmd);

}