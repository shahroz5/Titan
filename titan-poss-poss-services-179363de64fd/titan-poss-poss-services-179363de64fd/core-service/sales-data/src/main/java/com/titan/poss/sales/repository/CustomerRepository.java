/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.EpossCustomerSearchListDto;

/**
 * Handles repository operations for <b>Customer</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerRepository")
public interface CustomerRepository extends JpaRepository<CustomerDao, String> {

	int countByMobileNumber(String mobileNo);

	int countByInstiTaxNo(String instiTaxNo);

	int countByCustTaxNo(String custTaxNo);

	int countByUlpId(String ulpId);

	int countByPassportId(String passportId);

	// REGULAR
	CustomerDao findOneByMobileNumberAndCustomerType(String mobileNumber, String customerType);

	CustomerDao findOneByMobileNumberAndCustomerTypeAndIsEncrypted(String mobileNumber, String customerType,
			boolean isEncrypted);

	CustomerDao findOneByUlpIdAndCustomerType(String ulpId, String customerType);

	// INSTITUTIONAL
	CustomerDao findOneByCustTaxNoAndCustomerType(String custTaxNo, String customerType);
	
	CustomerDao findTopByCustTaxNoAndCustomerType(String custTaxNo, String customerType);
		
	CustomerDao findOneByCustTaxNoAndCustomerTypeAndIsEncrypted(String custTaxNo, String customerType,
			boolean isEncrypted);

	CustomerDao findOneByInstiTaxNoAndCustomerType(String instiTaxNo, String customerType);

	CustomerDao findOneByInstiTaxNoAndCustomerTypeAndIsEncrypted(String instiTaxNo, String customerType,
			boolean isEncrypted);

	// INTERNATIONAL
	CustomerDao findOneByPassportIdAndCustomerType(String passportId, String customerType);

	CustomerDao findOneByPassportIdAndCustomerTypeAndIsEncrypted(String passportId, String customerType,
			boolean isEncrypted);
	
	// REGULAR
	List<CustomerDao> findByCustomerNameAndCustomerType(String customerName, String customerType);

	List<CustomerDao> findByEmailIdAndCustomerType(String emailId, String customerType);
	
	

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.EpossCustomerSearchListDto(clm.customerLocationMappingId.customerId, cus.customerType, cus.customerName, cus.mobileNumber, cus.ulpId, cus.emailId, cus.instiTaxNo, cus.custTaxNo, cus.passportId, cus.customerDetails) "
			+ " FROM com.titan.poss.sales.dao.CustomerDao cus \r\n"
			+ " JOIN com.titan.poss.sales.dao.CustomerLocationMappingDao clm on clm.customer.id = cus.id \r\n"
			+ " WHERE (:name IS NULL OR cus.customerName = :name) \r\n"
			+ " AND (:emailId IS NULL OR cus.emailId = :emailId) \r\n"
			+ " AND cus.customerType = :custType AND  clm.customerLocationMappingId.locationCode = :locationCode " )
	List<EpossCustomerSearchListDto> listCustomers(@Param("emailId") String emailId,
			@Param("name") String name, @Param("custType") String custType, @Param("locationCode") String locationCode);
	// @formatter:on
	
	

	CustomerDao findByUlpId(String ulpId);

	CustomerDao findOneByPassportId(String passportId);

	CustomerDao findOneByInstiTaxNo(String instiTaxNo);

	boolean existsByUlpId(String ulpId);

	void deleteByUlpId(String ulpId);

	CustomerDao findByUlpIdAndId(String ulpId, String id);
	
	@Query("SELECT cus "
			+ " FROM com.titan.poss.sales.dao.CustomerDao cus \r\n"
			+ " JOIN com.titan.poss.sales.dao.CustomerLocationMappingDao clm on clm.customer.id = cus.id \r\n"
			+ " WHERE clm.customerLocationMappingId.customerId = :id \r\n"
			+ " AND cus.customerType = :custType AND clm.customerLocationMappingId.locationCode = :locationCode")
	CustomerDao getCustomerDaoByCustomerIdAndCustomerType(@Param("id") Integer id, @Param("custType") String custType, @Param("locationCode")  String locationCode);

}
