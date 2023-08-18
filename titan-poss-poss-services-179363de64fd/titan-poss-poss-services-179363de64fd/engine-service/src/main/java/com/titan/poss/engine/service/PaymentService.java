/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import static com.titan.poss.engine.constant.EngineConstants.PAYMENT_ENGINE_SERVICE;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BaseEmployeePaymentConfigDto;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.engine.constant.CustomerTypeEnum;
import com.titan.poss.engine.dto.PayeeBankLocationDto;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_ENGINE_SERVICE)
public interface PaymentService {

	/**
	 * This method will return the Payment Configuration details based on the
	 * transactionType.
	 * 
	 * @param transactionType
	 * @return ConfigDetailsLocationMappingDto
	 */
	ConfigDetailsLocationMappingDto getConfigLocationMapping(String transactionType, String configType);

	/**
	 * This method will return the Lov details based on lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	LovDto getPaymentLov(String lovType);

	/**
	 * This method will return list of payee bank names based on payer bank search
	 * and location code.
	 * 
	 * @param paymentCode
	 * @return ListResponse<String>
	 */
	ListResponse<String> getPayeeBankNames(String paymentCode);

	/**
	 * This method will return list of product groups names based on paymentCode and
	 * cardNumber.
	 *
	 * @param paymentCode
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	PaymentProductGroupDto getProductGroups(String paymentCode, String cardNumber);

	/**
	 * This method will return list of payee bank names based on paymentCode and
	 * locationCode.
	 * 
	 * @param locationCode
	 * @param paymentCode
	 * @return ListResponse<PayerBankDetails>
	 */
	PayerBankDto getPayerBankDetails(String locationCode, String paymentCode);

	/**
	 * This method will return list of payment codes
	 * 
	 * @return ListReponse<String>
	 */
	ListResponse<String> getDevices();

	/**
	 * @param customerType
	 * @param configType
	 * @return
	 */
	CustomerTransactionConfigDto getCustomerConfig(@ValueOfEnum(enumClass = CustomerTypeEnum.class) String customerType,
			@ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType);

	/**
	 * @return
	 */
	Map<String, String> listCreditNoteTypes();

	/**
	 * @param productGroupCodeDigiGold
	 * @return ProductGroupDtoDigiGold
	 */
	ProductGroupDtoDigiGold getProductGroupsForDigiGold(ProductGroupDtoDigiGold productGroupCodeDigiGold);
	
//	EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode,Date buisnessDate);
	
	Object getCreditNote(String creditNoteType);

	/**
	 * This method will return list of payee bank defaults 
	 * and location code.	 * @return ListResponse<String>
	 */
	Object getPayeeBankDefaultList(Pageable pageable);
	
	PayeeBankLocationDto getPayeeBank(String paymentCode);
	
	Boolean getIsActive(String bankName);
	
	//List<PayerBankDtoRes> getBankName(String locationCode);
	
	List<EdcBanksDto> getEdcBank(String paymentCode,EdcBankRequestDto edcBankRequestDto);
}
