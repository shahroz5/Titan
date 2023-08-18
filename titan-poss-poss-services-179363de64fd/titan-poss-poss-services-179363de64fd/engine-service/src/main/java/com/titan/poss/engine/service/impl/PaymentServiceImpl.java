/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import static com.titan.poss.engine.constant.EngineConstants.PAYMENT_ENGINE_SERVICE;

import java.io.IOException;
import java.util.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.PaymentDto;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.ProductGroupDigiGoldResponseDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.PayeeBankLocationDto;
import com.titan.poss.engine.product.repository.ProductGroupRepositoryExt;
import com.titan.poss.engine.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.engine.service.PaymentService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDetailsDao;
import com.titan.poss.payment.dao.ConfigLocationMappingDao;
import com.titan.poss.payment.dao.CreditNoteMasterDao;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PayerDetailsDao;
import com.titan.poss.payment.dao.PayerLocationMappingDao;
import com.titan.poss.payment.dao.PaymentCategoryDao;
import com.titan.poss.payment.dao.PaymentCustomerMappingDao;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;
import com.titan.poss.payment.dao.PaymentLovDao;
import com.titan.poss.payment.repository.ConfigDetailsRepository;
import com.titan.poss.payment.repository.ConfigLocationMappingRepository;
import com.titan.poss.payment.repository.ConfigRepository;
import com.titan.poss.payment.repository.CreditNoteMasterRepository;
import com.titan.poss.payment.repository.EmployeeLocationMappingRepository;
import com.titan.poss.payment.repository.EmployeeProductMappingRepository;
import com.titan.poss.payment.repository.PayeeBankLocationMappingRepository;
import com.titan.poss.payment.repository.PayeeBankRepository;
import com.titan.poss.payment.repository.PayerBankConfigRepository;
import com.titan.poss.payment.repository.PayerBankRepository;
import com.titan.poss.payment.repository.PayerDetailsRepository;
import com.titan.poss.payment.repository.PayerLocationMappingRepository;
import com.titan.poss.payment.repository.PaymentCustomerMappingRepository;
import com.titan.poss.payment.repository.PaymentHostnameMappingRepository;
import com.titan.poss.payment.repository.PaymentLovRepository;
import com.titan.poss.payment.repository.PaymentMasterRepository;
import com.titan.poss.payment.repository.PaymentProductMappingRepository;
import com.titan.poss.payment.repository.PaymentRepository;
import com.titan.poss.payment.util.PaymentCommonUtil;
import com.titan.poss.product.dto.request.json.ProductGroupPricing;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service(PAYMENT_ENGINE_SERVICE)
public class PaymentServiceImpl implements PaymentService {

	private static final String CONFIG_NAME = "configType";

	@Autowired
	private ConfigDetailsRepository configDetailsRepository;

	@Autowired
	PaymentCustomerMappingRepository paymentCustomerMappingRepo;

	@Autowired
	private ConfigLocationMappingRepository configLocationMappingRepository;

	@Autowired
	private PaymentProductMappingRepository paymentProductMappingRepository;

	@Autowired
	private PaymentLovRepository paymentLovRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private PayerDetailsRepository payerDetailsRepository;

	@Autowired
	private PayerBankConfigRepository payerBankConfigRepository;

	@Autowired
	private PayeeBankLocationMappingRepository payeeBankLocationMappingRepository;

	@Autowired
	private PayerLocationMappingRepository payerLocationMappingRepository;

	@Autowired
	private PaymentHostnameMappingRepository paymentHostnameMappingRepository;

	@Autowired
	private PayerBankRepository payerBankRepository;

	@Autowired
	private PayeeBankRepository payeeBankRepository;

	@Autowired
	private PaymentCommonUtil commonUtil;

	@Autowired
	private ConfigRepository configRepository;

	@Autowired
	private CreditNoteMasterRepository crediNoteRepo;

	@Autowired
	private ProductGroupRepositoryExt productGroupRepository;

	@Autowired
	PaymentMasterRepository employeeLoanRepository;

	@Autowired
	private SalesService salesService;

	@Autowired
	EmployeeLocationMappingRepository employeeLocationMappingRepo;

	@Autowired
	EmployeeProductMappingRepository employeeProductMappingRepository;
	
	@Autowired
	PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	private static final String EMPLOYEERECORDNOTFOUND = "This Employee Code record is not found.";
	private static final String ERR_ENG_033 = "ERR-ENG-033";
	private static final String EMPCODENOTFOUND = "The Selected Employee Code is not available to get loan for current location.";
	private static final String ERR_ENG_032 = "ERR-ENG-032";

	

	/**
	 * This method will return the Payment Configuration details based on the
	 * transactionType.
	 *
	 * @param transactionType
	 * @return ConfigDetailsLocationMappingDto
	 */
	// add configType in error code.
	@Override
	public ConfigDetailsLocationMappingDto getConfigLocationMapping(String transactionType, String configType) {

		ConfigDetailsLocationMappingDto configDetailsLocationMappingDto = new ConfigDetailsLocationMappingDto();

		ConfigLocationMappingDao configLocationMappingDao = configLocationMappingRepository
				.findByLocationCodeAndConfigType(CommonUtil.getLocationCode(), configType);

		if (configLocationMappingDao == null) {
			throw new ServiceException("Payment mode configurations are missing.", "ERR-PAY-047",
					"Payment mode configurations are missing.");
		}

		ConfigDao configDao = configRepository.findOneByConfigId(configLocationMappingDao.getConfigId().getConfigId());

		if (!Boolean.TRUE.equals(configDao.getIsActive())) {
			throw new ServiceException("Payment configuration is inactive", "ERR-PAY-025",
					configType + " - " + configDao.getConfigId() + "is inactive.", Map.of(CONFIG_NAME, "Payment"));
		}

		configDetailsLocationMappingDto.setConfigId(configLocationMappingDao.getConfigId().getConfigId());

		List<ConfigDetailsDao> configDetailsDao = configDetailsRepository
				.findByConfigIdAndTransactionDaoTransactionType(configLocationMappingDao.getConfigId(),
						transactionType);

		Map<String, ConfigDetailsDao> configDetailsMap = configDetailsDao.stream().collect(
				Collectors.toMap(configDetails -> configDetails.getPayment().getPaymentCode(), Function.identity()));

		List<String> paymentCodeList = configDetailsMap.keySet().stream().collect(Collectors.toList());

		List<PaymentDao> paymentDaoList = paymentRepository.findByPaymentCodeIn(paymentCodeList);

		List<PaymentDto> paymentDtoList = paymentDaoList.stream().filter(PaymentDao::getIsActive).map(payment -> {
			PaymentDto paymentDto = (PaymentDto) MapperUtil.getObjectMapping(payment, new PaymentDto());
			if (payment.getFieldDetails() != null) {
				paymentDto.setFields(commonUtil.getFieldDetails(payment.getFieldDetails()));
			}
			if (configDetailsMap.containsKey(payment.getPaymentCode())
					&& !StringUtil.isBlankJsonStr(configDetailsMap.get(payment.getPaymentCode()).getConfigDetails())) {
				paymentDto.setConfigDetails(MapperUtil
						.getJsonFromString(configDetailsMap.get(payment.getPaymentCode()).getConfigDetails(), false));
			}
			return paymentDto;
		}).collect(Collectors.toList());

		configDetailsLocationMappingDto.setPaymentCodeDetails(paymentDtoList);
		configDetailsLocationMappingDto.setTransactionType(transactionType);

		return configDetailsLocationMappingDto;
	}

	/**
	 * This method will return the Lov details based on lovType.
	 *
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getPaymentLov(String lovType) {
		List<PaymentLovDao> paymentLovList = paymentLovRepository.findByLovTypeAndIsActiveTrue(lovType);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!paymentLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = paymentLovList.stream()
					.map(paymentLov -> (KeyValueDto) MapperUtil.getObjectMapping(paymentLov, new KeyValueDto()))
					.collect(Collectors.toList());
			lovDto.setResults(keyValueDtoList);
		} else {
			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}

	/**
	 * This method will return list of payee bank names based on payementMode search
	 * and location code.
	 *
	 * @param paymentCode
	 * @return ListResponse<String>
	 */
	@Override
	public ListResponse<String> getPayeeBankNames(String paymentCode) {

		List<String> payeeBankList = payeeBankLocationMappingRepository.findByPaymentCode(paymentCode,
				CommonUtil.getLocationCode());

		List<PayeeBankDao> activePayeeBank = payeeBankRepository.findAllByBankNameInAndIsActive(payeeBankList,
				Boolean.TRUE);

		return new ListResponse<>(activePayeeBank.stream().map(PayeeBankDao::getBankName).collect(Collectors.toList()));
	}

	/**
	 * This method will return list of product groups names based on paymentCode and
	 * cardNumber.
	 *
	 * @param paymentCode
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	@Override
	public PaymentProductGroupDto getProductGroups(String paymentCode, String cardNumber) {

		PaymentProductGroupDto productGroupDto = new PaymentProductGroupDto();
		PaymentCategoryDao paymentCategoryDao = null;
		List<PaymentCategoryDao> paymentCategoryDaoList = paymentProductMappingRepository
				.findAllCategoryDaos(paymentCode, Boolean.TRUE);

		if (cardNumber != null) {
			paymentCategoryDao = getValidPaymentCategoryDao(paymentCategoryDaoList, cardNumber);
		} else
			paymentCategoryDao = paymentProductMappingRepository.getCategoryName(paymentCode, Boolean.TRUE);

		if (paymentCategoryDao == null)
			throw new ServiceException(EngineConstants.NO_CPG_PRODUCT_GROUP_FOUND_FOR_THE_REQUESTED_SEARCH,
					EngineConstants.ERR_PAY_007, EngineConstants.NO_CPG_PRODUCT_GROUP_FOUND_FOR_THE_REQUESTED_SEARCH);
		// ProductMasterDto productMasterDto = new
		// ProductMasterDto(paymentCategoryDao.getPaymentCategoryName(),paymentCategoryDao.getRedemptionType());

		productGroupDto.setPaymentCategoryName(paymentCategoryDao.getPaymentCategoryName());
		productGroupDto.setRedemptionType(paymentCategoryDao.getRedemptionType());
		productGroupDto.setProductGroupCode(
				paymentProductMappingRepository.getMappedProductGroup(paymentCategoryDao.getPaymentCategoryName()));
		if (paymentCategoryDao.getInstrumentNumber() != null) {
			String str = paymentCategoryDao.getInstrumentNumber();
			if (cardNumber != null && !StringUtil.isBlankJsonStr(str)) {
				try {
					JsonData jsonData = MapperUtil.mapObjToClass(str, JsonData.class);
					JsonArray instNoDetails = new JsonParser().parse(jsonData.getData().toString()).getAsJsonArray();
					for (int i = 0; i < instNoDetails.size(); i++) {
						JsonObject instNoDetail = instNoDetails.get(i).getAsJsonObject();
						String instrumentNo = instNoDetails.get(i).getAsJsonObject().get("instrumentNo").getAsString();
						if (instrumentNo.equals(cardNumber.substring(0, 9)))
							productGroupDto
									.setIsGhsVoucherEnabled(instNoDetail.get("isGhsVoucherEnabled").getAsBoolean());
					}
				} catch (Exception e) {
					log.info("Error in parsing" + e.getMessage());
				}
			}
		}
		return productGroupDto;
	}

	/**
	 * @param paymentCategoryDaoList
	 * @param cardNumber
	 * @return
	 */
	private PaymentCategoryDao getValidPaymentCategoryDao(List<PaymentCategoryDao> paymentCategoryDaoList,
			String cardNumber) {
		for (PaymentCategoryDao pcd : paymentCategoryDaoList) {
			JsonData jsonData1 = MapperUtil.mapObjToClass(pcd.getInstrumentNumber(), JsonData.class);
			if (jsonData1.getData().toString().contains(cardNumber.substring(0, 9)))
				return pcd;
		}
		return null;
	}

	/**
	 * This method will return list of payee bank names based on paymentCode and
	 * locationCode.
	 *
	 * @param locationCode
	 * @param paymentCode
	 * @return ListResponse<PayerBankDetails>
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	@Override
	public PayerBankDto getPayerBankDetails(String locationCode, String paymentCode) {

		PayerLocationMappingDao payerLocationMappingDao = payerLocationMappingRepository
				.findByLocationCodeAndPaymentPaymentCode(locationCode, paymentCode);

		if (payerLocationMappingDao == null)
			throw new ServiceException("payer bank not been configured for that Location code",
					EngineConstants.ERR_LOC_073);

		PayerBankDto payerBankDto = new PayerBankDto();

		PayerConfigDao payerConfigDao = payerBankConfigRepository
				.findOneByIdAndIsActive(payerLocationMappingDao.getPayerBankConfig().getId(), Boolean.TRUE);

		if (payerConfigDao == null)
			throw new ServiceException("payer bank not been configured for that Location code",
					EngineConstants.ERR_LOC_073);

		if (payerConfigDao.getPaymentDetails() != null && !payerConfigDao.getPaymentDetails().equalsIgnoreCase("{}"))
			payerBankDto.setPaymentDetails(MapperUtil.getJsonFromString(payerConfigDao.getPaymentDetails()));

		List<PayerDetailsDao> payerDetailsDao = payerDetailsRepository.findByPayerBankConfig(payerConfigDao);

		List<String> bankNameList = payerDetailsDao.stream().map(bankName -> bankName.getPayerBank().getBankName())
				.collect(Collectors.toList());

		List<PayerBankDao> payerBankDaoList = payerBankRepository.findAllByBankNameInAndIsActive(bankNameList,
				Boolean.TRUE);

		List<String> activeBankName = payerBankDaoList.stream().map(PayerBankDao::getBankName)
				.collect(Collectors.toList());

		payerBankDto.setPayerBank(payerDetailsDao.stream()
				.filter(payerBankFilter -> activeBankName.contains(payerBankFilter.getPayerBank().getBankName()))
				.map(bankName -> bankName.getPayerBank().getBankName()).collect(Collectors.toList()));

		return payerBankDto;
	}

	@Override
	public ListResponse<String> getDevices() {
		List<String> strList = new ArrayList<>();
		List<PaymentHostnameMappingDao> deviceHostnameMappingDaoList = paymentHostnameMappingRepository
				.findByLocationCodeAndHostName(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
						CustomSecurityPrincipal.getSecurityPrincipal().getHostName());
		deviceHostnameMappingDaoList.forEach(deviceHostnameMappingDao -> {
			if (BooleanUtils.isTrue(deviceHostnameMappingDao.getIsActive())) {
				strList.add(deviceHostnameMappingDao.getPaymentCode());
			}
		});
		return new ListResponse<>(strList);
	}

	@Override
	@Transactional
	public CustomerTransactionConfigDto getCustomerConfig(String customerType, String configType) {

		ConfigLocationMappingDao configLocDao = configLocationMappingRepository
				.findByLocationCodeAndConfigType(CommonUtil.getLocationCode(), configType);

		if (configLocDao == null) {
			Map<String, String> dynamicValues = new HashMap<>();
			dynamicValues.put(CONFIG_NAME, configType);
			dynamicValues.put("locationCode", CommonUtil.getLocationCode());
			throw new ServiceException(EngineConstants.NO_CONFIGURATION_FOUND_FOR_CONFIG_TYPE,
					EngineConstants.ERR_PAY_021, dynamicValues);
		}

		if (!Boolean.TRUE.equals(configLocDao.getConfigId().getIsActive())) {
			throw new ServiceException("Customer configuration is inactive", "ERR-PAY-025",
					configType + " - " + configLocDao.getConfigId().getConfigId() + "is inactive.",
					Map.of(CONFIG_NAME, "Customer"));
		}

		List<PaymentCustomerMappingDao> customerConfigList = paymentCustomerMappingRepo
				.findByConfigIdAndCustomerType(configLocDao.getConfigId(), customerType);

		CustomerTransactionConfigDto configDto = new CustomerTransactionConfigDto();
		List<String> transactionTypeList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(customerConfigList)) {

			for (PaymentCustomerMappingDao customerConfig : customerConfigList) {
				configDto = (CustomerTransactionConfigDto) MapperUtil.getObjectMapping(customerConfig,
						new CustomerTransactionConfigDto());
				configDto.setConfigId(customerConfig.getConfigId().getConfigId());
				transactionTypeList.add(customerConfig.getTransactionDao().getTransactionType());
				configDto.setTransactionType(transactionTypeList);
			}

		}
		return configDto;
	}

	@Override
	public Map<String, String> listCreditNoteTypes() {
		Map<String, String> creditNoteMap = new HashMap<>();
		List<CreditNoteMasterDao> creditNotes = crediNoteRepo.findByIsActive(true);

		creditNotes
				.forEach(creditNote -> creditNoteMap.put(creditNote.getCreditNoteType(), creditNote.getDescription()));
		return creditNoteMap;
	}

	@Override
	public ProductGroupDtoDigiGold getProductGroupsForDigiGold(ProductGroupDtoDigiGold productGroupCodeDigiGold) {
		ProductGroupDtoDigiGold validProductGroupDto = new ProductGroupDtoDigiGold();
		List<String> validProductGroupCodes = new ArrayList<>();
		List<ProductGroupDigiGoldResponseDto> productGroupDaoList = productGroupRepository
				.getProductGroupDetails(productGroupCodeDigiGold.getProductGroupCodes());
		productGroupDaoList.forEach(productGroupDao -> {

			ProductGroupPricing productGroupPricing = MapperUtil.mapObjToClass(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(productGroupDao.getPricingDetails()), JsonData.class)
					.getData(), ProductGroupPricing.class);
			if (BooleanUtils.isTrue(productGroupPricing.getIsAllowedForDigiGoldMandatory()))
				validProductGroupCodes.add(productGroupDao.getProductGroupCode());

		});
		validProductGroupDto.setProductGroupCodes(validProductGroupCodes);
		return validProductGroupDto;
	}

	@Override
	public Object getCreditNote(String creditNoteType) {
		CreditNoteMasterDao creditNote = crediNoteRepo.findOneByCreditNoteType(creditNoteType);

		if (creditNote == null) {
			throw new ServiceException("No credit notes found: ", "ERR-PAY-22");
		} else {
			return creditNote.getConfigDetails();
		}

	}

//	@Override
//	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode,Date buisnessDate) {
//		
//		String locationCode = CommonUtil.getLocationCode();
//		Date businessDate = salesService.getBusinessDay(locationCode).getBusinessDate();
//		EmployeePaymentDtoExt employeePaymentConfigDto = null;
//		List<String> cfaCodes = new ArrayList<String>();
//		List<String> locationCodesList = new ArrayList<String>();
//		EmployeePaymentConfigDao employeePaymentDao = employeeLoanRepository.getEmployeeDetails(employeeCode,
//				businessDate);
//		if (employeePaymentDao != null) {
//
//			EmployeeLocationMappingDao employeeLocationMappingDao = employeeLocationMappingRepo
//					.findByLocCodeAndEmployeeId(locationCode, employeePaymentDao);
//
//			if (employeeLocationMappingDao != null) {
//
//				List<EmployeeProductMappingDao> employeeProductMappingDao = employeeProductMappingRepository
//						.findByEmployeeID(employeePaymentDao);
//				employeePaymentConfigDto = (EmployeePaymentDtoExt) MapperUtil.getDtoMapping(employeePaymentDao,
//						EmployeePaymentDtoExt.class);
//
//				if (employeeProductMappingDao != null && employeeProductMappingDao.size() > 0) {
//					for (EmployeeProductMappingDao productGroups : employeeProductMappingDao) {
//						cfaCodes.add(productGroups.getProductGroupCode());
//					}
//				}
//
//				employeePaymentConfigDto.setProductGroupCodes(cfaCodes);
//				locationCodesList.add(locationCode);
//				employeePaymentConfigDto.setLocationCode(locationCodesList);
//				employeePaymentConfigDto.setLoanConfigDetails(employeeLocationMappingDao.getLoanConfigDetails());
//
//				return employeePaymentConfigDto;
//			} else {
//				throw new ServiceException(EMPCODENOTFOUND, ERR_ENG_032);
//			}
//
//		} else {
//			throw new ServiceException(EMPLOYEERECORDNOTFOUND, ERR_ENG_033);
//		}
//	}
	
	/**
	 * This method will return list of payee bank defaults 
	 * and location code.	 * @return ListResponse<String>
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public Object getPayeeBankDefaultList(Pageable pageable) {
		Page<PayeeBankLocationMappingDao> payeeBankList = payeeBankLocationMappingRepository
				.findByLocationCodeAndIsDefault(CommonUtil.getLocationCode(), Boolean.TRUE, pageable);
		List<PayeeBankLocationDto> payeeBankLocationDtoList = new ArrayList<PayeeBankLocationDto>();
		for (PayeeBankLocationMappingDao payeeBankLocation : payeeBankList) {
			PayeeBankLocationDto payeeBankLocationDto = new PayeeBankLocationDto();
			payeeBankLocationDto.setId(payeeBankLocation.getId());
			payeeBankLocationDto.setBankName(payeeBankLocation.getPayeeBank().getBankName());
			payeeBankLocationDto.setPaymentCode(payeeBankLocation.getPayment().getPaymentCode());
			payeeBankLocationDto.setLocationCode(payeeBankLocation.getLocationCode());
			payeeBankLocationDto.setGlCode(payeeBankLocation.getGlCode());
			payeeBankLocationDto.setIsDefault(payeeBankLocation.getIsDefault());
			payeeBankLocationDtoList.add(payeeBankLocationDto);
		}
	    return new PagedRestResponse<>(payeeBankLocationDtoList , payeeBankList);
	}

	@Override
	public PayeeBankLocationDto getPayeeBank(String paymentCode) {
		PayeeBankLocationMappingDao payeeBank= payeeBankLocationMappingRepository
		.findByLocationCodeAndIsDefaultAndPaymentCode(paymentCode,CommonUtil.getLocationCode(), Boolean.TRUE);
	if(payeeBank!=null) {
		PayeeBankLocationDto payeeBankLocation = (PayeeBankLocationDto) MapperUtil
				.getObjectMapping(payeeBank, new PayeeBankLocationDto());
		payeeBankLocation.setPaymentCode(payeeBank.getPayment().getPaymentCode());
		payeeBankLocation.setBankName(payeeBank.getPayeeBank().getBankName());
		return payeeBankLocation;
	}
	return new PayeeBankLocationDto();

	}

	@Override
	public Boolean getIsActive(String bankName) {
		Boolean isActive = payeeBankRepository. getIsActive(bankName);
		if(isActive == null) {
			return false;
		}
		return isActive;
	}

	
//	@Override
//	public List<PayerBankDtoRes> getBankName(String locationCode) {
//		List<Object[]> objectList = payerBankRepository.getPayerBankLists(locationCode);
//		
//		List<PayerBankDtoRes> payeebankList = new ArrayList<PayerBankDtoRes>();
//		for (Object[] obj : objectList) { 
//			   PayerBankDtoRes payerBank = new PayerBankDtoRes();
//			          payerBank.setLocationCode((String) obj[0]);
//			          payerBank.setBankName((String) obj[1]);
//			          payerBank.setIsActive((Boolean) obj[2]);
//			          payerBank.setCreatedBy((String) obj[3]);
//			          payerBank.setCreatedDate((Date) obj[4]);
//			          payerBank.setLastModifiedBy((String) obj[5]);
//			          payerBank.setLastModifiedDate((Date) obj[6]);
//			          payeebankList.add(payerBank);
//		}
//			
//		return payeebankList;
//	}

	@Override
	public List<EdcBanksDto> getEdcBank(String paymentCode,EdcBankRequestDto edcBankRequestDto) {
		List<EdcBanksDto> payeebankList = new ArrayList<EdcBanksDto>();
		 List<Object[]> payeeBank = new ArrayList<Object[]>();
		if(edcBankRequestDto.getFromDocDate() == null && edcBankRequestDto.getToDocDate() == null) {
			  payeeBank= payeeBankLocationMappingRepository
					  .findByPaymentCode(paymentCode);
		}else {
			 payeeBank = payeeBankLocationMappingRepository
					.findByPaymentCodeAndDates(paymentCode,edcBankRequestDto);					
		}
		for(Object[] obj : payeeBank){
			EdcBanksDto payerBank = new EdcBanksDto();
			 payerBank.setBankName((String) obj[0]);
			 payerBank.setCreatedBy((String) obj[1]);
			 payerBank.setCreatedDate(((Date) obj[2]).getTime());
			 payerBank.setIsActive((Boolean) obj[3]);
			 payerBank.setLastModifiedBy((String) obj[4]);
			 payerBank.setLastModifiedDate(((Date) obj[5]).getTime());
			 payerBank.setLocationCode((String) obj[6]);
			 payeebankList.add(payerBank); 
		 }
		return payeebankList;
	}
}
