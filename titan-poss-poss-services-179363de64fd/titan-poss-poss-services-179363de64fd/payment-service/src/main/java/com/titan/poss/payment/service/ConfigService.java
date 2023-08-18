/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CONFIG_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.dto.MappedLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.TransactionTypeCountDto;
import com.titan.poss.payment.dto.request.ConfigDetailsUpdate;
import com.titan.poss.payment.dto.request.ConfigRequestDto;
import com.titan.poss.payment.dto.request.CustomerConfigRequestDto;
import com.titan.poss.payment.dto.response.ConfigDetailsDto;
import com.titan.poss.payment.dto.response.ConfigLocationResponseDto;
import com.titan.poss.payment.dto.response.ConfigMasterDto;
import com.titan.poss.payment.dto.response.CustomerConfigDetailsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_CONFIG_SERVICE)
public interface ConfigService {

	/**
	 * This method will return the list of Payment Configuration based on the
	 * configId, isActive.
	 * 
	 * @param isActive
	 * @param configId
	 * @param configType
	 * @return ListResponse<ConfigDto>
	 */

	PagedRestResponse<List<ConfigMasterDto>> listConfig(Boolean isActive, Pageable pageable, String description,
			String configId, @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType);

	/**
	 * This method will return the Payment Configuration details based on the
	 * configId.
	 * 
	 * @param configId
	 * @return PaymentConfigDto
	 */
	ConfigMasterDto getConfig(String configId);

	/**
	 * This method will save the Configuration details.
	 * 
	 * @param paymentConfigRequestDto
	 * @return PaymentConfigDto
	 */
	ConfigMasterDto addConfig(ConfigRequestDto paymentConfigRequestDto);

	/**
	 * This method will update the Payment Configuration details.
	 * 
	 * @param configId
	 * @param isActive
	 * @return PaymentConfigDto
	 */
	ConfigMasterDto updateConfig(String configId, Boolean isActive);

	/**
	 * This method will return the list of Payment Configuration details based on
	 * the paymentConfig, isActive.
	 * 
	 * @param configId
	 * @param paymentCodes
	 * @param transactionTypes
	 * @return PagedRestResponse<List<ConfigDetailsDto>>
	 */
	ConfigDetailsDto listConfigDetails(String configId, List<String> transactionTypes, List<String> paymentCodes);

	/**
	 * This method will update the Payment Configuration Details.
	 * 
	 * @param configId
	 * @param configDetailsUpdate
	 * @return ConfigDetailsUpdate
	 */
	ConfigDetailsDto updateConfigDetails(String configId, ConfigDetailsUpdate configDetailsUpdate);

	/**
	 * This method will return the list of location codes based on configId,
	 * 
	 * @param configId
	 * @param configType 
	 * @return List<LocationCodeDto>
	 */
	ListResponse<MappedConfigResponseDto> getLocationCodes(String configId, @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType);

	/**
	 * This API will return the count of transaction type according to payment mode.
	 * 
	 * @param configId
	 * @return TransactionTypeCountDto
	 */
	ListResponse<TransactionTypeCountDto> getTransactionTypeCount(String configId);

	/**
	 * This method will create/update the Payment Customer Configuration Details.
	 * 
	 * @param configId
	 * @param configDetailsUpdate
	 * @return CustomerConfigDetailsDto
	 */
	CustomerConfigDetailsDto createCustomerConfigDetails(String configId, CustomerConfigRequestDto configDetailsUpdate);

	/**
	 * @param configId
	 * @return
	 */
	CustomerConfigDetailsDto listCustomerConfigDetails(String configId);

	/**
	 * 
	 * @param mappedLocationDto
	 * @return ListResponse<MappedConfigResponseDto>
	 */
	ListResponse<MappedConfigResponseDto> getMappedLocationCodes(String configType,
			MappedLocationDto mappedLocationDto);

	/**
	 * 
	 * @param configId
	 * @param configLocationDto
	 * @return ConfigLocationResponseDto
	 */
	ConfigLocationResponseDto locationsMappings(String configId, String configType, ConfigLocationResponseDto configLocationDto);

}