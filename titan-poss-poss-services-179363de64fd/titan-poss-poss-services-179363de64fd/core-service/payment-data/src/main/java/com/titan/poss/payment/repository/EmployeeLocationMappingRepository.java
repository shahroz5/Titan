/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.EmployeeLocationMappingDao;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EmployeeLocationMappingRepository")
public interface EmployeeLocationMappingRepository extends JpaRepository<EmployeeLocationMappingDao, String> {

	
	@Query(value = "SELECT lm FROM EmployeeLocationMappingDao lm WHERE lm.locationCode = :locationCode AND lm.employeePaymentConfig = :employeePaymentConfig")
	EmployeeLocationMappingDao findByLocCodeAndEmployeeId(@Param("locationCode") String locationCode, @Param("employeePaymentConfig") EmployeePaymentConfigDao employeePaymentConfig);

	List<EmployeeLocationMappingDao> findByEmployeePaymentConfig(EmployeePaymentConfigDao employeePaymentConfig);
	

}
