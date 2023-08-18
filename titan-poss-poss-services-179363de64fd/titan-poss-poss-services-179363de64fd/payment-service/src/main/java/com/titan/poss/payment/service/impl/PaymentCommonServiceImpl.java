/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_UTIL_SERVICE_IMPL;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.constants.TransactionSearchTypeEnum;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDaoExt;
import com.titan.poss.payment.dao.ConfigDetailsDaoExt;
import com.titan.poss.payment.dao.GLBoutiqueCodeMappingDao;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt;
import com.titan.poss.payment.dao.PaymentCustomerMappingDaoExt;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dao.PaymentProductDaoExt;
import com.titan.poss.payment.dao.TransactionDao;
import com.titan.poss.payment.dto.AddGLBoutiqueCode;
import com.titan.poss.payment.dto.AddPaymentCode;
import com.titan.poss.payment.dto.ConfigDetailDto;
import com.titan.poss.payment.dto.CreateCustomerConfigDto;
import com.titan.poss.payment.dto.response.ConfigDetailsDto;
import com.titan.poss.payment.dto.response.ConfigDto;
import com.titan.poss.payment.dto.response.CustomerConfigDetailsDto;
import com.titan.poss.payment.dto.response.CustomerConfigDto;
import com.titan.poss.payment.dto.response.GLBoutiqueCodeMappingDto;
import com.titan.poss.payment.dto.response.PayeeBankLocationDto;
import com.titan.poss.payment.dto.response.PaymentProductDto;
import com.titan.poss.payment.repository.PayeeBankLocationMappingRepositoryExt;
import com.titan.poss.payment.service.PaymentCommonService;
import com.titan.poss.payment.service.TransactionService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_UTIL_SERVICE_IMPL)
public class PaymentCommonServiceImpl implements PaymentCommonService {

	@Autowired
	private PayeeBankLocationMappingRepositoryExt payeeBankLocationMappingRepository;

	@Autowired
	private TransactionService transactionService;

	/**
	 * method to get the ConfigDetailsDao.
	 *
	 * @param configId
	 * @param configsDto
	 * @return ConfigDetailsDao
	 */
	@Override
	public ConfigDetailsDaoExt getConfigDetailDao(ConfigDetailsDaoExt configDetailDao, ConfigDetailDto configsDto,
			String configId) {
		ConfigDaoExt configDao = new ConfigDaoExt();
		configDao.setConfigId(configId);
		configDetailDao.setConfigId(configDao);
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(configsDto.getPaymentCode());
		configDetailDao.setPayment(paymentDao);

		TransactionDao txnDao = new TransactionDao();
		txnDao.setTransactionType(configsDto.getTransactionType());
		configDetailDao.setTransactionDao(txnDao);

		configDetailDao.setConfigDetails(MapperUtil.getStringFromJson(configsDto.getConfigDetails()));
		return configDetailDao;
	}

	/**
	 * This method will get the Payment Configuration Details Response.
	 *
	 * @param configId
	 * @param configDetailsDao
	 * @return ConfigDetailsDto
	 */
	@Override
	public ConfigDetailsDto getConfigDetailResponse(List<ConfigDetailsDaoExt> configDetailsDao, String configId) {
		List<ConfigDto> configDtoList = new ArrayList<>();

		ConfigDetailsDto configDetailsDto = new ConfigDetailsDto();
		if (configDetailsDao != null && !configDetailsDao.isEmpty()) {
			configDetailsDto.setConfigId(configId);
			configDetailsDao.forEach(configs -> {
				ConfigDto configDto = (ConfigDto) MapperUtil.getObjectMapping(configs, new ConfigDto());
				configDto.setPaymentCode(configs.getPayment().getPaymentCode());
				configDto.setTransactionType(configs.getTransactionDao().getTransactionType());
				configDto.setConfigDetails(MapperUtil.getJsonFromString(configs.getConfigDetails()));
				configDtoList.add(configDto);
			});
			configDetailsDto.setConfigs(configDtoList);
		}
		return configDetailsDto;
	}

	/**
	 * This method will get the Payee Bank Location Details Response.
	 *
	 * @param payeeBankLocationMappingDao
	 * @return PayeeBankLocationDto
	 */
	@Override
	public List<PayeeBankLocationDto> getPayeeDtoMapping(
			List<PayeeBankLocationMappingDaoExt> payeeBankLocationMappingDao) {
		List<PayeeBankLocationDto> payeeBankLocationList = new ArrayList<>();
		payeeBankLocationMappingDao.forEach(payeeMappingDao -> {
			PayeeBankLocationDto payeeBankLocationDto = (PayeeBankLocationDto) MapperUtil
					.getObjectMapping(payeeMappingDao, new PayeeBankLocationDto());
			payeeBankLocationDto.setBankName(payeeMappingDao.getPayeeBank().getBankName());
			payeeBankLocationDto.setPaymentCode(payeeMappingDao.getPayment().getPaymentCode());
			payeeBankLocationList.add(payeeBankLocationDto);
		});
		return payeeBankLocationList;
	}

	/**
	 * This method will get the Payee Bank Location Details Response.
	 *
	 * @param paymentCodes
	 * @param bankName
	 * @param addLocation
	 * @param payeeBankMappingMap
	 * @return PayeeBankLocationDto
	 */
	@Override
	public PayeeBankLocationMappingDaoExt getPayeeDaoMapping(AddPaymentCode paymentCodes, String bankName,
			String addLocation, Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap) {
		PayeeBankLocationMappingDaoExt payeeBankLocationMappingDao = new PayeeBankLocationMappingDaoExt();
		if (payeeBankMappingMap.containsKey(bankName.concat(PaymentConstants.PIPE).concat(paymentCodes.getPaymentCode())
				.concat(PaymentConstants.PIPE).concat(addLocation).concat(PaymentConstants.PIPE)
				.concat(paymentCodes.getIsDefault().toString()).toLowerCase())) {
			payeeBankLocationMappingDao = payeeBankMappingMap.get(bankName.concat(PaymentConstants.PIPE)
					.concat(paymentCodes.getPaymentCode()).concat(PaymentConstants.PIPE).concat(addLocation)
					.concat(PaymentConstants.PIPE).concat(paymentCodes.getIsDefault().toString()).toLowerCase());
			payeeBankLocationMappingDao.setGlCode(paymentCodes.getGlCode());
			payeeBankLocationMappingDao.setIsDefault(paymentCodes.getIsDefault());
		} else {
			payeeBankLocationMappingDao.setGlCode(paymentCodes.getGlCode());
			payeeBankLocationMappingDao.setIsDefault(paymentCodes.getIsDefault());
			PaymentDao paymentDao = new PaymentDao();
			paymentDao.setPaymentCode(paymentCodes.getPaymentCode());
			payeeBankLocationMappingDao.setPayment(paymentDao);
			PayeeBankDao payeeBankDao = new PayeeBankDao();
			payeeBankDao.setBankName(bankName);
			payeeBankLocationMappingDao.setPayeeBank(payeeBankDao);
			payeeBankLocationMappingDao.setLocationCode(addLocation);
		}
		return payeeBankLocationMappingDao;
	}

	/**
	 * This method will get the Payer Bank Location Details Response.
	 *
	 * @param glCodeMappingDaoList
	 * @return GLCodeMappingDto
	 */
	@Override
	public List<GLBoutiqueCodeMappingDto> getGLDtoMapping(List<GLBoutiqueCodeMappingDao> glCodeMappingDaoList) {
		List<GLBoutiqueCodeMappingDto> gLCodeMappingDto = new ArrayList<>();
		glCodeMappingDaoList.forEach(glCodeMappingDao -> {
			GLBoutiqueCodeMappingDto glCodeMappingDto = new GLBoutiqueCodeMappingDto();
			glCodeMappingDto.setId(glCodeMappingDao.getId());
			glCodeMappingDto.setGlCode(glCodeMappingDao.getGlCode());
			glCodeMappingDto.setLocationCode(glCodeMappingDao.getLocationCode());
			glCodeMappingDto.setPaymentCode(glCodeMappingDao.getPayment().getPaymentCode());
			gLCodeMappingDto.add(glCodeMappingDto);
		});
		return gLCodeMappingDto;
	}

	/**
	 * This method will get the Payer Bank Location Details Response.
	 *
	 * @param addLocation
	 * @param addGLCode
	 * @param glCodeMappingMap
	 * @return GLCodeMappingDao
	 */
	@Override
	public GLBoutiqueCodeMappingDao getGLCodeDaoMapping(String addLocation, AddGLBoutiqueCode addGLCode,
			Map<String, GLBoutiqueCodeMappingDao> glCodeMappingMap) {
		GLBoutiqueCodeMappingDao glCodeMappingDao = new GLBoutiqueCodeMappingDao();
		if (glCodeMappingMap
				.containsKey(addLocation.concat(PaymentConstants.PIPE).concat(addGLCode.getPaymentCode()))) {
			glCodeMappingDao = glCodeMappingMap
					.get(addLocation.concat(PaymentConstants.PIPE).concat(addGLCode.getPaymentCode()));
			glCodeMappingDao.setGlCode(addGLCode.getGlCode());
		} else {
			glCodeMappingDao.setLocationCode(addLocation);
			glCodeMappingDao.setGlCode(addGLCode.getGlCode());
			PaymentDao payment = new PaymentDao();
			payment.setPaymentCode(addGLCode.getPaymentCode());
			glCodeMappingDao.setPayment(payment);
		}
		return glCodeMappingDao;
	}

	@Override
	public Map<String, PayeeBankLocationMappingDaoExt> getMappingForPayeeBank(
			List<PayeeBankLocationMappingDaoExt> addPaymentCodes, String bankName) {
		boolean status = true;
		Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap = new HashMap<>();
		for (PayeeBankLocationMappingDaoExt payeeBankMappingDao : addPaymentCodes) {
			if (payeeBankMappingDao.getPayeeBank().getBankName().equalsIgnoreCase(bankName)) {
				String mapKey = payeeBankMappingDao.getPayeeBank().getBankName().concat(PaymentConstants.PIPE)
						.concat(payeeBankMappingDao.getPayment().getPaymentCode()).concat(PaymentConstants.PIPE)
						.concat(payeeBankMappingDao.getLocationCode()).concat(PaymentConstants.PIPE)
						.concat(payeeBankMappingDao.getIsDefault().toString()).toLowerCase();
				payeeBankMappingMap.put(mapKey, payeeBankMappingDao);
				status = false;
			}
		}
		if (status)
			throw new ServiceException(PaymentConstants.PAYMENT_CODE_IS_ALREADY_CONFIGURED,
					PaymentConstants.ERR_PAY_010, new ListResponse<>(getPayeeDtoMapping(addPaymentCodes)));

		return payeeBankMappingMap;
	}

	/**
	 * This method will get the Payee Bank Mapping Map.
	 *
	 * @param updateMappingDao
	 * @param payeeBankMappingMap
	 * @return Map<String, PayeeBankLocationMappingDao>
	 */
	@Override
	public List<PayeeBankLocationMappingDaoExt> getUpdateMappingForPayeeBank(
			List<PayeeBankLocationMappingDaoExt> updateMappingDao,
			Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap) {
		List<PayeeBankLocationMappingDaoExt> removeList = new ArrayList<>();

		updateMappingDao.forEach(updateMapping -> {
			if (payeeBankMappingMap.containsKey(updateMapping.getPayeeBank().getBankName().concat(PaymentConstants.PIPE)
					.concat(updateMapping.getPayment().getPaymentCode()).concat(PaymentConstants.PIPE)
					.concat(updateMapping.getLocationCode()).concat(PaymentConstants.PIPE)
					.concat(updateMapping.getIsDefault().toString()).toLowerCase())) {
				removeList.add(updateMapping);
			}
		});
		updateMappingDao.removeAll(removeList);

		return updateMappingDao;
	}

	/**
	 * @param paymentProductDaoList
	 * @return List<PaymentProductDto>
	 */
	@Override
	public List<PaymentProductDto> getPaymentProductDtoMapping(List<PaymentProductDaoExt> paymentProductDaoList) {
		List<PaymentProductDto> paymentProductDtoList = new ArrayList<>();
		paymentProductDaoList.forEach(paymentProductDao -> {
			PaymentProductDto paymentProductDto = (PaymentProductDto) MapperUtil.getObjectMapping(paymentProductDao,
					new PaymentProductDto());
			paymentProductDto
					.setPaymentCategoryName(paymentProductDao.getPaymentCategoryDao().getPaymentCategoryName());
			paymentProductDtoList.add(paymentProductDto);
		});
		return paymentProductDtoList;
	}

	/**
	 * @param serialNo
	 * @return listOfSerialNo
	 */
	@Override
	public List<BigInteger> getSerialNumberList(String serialNo) {
		List<BigInteger> listOfSerialNoInteger = new ArrayList<>();
		List<String> listOfSerialNo = Arrays.asList(serialNo.split("-"));
		BigInteger startingSerialNo = new BigInteger(listOfSerialNo.get(0).trim());
		BigInteger endingSerialNo;
		if (listOfSerialNo.get(0).trim().length() > listOfSerialNo.get(1).trim().length()) {
			endingSerialNo = new BigInteger(listOfSerialNo.get(0).trim().substring(0,
					listOfSerialNo.get(0).trim().length() - listOfSerialNo.get(1).trim().length())
					+ listOfSerialNo.get(1).trim());
		} else {
			endingSerialNo = new BigInteger(listOfSerialNo.get(1).trim());
		}

		if (endingSerialNo.subtract(startingSerialNo).compareTo(BigInteger.valueOf(50)) > 0) {
			throw new ServiceException(PaymentConstants.INVALID_RANGE_SERIAL_NO, PaymentConstants.ERR_PAY_022);
		}
		listOfSerialNoInteger.add(startingSerialNo);
		listOfSerialNoInteger.add(endingSerialNo);
		return listOfSerialNoInteger;

	}

	@Override
	public PaymentCustomerMappingDaoExt getPaymentCustomerDao(PaymentCustomerMappingDaoExt paymentCustomerDao,
			CreateCustomerConfigDto customerConfig, String configId) {
		ConfigDao configDao = new ConfigDao();
		configDao.setConfigId(configId);
		paymentCustomerDao.setConfigId(configDao);
		paymentCustomerDao.setCustomerType(customerConfig.getCustomerType());
		paymentCustomerDao.setSyncTime(new Date().getTime());
		TransactionDao txnDao = new TransactionDao();
		txnDao.setTransactionType(customerConfig.getTransactionType());
		paymentCustomerDao.setTransactionDao(txnDao);
		return paymentCustomerDao;
	}

	@Override
	public CustomerConfigDetailsDto getCustomerConfigResponse(List<PaymentCustomerMappingDaoExt> responseList,
			String configId) {
		List<CustomerConfigDto> configDtoList = new ArrayList<>();

		CustomerConfigDetailsDto configDetailsDto = new CustomerConfigDetailsDto();
		configDetailsDto.setConfigId(configId);
		responseList.forEach(customerConfig -> {
			CustomerConfigDto customerConfigDto = (CustomerConfigDto) MapperUtil.getObjectMapping(customerConfig,
					new CustomerConfigDto());
			customerConfigDto.setCustomerType(customerConfig.getCustomerType());
			customerConfigDto.setTransactionType(customerConfig.getTransactionDao().getTransactionType());
			configDtoList.add(customerConfigDto);
		});

		configDetailsDto.setConfigs(configDtoList);
		return configDetailsDto;
	}

	@Override
	public PayeeBankLocationMappingDaoExt getPayeeDaoMapping(AddPaymentCode paymentCodes, String bankName,
			String addLocation) {
		PayeeBankLocationMappingDaoExt payeeBankLocationMappingDao = new PayeeBankLocationMappingDaoExt();
		payeeBankLocationMappingDao.setGlCode(paymentCodes.getGlCode());
		payeeBankLocationMappingDao.setIsDefault(paymentCodes.getIsDefault());
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(paymentCodes.getPaymentCode());
		payeeBankLocationMappingDao.setPayment(paymentDao);
		PayeeBankDao payeeBankDao = new PayeeBankDao();
		payeeBankDao.setBankName(bankName);
		payeeBankLocationMappingDao.setPayeeBank(payeeBankDao);
		payeeBankLocationMappingDao.setLocationCode(addLocation);
		payeeBankLocationMappingDao.setSyncTime(new Date().getTime());

		List<PayeeBankLocationMappingDaoExt> payeeBankLocationMapping = payeeBankLocationMappingRepository
				.findByPayeeBankBankNameAndPaymentPaymentCodeAndLocationCode(bankName, paymentCodes.getPaymentCode(),
						addLocation);
		if (!payeeBankLocationMapping.isEmpty()) {
			String message = bankName + ", " + paymentCodes.getPaymentCode() + ", " + addLocation;
			throw new ServiceException("Duplicate Data Insertion Error", "ERR-CORE-043", message);
		}
		return payeeBankLocationMappingDao;
	}

	@Override
	public void validTxnTypeForConfig(Set<String> txnTypes, String searchType, Boolean isTrue) {
		if (CollectionUtil.isEmpty(txnTypes)) {
			return;
		}

		List<String> validTxnTypes = transactionService
				.getTransactionTypes(TransactionSearchTypeEnum.CUSTOMER_MAPPING.name(), true);

		List<String> txnTypeList = new ArrayList<>(txnTypes);
		txnTypeList.removeAll(validTxnTypes);// remove valid txn types

		if (!CollectionUtil.isEmpty(txnTypeList)) {
			txnTypeList.removeAll(validTxnTypes);
			throw new ServiceException("Transaction type(s) - {transactionType} not allowed  for the configuration.",
					"ERR-PAY-016", "Transaction type(s) - " + txnTypeList + " not allowed  for the configuration.",
					Map.of("transactionType", txnTypeList.toString()));
		}
	}

}
