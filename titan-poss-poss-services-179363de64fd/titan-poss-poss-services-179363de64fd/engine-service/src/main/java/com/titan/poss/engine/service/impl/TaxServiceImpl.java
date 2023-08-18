/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import static com.titan.poss.core.enums.TxnTaxTypeEnum.valueOfEnum;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.CessDetailDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.constant.CustomerTaxTypeEnum;
import com.titan.poss.engine.constant.CustomerTypeEnum;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.constant.TaxChargesEnum;
import com.titan.poss.engine.dto.TaxCodeDto;
import com.titan.poss.engine.dto.TransactionDto;
import com.titan.poss.engine.dto.response.CustomerDto;
import com.titan.poss.engine.location.repository.LocationRepositoryExt;
import com.titan.poss.engine.location.repository.StateTaxDetailsRepository;
import com.titan.poss.engine.location.repository.StateTaxMappingRepositoryExt;
import com.titan.poss.engine.location.repository.TaxClassRepositoryExt;
import com.titan.poss.engine.location.repository.TaxConfigsRepositoryExt;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.engine.service.TaxService;
import com.titan.poss.engine.user.repository.EmployeeRepository;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.StateTaxDetailsDao;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.TaxClassDao;
import com.titan.poss.location.dao.TaxConfigsDao;
import com.titan.poss.location.dto.constants.LocationTypeEnum;
import com.titan.poss.location.repository.StateRepository;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.user.dao.EmployeeDao;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("engineTaxService")
public class TaxServiceImpl implements TaxService {

	private static final Logger LOGGER = LoggerFactory.getLogger(TaxServiceImpl.class);

	@Autowired
	LocationRepositoryExt locationRepository;

	@Autowired
	SalesService salesService;

	@Autowired
	StateTaxMappingRepositoryExt stateTaxMappingRepository;

	@Autowired
	TaxConfigsRepositoryExt taxConfigsRepository;

	@Autowired
	StateTaxDetailsRepository stateTaxDetailsRepository;

//	@Autowired
//	CustomerTxnRepository customerTxnRepository;

	@Autowired
	StateRepository stateRepository;
	
	@Autowired
	EmployeeRepository employeeRepository;
	
	@Autowired
	CustomerLocationMappingRepositoryExt customerLocationMappingRepositoryExt;

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	@Autowired
	private ItemRepositoryExt itemRepository;

	@Autowired
	private TaxClassRepositoryExt taxClassRepository;

	/**
	 * This method will give the applicable tax and CESS according to given input.
	 * 
	 * @param srcBtqLocationCode
	 * @param destBtqLocationCode
	 * @param customerId
	 * @param txnType
	 * @param itemCode
	 * @return TaxCalculationResponseDto
	 */
	@Override
	public TaxCalculationResponseDto getTaxValues(String srcBtqLocationCode, String destBtqLocationCode,
			Integer customerId, String txnType, String itemCode, Boolean isfullvalueTep, Boolean isIGST ) {
		
		if (CommonUtil.isAStoreUser() && srcBtqLocationCode==null) {
			srcBtqLocationCode = CommonUtil.getLocationCode();
		}

		TaxCodeDto destinationConfigDetails = new TaxCodeDto();
		TaxCodeDto sourceConfigDetails;
		TransactionDto transactionDto = new TransactionDto();
		String taxClassCode;
		String taxChargeType;
		boolean status = true;
		isfullvalueTep = isfullvalueTep == null ? false : isfullvalueTep;
		if (TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.toString().equalsIgnoreCase(txnType)) {
			if (customerId != null) {
				CustomerDto customerDto = salesService.getCustomer(customerId);
				String customerType = customerDto.getCustomerType();
				if (!CustomerTypeEnum.INSTITUTIONAL.toString().equalsIgnoreCase(customerType)
						&& Boolean.FALSE.equals(isfullvalueTep)) {
					return new TaxCalculationResponseDto("ITEMCHARGES", "TC",
							Map.of("null", new TaxDetailDto("null", BigDecimal.ZERO, BigDecimal.ZERO)),
							Map.of("null", new CessDetailDto("null", BigDecimal.ZERO, BigDecimal.ZERO, Boolean.FALSE)));
				}
			} else {
				if (customerId != null || Boolean.FALSE.equals(isfullvalueTep)) {
					return new TaxCalculationResponseDto("ITEMCHARGES", "TC",
							Map.of("null", new TaxDetailDto("null", BigDecimal.ZERO, BigDecimal.ZERO)),
							Map.of("null", new CessDetailDto("null", BigDecimal.ZERO, BigDecimal.ZERO, Boolean.FALSE)));
				}
			}
		}
		sourceConfigDetails = locationRepository.getOwnerTypeAndStateTaxCodeByLocationCode(srcBtqLocationCode,
				Boolean.TRUE);
		if (sourceConfigDetails == null)
			throw new ServiceException(EngineConstants.NO_LOCATION_FOUND + " : " + srcBtqLocationCode,
					EngineConstants.ERR_LOC_001);
		if (TxnTaxTypeEnum.contains(txnType)) {
			transactionDto = getSourceStateTaxCode(customerId, transactionDto, sourceConfigDetails.getStateTaxCode(), isIGST);
		} else {
			destinationConfigDetails = locationRepository.getOwnerTypeAndStateTaxCodeByLocationCode(destBtqLocationCode,
					Boolean.TRUE);
			transactionDto = getIBTStateLocationDetails(destinationConfigDetails);
		}
		txnType = valueOfEnum(txnType);
		if (EngineConstants.NA.equalsIgnoreCase(destinationConfigDetails.getOwnerTypeCode()))
			destinationConfigDetails.setOwnerTypeCode(destBtqLocationCode);

		if (isIGST != null && isIGST == true && sourceConfigDetails.getStateTaxCode().equalsIgnoreCase(transactionDto.getStateTaxCode()) ) {
			throw new ServiceException(EngineConstants.IS_SAME_STATE + " : " + srcBtqLocationCode,
					EngineConstants.ERR_LOC_074);
		} else if (!sourceConfigDetails.getStateTaxCode().equalsIgnoreCase(transactionDto.getStateTaxCode())) {
		
			status = false;
		}
			

		TaxConfigsDao taxConfigs = taxConfigsRepository
				.findByTxnTypeAndSrcLocationTaxTypeAndDestLocationTaxTypeAndIsSameStateAndIsActive(txnType,
						sourceConfigDetails.getOwnerTypeCode(),
						LocationTypeEnum.FAC.name().equals(destinationConfigDetails.getLocationTypeCode())
								|| LocationTypeEnum.CFA.name().equals(destinationConfigDetails.getLocationTypeCode())
										? destinationConfigDetails.getLocationTypeCode()
										: destinationConfigDetails.getOwnerTypeCode(),
						transactionDto.getTaxType(), status, true);
		if (taxConfigs == null) {
			throw new ServiceException(EngineConstants.NO_LOCATION_FOUND, EngineConstants.ERR_LOC_001);
		}

		if (itemCode.equalsIgnoreCase(TaxChargesEnum.OTHERCHARGES.name())) {
			taxClassCode = EngineConstants.OTHER_CHARGES_TAX;
			taxChargeType = TaxChargesEnum.OTHERCHARGES.name();
		} else {
			taxClassCode = getTaxClassCode(itemCode);
			taxChargeType = TaxChargesEnum.ITEMCHARGES.name();
		}

		Map<String, Object> taxDetailsMap = getTaxDetailsObject(taxClassCode, transactionDto.getStateTaxCode(),
				sourceConfigDetails.getStateTaxCode(), taxConfigs);

		return getTaxCalculationDetails(taxChargeType, taxConfigs.getApplicableTax(),
				taxDetailsMap.get(EngineConstants.TAX_DETAILS), taxClassCode,
				taxDetailsMap.get(EngineConstants.TAX_COMPONENT),
				taxDetailsMap.get(EngineConstants.IS_UNION_TERRITORY));
	}

	/**
	 * 
	 * @param customerId
	 * @param transactionDto
	 * @param stateTaxCode
	 * @return TransactionDto
	 */
	private TransactionDto getSourceStateTaxCode(Integer customerId, TransactionDto transactionDto,
			String stateTaxCode, Boolean isIGST) {

		if (customerId == null || customerId.equals(0)) {
			transactionDto.setStateTaxCode(stateTaxCode);
			transactionDto.setTaxType(CustomerTaxTypeEnum.NONREGISTERED.name());
			return transactionDto;
		} else {
			return getCustomerStateLocationDetails(customerId, isIGST);
		}
	}

	/**
	 * This method will return the tax details object.
	 * 
	 * @param taxClassCode
	 * @param stateTaxCode
	 * @param srcStateTaxCode
	 * @param taxConfigs
	 * @return Object
	 */
	private Map<String, Object> getTaxDetailsObject(String taxClassCode, String stateTaxCode, String srcStateTaxCode,
			TaxConfigsDao taxConfigs) {
		Map<String, Object> taxDetailsMap = new HashMap<>();
		StateTaxMappingDao stateTaxMappingDao;
		if (Boolean.TRUE.equals(taxConfigs.getIsSameState())) {
			stateTaxMappingDao = stateTaxMappingRepository.findByStateTaxCodeAndIsActive(srcStateTaxCode, Boolean.TRUE);
		} else {
			stateTaxMappingDao = stateTaxMappingRepository.findByStateTaxCodeAndIsActive(stateTaxCode, Boolean.TRUE);
		}
		if (stateTaxMappingDao == null) {
			throw new ServiceException(EngineConstants.NO_STATETAXCODE_FOUND, EngineConstants.ERR_LOC_029);
		}
		TaxClassDao taxDetails = getTaxClassDetails(taxClassCode);
		LOGGER.info("Tax details "+taxDetails.toString());
		StateTaxDetailsDao stateTaxDetailsObj = stateTaxDetailsRepository
				.findByStateTaxMappingIdAndTaxClassCode(stateTaxMappingDao, taxDetails);
		if (stateTaxDetailsObj == null) {
			throw new ServiceException(EngineConstants.NO_TAXDETAILS_FOUND, EngineConstants.ERR_LOC_030);
		}
		StateDao stateMaster = stateRepository.findOneByStateId(stateTaxMappingDao.getState().getStateId());
		taxDetailsMap.put(EngineConstants.TAX_DETAILS,
				MapperUtil.getJsonFromString(stateTaxDetailsObj.getTaxDetails()));
		taxDetailsMap.put(EngineConstants.TAX_COMPONENT,
				MapperUtil.getJsonFromString(stateTaxMappingDao.getTaxComponent()));
		taxDetailsMap.put(EngineConstants.IS_UNION_TERRITORY, stateMaster.getIsUnionTerritory());
		return taxDetailsMap;
	}

	/**
	 * 
	 * @param destLocationStateDetails
	 * @return TransactionDto
	 */
	private TransactionDto getIBTStateLocationDetails(TaxCodeDto destLocationStateDetails) {
		TransactionDto transactionDto = new TransactionDto();
		transactionDto.setStateTaxCode(destLocationStateDetails.getStateTaxCode());
		return transactionDto;
	}

	/**
	 * 
	 * @param customerId
	 * @return TransactionDto
	 */
	private TransactionDto getCustomerStateLocationDetails(Integer customerId, Boolean isIGST) {
		TransactionDto transactionDto = new TransactionDto();
		CustomerDto customerDto = salesService.getCustomer(customerId);
		customerDto.setCustomerId(customerId);
		transactionDto.setTaxType(getCustomerTransactionType(customerDto));
		transactionDto
				.setStateTaxCode(getCustomerStateTaxCode(transactionDto.getTaxType(), customerDto,isIGST));
		return transactionDto;
	}

	private static String getCustomerTransactionType(CustomerDto customerDto) {
		String customerTaxType = customerDto.getCustomerType();
		if (CustomerTypeEnum.INSTITUTIONAL.toString().equalsIgnoreCase(customerTaxType)) {
			if (!StringUtils.isEmpty(customerDto.getInstiTaxNo()))
				customerTaxType = CustomerTaxTypeEnum.REGISTERED.getValue();
			else
				customerTaxType = CustomerTaxTypeEnum.NONREGISTERED.getValue();
		} else {
			customerTaxType = CustomerTaxTypeEnum.NONREGISTERED.getValue();
		}
		return customerTaxType;

	}

	private String getCustomerStateTaxCode(String taxType, CustomerDto customerDto,Boolean isIGST) {
		String customerStateTaxCode = null;
		if (CustomerTaxTypeEnum.REGISTERED.getValue().equalsIgnoreCase(taxType)) {
			customerStateTaxCode = customerDto.getInstiTaxNo().substring(0, 2);
		} else if (CustomerTaxTypeEnum.NONREGISTERED.getValue().equals(taxType)) {
			//String customerLocationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
			//CustomerLocationMappingDao customerLocationMappingDao = customerLocationMappingRepositoryExt.findByCustomerLocationMappingIdCustomerId(customerDto.getCustomerId());
			//customerDto.getCustomerDetails().getData()
			if(BooleanUtils.isTrue(isIGST))
			{
				String stateName = getJsonNodeFromObject(customerDto.getCustomerDetails()).path("data").path("state").textValue();
				StateTaxMappingDao customerLocationStateDetails = null;
				if(stateName != null ) {
					StateDao stateDao = stateRepository.findByDescription(stateName);
					 log.info("stateDao..............................{}",stateDao.toString());
					if(stateDao != null) {
						 customerLocationStateDetails = stateTaxMappingRepository.findByStateStateIdAndIsActiveTrue(stateDao.getStateId());	
						 log.info("customerLocationStateDetails..............................{}",customerLocationStateDetails.toString());
						customerStateTaxCode = customerLocationStateDetails.getStateTaxCode();					
					}						
				}
				if (customerLocationStateDetails == null) {
					throw new ServiceException(EngineConstants.NO_LOCATION_FOUND + " : " +stateName,
							EngineConstants.ERR_LOC_001);
				}			
			}else
			{
				String customerLocationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
	            TaxCodeDto customerLocationStateDetails = locationRepository
	                    .getOwnerTypeAndStateTaxCodeByLocationCode(customerLocationCode, Boolean.TRUE);
	            if (customerLocationStateDetails == null)
	                throw new ServiceException(EngineConstants.NO_LOCATION_FOUND + " : " + customerLocationCode,
	                        EngineConstants.ERR_LOC_001);
	            customerStateTaxCode = customerLocationStateDetails.getStateTaxCode();
			}
		}
		return customerStateTaxCode;
	}

	private String getTaxClassCode(String itemCode) {
		String taxClassCode = null;
		ItemDao itemDao = itemRepository.findOneByItemCode(itemCode);
		if (itemDao != null) {
			taxClassCode = itemDao.getTaxClassCode();
		} else {
			throw new ServiceException(EngineConstants.NO_ITEMDETAILS_FOUND + itemCode, EngineConstants.ERR_PRO_002);
		}
		return taxClassCode;
	}

	private TaxClassDao getTaxClassDetails(String taxClassCode) {
		Optional<TaxClassDao> taxClass = taxClassRepository.findById(taxClassCode);
		if (taxClass.isPresent()) {
			return taxClass.get();
		} else {
			throw new ServiceException("No taxClassCode details found for the requested item code:", "ERR-LOC-030");
		}
	}

	private static TaxCalculationResponseDto getTaxCalculationDetails(String taxType, String applicableTax,
			Object taxDetailsObject, String taxClassCode, Object taxComponentObject, Object isUnionTerritory) {
		TaxCalculationResponseDto taxCalculationResponseDto = new TaxCalculationResponseDto();
		Map<String, TaxDetailDto> taxObject = new HashMap<>();
		Map<String, CessDetailDto> cessTaxObject = new HashMap<>();
		taxCalculationResponseDto.setTaxType(taxType);
		taxCalculationResponseDto.setTaxClass(taxClassCode);
		Map<String, Boolean> cessDetailDtoMap = new HashMap<>();
		List<String> applicableTaxList = new ArrayList<>();
		if (applicableTax.contains(EngineConstants.COMMA)) {  //CGST,SGST
			applicableTaxList = Arrays.asList(applicableTax.split(EngineConstants.COMMA));
		} else if (!EngineConstants.NA.equalsIgnoreCase(applicableTax)) {
			applicableTaxList.add(applicableTax);
		}else if(EngineConstants.NA.equalsIgnoreCase(applicableTax)) {
			applicableTaxList.add(applicableTax);
		}
		if (taxComponentObject != null) {
			cessDetailDtoMap = getCessDetailsObject(taxComponentObject);
		}
		for (String typeOfGST : applicableTaxList) {
			if ((Boolean.TRUE.equals(isUnionTerritory) && typeOfGST.equalsIgnoreCase(EngineConstants.SGST))
					|| (Boolean.FALSE.equals(isUnionTerritory) && typeOfGST.equalsIgnoreCase(EngineConstants.UTGST)))
				continue;
			TaxDetailDto taxDetailDto = new TaxDetailDto();
			taxDetailDto.setTaxCode(typeOfGST);
			BigDecimal taxVal = getTaxPercentage(taxDetailsObject, typeOfGST);
			taxDetailDto.setTaxPercentage(taxVal);

			// if condition for tax % check removed as part of UAT defect 1957
			taxObject.putIfAbsent(typeOfGST, taxDetailDto);

			if (taxComponentObject != null && cessDetailDtoMap.containsKey(typeOfGST)) {
				CessDetailDto cessDetail = new CessDetailDto();
				cessDetail.setCessCode(typeOfGST);
				cessDetail.setCessOnTax(cessDetailDtoMap.get(typeOfGST));
				cessDetail.setCessPercentage(getTaxPercentage(taxDetailsObject, typeOfGST));
				cessTaxObject.putIfAbsent(typeOfGST, cessDetail);
			}
		}
		taxCalculationResponseDto.setData(taxObject);
		taxCalculationResponseDto.setCess(cessTaxObject);
		return taxCalculationResponseDto;

	}

	/**
	 * 
	 * @param taxDetailsObject
	 * @param typeOfGST
	 * @return BigDecimal
	 */
	private static BigDecimal getTaxPercentage(Object taxDetailsObject, String typeOfGST) {
		if(EngineConstants.NA.equalsIgnoreCase(typeOfGST))
				return new BigDecimal(0);
		else
		return new BigDecimal(
				getJsonNodeFromObject(taxDetailsObject).path("data").path(typeOfGST).toString().replace("\"", ""));
	}

	/**
	 * @param taxComponentObject
	 * @return Map<String, CessDetailDto>
	 */
	private static Map<String, Boolean> getCessDetailsObject(Object taxComponentObject) {
		Map<String, Boolean> cessDetailDtoMap = new HashMap<>();
		ObjectMapper mapper = new ObjectMapper();
		try {
			List<CessDetailDto> cessDtoList = mapper.readValue(
					getJsonNodeFromObject(taxComponentObject).path("cess").toString(),
					new TypeReference<List<CessDetailDto>>() {
					});
			cessDtoList.forEach(cessDto -> cessDetailDtoMap.put(cessDto.getCessCode(), cessDto.getCessOnTax()));

		} catch (IOException e) {
			LOGGER.info(e.getMessage());
		}

		return cessDetailDtoMap;

	}

	/**
	 * 
	 * @param taxObject
	 * @return JsonNode
	 */
	private static JsonNode getJsonNodeFromObject(Object taxObject) {
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readValue(objectMapper.writeValueAsString(taxObject), JsonNode.class);
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return jsonNode;
	}
	
	
	public  void isIGSTAllowedCheck(Boolean isIGST, Integer custId)
	{
		if (CommonUtil.isAStoreUser() && isIGST != null && isIGST == true) {
			Optional<EmployeeDao> loggedInUser = employeeRepository.findByEmployeeCodeAndLocationCode(CommonUtil.getUserName(), CommonUtil.getLocationCode());
			JsonData jsonData = MapperUtil.mapObjToClass(loggedInUser.get().getAddress(), JsonData.class);
			String loggedInastateName =JsonUtils.getValueFromJson(jsonData.getData(), "state", String.class);
			
			CustomerDto customerDto = salesService.getCustomer(custId);
			String customerStateName = JsonUtils.getValueFromJson(MapperUtil.mapObjToClass(customerDto.getCustomerDetails(),
					JsonData.class).getData(), "state", String.class);

			if ( loggedInastateName.equalsIgnoreCase(customerStateName)) {
				
				throw new ServiceException(EngineConstants.IS_SAME_STATE + " : " + CommonUtil.getLocationCode(),
						EngineConstants.ERR_LOC_074);
			} 
		}
	}

}
