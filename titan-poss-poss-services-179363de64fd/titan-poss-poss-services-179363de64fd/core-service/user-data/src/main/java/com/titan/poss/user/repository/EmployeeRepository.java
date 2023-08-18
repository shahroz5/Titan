/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dto.response.EmployeeLocationDetails;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserEmployeeRepository")
public interface EmployeeRepository extends JpaRepository<EmployeeDao, String> {

	/**
	 * 
	 * This method will return the Employee Details based on the employeeCode
	 * 
	 * @param employeeCode
	 * @return
	 */
	EmployeeDao getOneByEmployeeCode(String employeeCode);
	
	public List<EmployeeDao> findByEmployeeCodeInOrderByEmployeeCodeAsc(Set<String> employeeCodes);

	// @formatter:off
	@Query("SELECT new com.titan.poss.user.dto.response.EmployeeLocationDetails(em.employeeCode, em.locationCode)"
			+ " FROM UserEmployee em" 
			+ " WHERE isActive = true AND resignationDate <= :currentDate"
			+ " AND userType != 'API'")
	// @formatter:on
	List<EmployeeLocationDetails> listAllEmpEligibleForDeactivate(@Param("currentDate") Date currentDate);

	Optional<EmployeeDao> findByEmployeeCode(String employeeCode);


}
