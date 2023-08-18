/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.EmployeePaymentConfigDao;
import com.titan.poss.payment.dao.EmployeeProductMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EmployeeProductMappingRepository")
public interface EmployeeProductMappingRepository extends JpaRepository<EmployeeProductMappingDao, String> {

	@Query(value = "SELECT pm FROM EmployeeProductMappingDao pm WHERE pm.employeePaymentConfig  = :employeePaymentConfig AND pm.productGroupCode = :productGroupCode")
	EmployeeProductMappingDao findByEmployeeIdAndProductGroupCode(@Param("employeePaymentConfig") EmployeePaymentConfigDao employeePaymentConfig,
			@Param("productGroupCode") String productGroupCode);
	
	@Query(value = "SELECT pm FROM EmployeeProductMappingDao pm WHERE pm.employeePaymentConfig  = :employeePaymentConfig")
	List<EmployeeProductMappingDao> findByEmployeeID(@Param("employeePaymentConfig") EmployeePaymentConfigDao employeePaymentConfig);

}
