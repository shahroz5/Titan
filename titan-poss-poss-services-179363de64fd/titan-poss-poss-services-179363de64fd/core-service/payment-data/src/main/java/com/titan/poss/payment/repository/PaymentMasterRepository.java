package com.titan.poss.payment.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.EmployeePaymentConfigDao;

@Repository("PaymentConfigMasterRepository")
public interface PaymentMasterRepository extends JpaRepository<EmployeePaymentConfigDao, String> {

	@Query(value = "SELECT epm from EmployeePaymentConfigDao epm WHERE epm.employeeCode=:employeeCode")
	EmployeePaymentConfigDao findAllEmployeeDetails(@Param("employeeCode") String employeeCode);

	List<EmployeePaymentConfigDao> findByCorrelationId(String correlationId);

	List<EmployeePaymentConfigDao> findAll();
	
	EmployeePaymentConfigDao findByEmployeeCode(String employeeCode);
	
	@Query(value = "SELECT epm from EmployeePaymentConfigDao epm WHERE epm.employeeCode=:employeeCode AND :buisnessDate <= epm.validityDate AND epm.status = 'OPEN'")
	EmployeePaymentConfigDao getEmployeeDetails(@Param("employeeCode") String employeeCode,
			@Param("buisnessDate") Date buisnessDate);
	
}
