/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_UTIL_SERVICE;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.titan.poss.payment.dao.ConfigDetailsDaoExt;
import com.titan.poss.payment.dao.GLBoutiqueCodeMappingDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt;
import com.titan.poss.payment.dao.PaymentCustomerMappingDaoExt;
import com.titan.poss.payment.dao.PaymentProductDaoExt;
import com.titan.poss.payment.dto.AddGLBoutiqueCode;
import com.titan.poss.payment.dto.AddPaymentCode;
import com.titan.poss.payment.dto.ConfigDetailDto;
import com.titan.poss.payment.dto.CreateCustomerConfigDto;
import com.titan.poss.payment.dto.response.ConfigDetailsDto;
import com.titan.poss.payment.dto.response.CustomerConfigDetailsDto;
import com.titan.poss.payment.dto.response.GLBoutiqueCodeMappingDto;
import com.titan.poss.payment.dto.response.PayeeBankLocationDto;
import com.titan.poss.payment.dto.response.PaymentProductDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_UTIL_SERVICE)
public interface PaymentCommonService {

	/**
	 * method to get the ConfigDetailsDao.
	 * 
	 * @param configDetailsDao
	 * @param configId
	 * @param configDetail
	 * @return ConfigDetailsDao
	 */
	ConfigDetailsDaoExt getConfigDetailDao(ConfigDetailsDaoExt configDetailsDao, ConfigDetailDto configDetail,
			String configId);

	/**
	 * This method will get the Payment Configuration Details Response.
	 * 
	 * @param configId
	 * @param configDetailsDao
	 * @param set
	 * @return ConfigDetailsDto
	 */
	ConfigDetailsDto getConfigDetailResponse(List<ConfigDetailsDaoExt> configDetailsDao, String configId);

	/**
	 * This method will get the Payee Bank Location Details Response.
	 *
	 * @param payeeBankLocationMappingDao
	 * @return PayeeBankLocationDto
	 */
	List<PayeeBankLocationDto> getPayeeDtoMapping(List<PayeeBankLocationMappingDaoExt> payeeBankLocationMappingDao);

	/**
	 * This method will get the Payee Bank Location Details Response.
	 *
	 * @param paymentCodes
	 * @param bankName
	 * @param addLocation
	 * @param payeeBankMappingMap
	 * @return PayeeBankLocationDto
	 */
	PayeeBankLocationMappingDaoExt getPayeeDaoMapping(AddPaymentCode paymentCodes, String bankName, String addLocation,
			Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap);

	/**
	 * This method will get the Payer Bank Location Details Response.
	 *
	 * @param glCodeMappingDaoList
	 * @return GLCodeMappingDto
	 */
	List<GLBoutiqueCodeMappingDto> getGLDtoMapping(List<GLBoutiqueCodeMappingDao> glCodeMappingDaoList);

	/**
	 * This method will get the Payer Bank Location Details Response.
	 *
	 * @param addLocation
	 * @param addGLCode
	 * @param glCodeMappingMap
	 * @return GLCodeMappingDao
	 */
	GLBoutiqueCodeMappingDao getGLCodeDaoMapping(String addLocation, AddGLBoutiqueCode addGLCode,
			Map<String, GLBoutiqueCodeMappingDao> glCodeMappingMap);

	/**
	 * This method will get the Payee Bank Mapping Map.
	 *
	 * @param addPaymentCodes
	 * @param bankName
	 * @return Map<String, PayeeBankLocationMappingDao>
	 */
	Map<String, PayeeBankLocationMappingDaoExt> getMappingForPayeeBank(
			List<PayeeBankLocationMappingDaoExt> addPaymentCodes, String bankName);

	/**
	 * This method will get the Payee Bank Mapping Map.
	 *
	 * @param updateMappingDao
	 * @param payeeBankMappingMap
	 * @return Map<String, PayeeBankLocationMappingDao>
	 */
	List<PayeeBankLocationMappingDaoExt> getUpdateMappingForPayeeBank(
			List<PayeeBankLocationMappingDaoExt> updateMappingDao,
			Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap);

	/**
	 * @param paymentProductDaoList
	 * @return List<PaymentProductDto>
	 */
	List<PaymentProductDto> getPaymentProductDtoMapping(List<PaymentProductDaoExt> paymentProductDaoList);

	/**
	 * @param seriaLNo
	 * @return listOfSerialNo
	 */
	List<BigInteger> getSerialNumberList(String serialNo);

	/**
	 * This method will return PaymentCustomerMappingDao object.
	 * 
	 * @param paymentCustomerMappingDao
	 * 
	 * @param configId
	 * @param customerConfig
	 * @return PaymentCustomerMappingDao
	 */
	PaymentCustomerMappingDaoExt getPaymentCustomerDao(PaymentCustomerMappingDaoExt paymentCustomerMappingDao,
			CreateCustomerConfigDto customerConfig, String configId);

	/**
	 * This method will return CustomerConfigDetailsDto object.
	 * 
	 * @param responseList
	 * 
	 * @param configId
	 * @return CustomerConfigDetailsDto
	 */
	CustomerConfigDetailsDto getCustomerConfigResponse(List<PaymentCustomerMappingDaoExt> responseList,
			String configId);

	/**
	 * 
	 * @param paymentCodes
	 * @param bankName
	 * @param addLocation
	 * @return PayeeBankLocationMappingDaoExt
	 */
	PayeeBankLocationMappingDaoExt getPayeeDaoMapping(AddPaymentCode paymentCodes, String bankName, String addLocation);

	/**
	 * This method will validate transaction type for the configuration.
	 * 
	 * @param txnTypes
	 * @param searchType
	 * @param isTrue
	 */
	void validTxnTypeForConfig(Set<String> txnTypes, String searchType, Boolean isTrue);
}
