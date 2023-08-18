/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.PanAndForm60ResponseDto;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.CustomerUlpDao;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.request.CustomerAddDto;
import com.titan.poss.sales.dto.request.CustomerPanDetails;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.CustomerResDto;
import com.titan.poss.sales.dto.response.CustomerSearchDto;
import com.titan.poss.sales.dto.response.EmailValidationResponseDto;

/**
 * Service interface for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CustomerService {

	/**
	 * This method will return customer details based on customerId.
	 * 
	 * @param customerId
	 * @return CustomerSearchDto
	 */
	CustomerDetailsDto getCustomer(Integer customerId);

	/**
	 * This method will verify if mobile no./email/instiTaxNo/custTaxNo is unique.
	 * 
	 * @param searchType
	 * @param value
	 * @return Boolean
	 */
	Boolean isUniqueCheck(String searchType, String value);

	/**
	 * @param ulpId
	 * @return
	 */
	CustomerUlpDao getUlpData(String ulpId);

	/**
	 * Encrypt customer entity
	 * 
	 * @param customerDao
	 * @return
	 */
	CustomerDao encryptCustomerDao(CustomerDao customerDao);

	/**
	 * Decrypt customer entity
	 * 
	 * @param customerDao
	 * @return
	 */
	CustomerDao decryptCustomerDao(CustomerDao customerDao);

	CustomerResDto createCustomer(CustomerAddDto addCustomerDto);

	ListResponse<CustomerEpossListSearchDto> searchCustomerList(String searchField, String searchType);

	CustomerResDto updateCustomer(Integer customerId, CustomerUpdateDto updateCustomerDto);

	CustomerSearchDto searchCustomerWithFallback(SearchTypeEnum searchType, String searchInput);

	ListResponse<CustomerEpossListSearchDto> searchCustomerListWithFallBack(String searchField, String searchType);

	JsonData getEmailValidationDetails(String email);

	int saveCustomerAndGetCustomerId(CustomerDao newCustomerData);

	/**
	 * Get customer from customer txn Mainly should be used if want to get customer
	 * for a different location if there it will provide, else it will create &
	 * provide customer id
	 * 
	 * @param custTxn
	 * @return Integer
	 */
	Integer getLocationSpecificCustomerId(CustomerTxnDao custTxn);

	/**
	 * @param customerId
	 * @param locationCode
	 * @return
	 */
	CustomerLocationMappingDao checkIfCustomerExists(Integer customerId, String locationCode);

	/**
	 * @param ulpId
	 * @return
	 */
	CustomerUlpDao getUlpDetails(String ulpId);

	/**
	 * @param customer
	 * @param customerUlp
	 */
	void saveCustomerAndUp(CustomerDao customer, CustomerUlpDao customerUlp);

	/**
	 * @param customerId
	 * @param locationCode
	 * @param customer
	 */
	void saveCustomerLocationMapping(Integer customerId, String locationCode, CustomerDao customer);

	/**
	 * @param customer
	 * @param locationCode
	 * @return
	 */
	CustomerLocationMappingDao getLocationMapping(CustomerDao customer, String locationCode);

	/**
	 * @param customerId
	 * @param locationCode
	 * @return
	 */
	Integer getCustomerByIdAndLocation(Integer customerId, String locationCode);

	/**
	 * @param searchType
	 * @param searchInput
	 * @return
	 */
	Integer searchCustomerWithoutUlpUpdate(SearchTypeEnum searchType, String searchInput , Boolean isUlpUpdateRquire);

	/**
	 * @param cnRequestDto
	 * @return
	 */
	Integer getCustomerByIdAndLocationForLegacy(CreditNoteRequestDto cnRequestDto);

	/**
	 * @param customerDao
	 */
	CustomerDao updateCustomerData(CustomerDao customerDao);

	/**
	 * @param id
	 * @return
	 */
	CustomerDao getCustomer(String id);

	EmailValidationResponseDto getEmailValidation(String email);

	PanAndForm60ResponseDto verifyPanCard(String pancardNo, String reEnterPancardNo , String verificationType);
	void verifyCustomerIdProof(String verificationType,String selectedIdProofType,Boolean isHardcopySubmitted,Boolean matched,CustomerPanDetails customerPanDetails);
	/**
	 * This method will encrypt customer details cunk by chunk. To be used only
	 * after migration once.
	 * 
	 * @param pageable
	 * @param isPageable
	 * @return Integer
	 */
	Integer encryptCustomeDetailsByChunk(Pageable pageable, Boolean isPageable);

	Integer encryptCustomerTxnDetailsByChunk(Pageable pageable, Boolean isPageable);
	
	Integer decryptCustomeDetailsByChunk(Pageable pageable, Boolean isPageable);
	
	Integer decryptCustomerTxnDetailsByChunk(Pageable pageable, Boolean isPageable);

}
