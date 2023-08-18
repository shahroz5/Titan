/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dao.ExchangeConfigCustomerMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigDetailsDaoExt;
import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigLocationMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;
import com.titan.poss.config.dao.ExchangeConfigProductMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigStoneMappingDaoExt;
import com.titan.poss.config.dao.RangeMasterDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.ExchangeConfigCustomerSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigDetailsSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigExcludeMappingSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigLocationSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigMasterSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigProductSyncDtoExt;
import com.titan.poss.config.dto.ExchangeConfigStoneSyncDtoExt;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.ConfigTypeEnum;
import com.titan.poss.config.dto.constants.RangeTypeEnum;
import com.titan.poss.config.dto.request.AddRangeDto;
import com.titan.poss.config.dto.request.ExchangeConfigDetailsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigProductGroupMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigStoneRequestDto;
import com.titan.poss.config.dto.request.ExchangeCreateConfigDto;
import com.titan.poss.config.dto.request.ExchangeUpdateConfigDto;
import com.titan.poss.config.dto.request.GepConfigItemRequestDto;
import com.titan.poss.config.dto.request.GepThemeRequestDto;
import com.titan.poss.config.dto.request.UpdateExchangeConfigDetailsRequestDto;
import com.titan.poss.config.dto.request.json.TepCutPieceTot;
import com.titan.poss.config.dto.request.json.TepExceptionDetails;
import com.titan.poss.config.dto.request.json.TepGlobalConfigDetails;
import com.titan.poss.config.dto.response.ExchangeConfigDetailsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigItemThemeMappingResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigLocationsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigProductGropusResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigStoneResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateItemResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateThemeResponseDto;
import com.titan.poss.config.dto.response.TepExceptionErrorResponseDto;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.repository.ExchangeConfigCustomerMappingRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigDetailsRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigExcludeMappingRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigLocationMappingRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigMasterRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigProductMappingRepositoryExt;
import com.titan.poss.config.repository.ExchangeConfigStoneMappingRepositoryExt;
import com.titan.poss.config.repository.RangeMasterRepositoryExt;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.ExchangeConfigService;
import com.titan.poss.core.domain.validator.SlabValidator;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.GepConfigDetails;
import com.titan.poss.core.dto.GepOfferDetails;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.RivaahProductGroupGepPurityDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TepGeneralCodesConfig;
import com.titan.poss.core.dto.TepProductGroupConfigDetails;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("exchangeConfigService")
public class ExchangeConfigServiceImpl implements ExchangeConfigService {

	@Autowired
	private ExchangeConfigMasterRepositoryExt exchangeConfigMasterRepository;

	@Autowired
	private ExchangeConfigDetailsRepositoryExt exchangeConfigDetailsRepository;

	@Autowired
	private RangeMasterRepositoryExt rangeMasterRepository;

	@Autowired
	private ExchangeConfigLocationMappingRepositoryExt exchangeConfigLocationMappingRepository;

	@Autowired
	private ExchangeConfigProductMappingRepositoryExt exchangeConfigProductMappingRepository;

	@Autowired
	private ExchangeConfigExcludeMappingRepositoryExt exchangeConfigExcludeMappingRepository;

	@Autowired
	private ExchangeConfigServiceImpl exchangeConfigServiceImp;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	@Autowired
	private ExchangeConfigStoneMappingRepositoryExt exchangeConfigStoneRepository;

	@Autowired
	private ExchangeConfigCustomerMappingRepositoryExt exchangeConfigCustomerMappingRepository;

	private static final String DUPLICATE_CONFIG = "Configuration already active for {tepConfig}";
	private static final String ERR_CONFIG_165 = "ERR-CONFIG-165";

	@Override
	public PagedRestResponse<List<ExchangeConfigResponseDto>> getExchangeConfigList(String description,
			String configType, Boolean isActive, String itemCode, Pageable pageable) {
		Page<ExchangeConfigMasterDaoExt> exchangeConfigMasterDaoPageObj = getPageableGepConfigMaster(description,
				configType, isActive, itemCode, pageable);
		List<ExchangeConfigResponseDto> exchangeConfigDtoList = getGepConfigMasterData(exchangeConfigMasterDaoPageObj);
		return new PagedRestResponse<>(exchangeConfigDtoList, exchangeConfigMasterDaoPageObj);
	}

	private List<ExchangeConfigResponseDto> getGepConfigMasterData(
			Page<ExchangeConfigMasterDaoExt> exchangeConfigMasterDaoPageObj) {
		List<ExchangeConfigResponseDto> exchangeConfigDtoList = new ArrayList<>();
		exchangeConfigMasterDaoPageObj.forEach(data -> {
			ExchangeConfigResponseDto gepConfigDto = (ExchangeConfigResponseDto) MapperUtil.getDtoMapping(data,
					ExchangeConfigResponseDto.class);
			getConfigAndOfferDetails(data, gepConfigDto);
			List<ExchangeConfigCustomerMappingDaoExt> customerMappingDetails = exchangeConfigCustomerMappingRepository
					.findByExchangeConfig(data);
			Set<String> mobileNos = new HashSet<>();
			customerMappingDetails.forEach(record -> mobileNos.add(record.getCustomerMobileNo()));
			gepConfigDto.setCustomerMobileNos(mobileNos);
			exchangeConfigDtoList.add(gepConfigDto);
		});
		return exchangeConfigDtoList;
	}

	private Page<ExchangeConfigMasterDaoExt> getPageableGepConfigMaster(String description, String configType,
			Boolean isActive, String itemCode, Pageable pageable) {
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = new ExchangeConfigMasterDaoExt();
		exchangeConfigMasterDao.setDescription(description);
		exchangeConfigMasterDao.setConfigType(configType);
		exchangeConfigMasterDao.setItemCode(itemCode);
		exchangeConfigMasterDao.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ExchangeConfigMasterDaoExt> exchangeConFigMasterExample = Example.of(exchangeConfigMasterDao, matcher);
		return exchangeConfigMasterRepository.findAllConfigType(description,itemCode, isActive, configType, pageable);
	}

	@Override
	public ExchangeConfigResponseDto getExchangeConfig(String configId, String configType) {
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		ExchangeConfigResponseDto exchangeConfigResponseDto = (ExchangeConfigResponseDto) MapperUtil
				.getDtoMapping(exchangeConfigMasterDao, ExchangeConfigResponseDto.class);
		List<ExchangeConfigCustomerMappingDaoExt> customerMappingDetails = exchangeConfigCustomerMappingRepository
				.findByExchangeConfig(exchangeConfigMasterDao);
		Set<String> mobileNos = new HashSet<>();
		customerMappingDetails.forEach(record -> mobileNos.add(record.getCustomerMobileNo()));
		exchangeConfigResponseDto.setCustomerMobileNos(mobileNos);
		getConfigAndOfferDetails(exchangeConfigMasterDao, exchangeConfigResponseDto);
		return exchangeConfigResponseDto;
	}

	private void getConfigAndOfferDetails(ExchangeConfigMasterDaoExt gepConfigMasterDao,
			ExchangeConfigResponseDto gepConfigResponseDto) {
		Object configDetails = MapperUtil.getJsonFromString(gepConfigMasterDao.getConfigDetails());
		gepConfigResponseDto
				.setConfigDetails(MapperUtil.getObjectMapperInstance().convertValue(configDetails, JsonData.class));
		Object offerDetails = MapperUtil.getJsonFromString(gepConfigMasterDao.getOfferDetails());
		gepConfigResponseDto
				.setOfferDetails(MapperUtil.getObjectMapperInstance().convertValue(offerDetails, JsonData.class));
	}

	@Override
	@Transactional
	public ExchangeConfigResponseDto createExchangeConfig(ExchangeCreateConfigDto exchangeCreateConfigDto,
			String configType) {
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = new ExchangeConfigMasterDaoExt();

		if (ConfigTypeEnum.TEP_CUT_PIECE.toString().equals(configType)
				|| ConfigTypeEnum.TEP_GLOBAL.toString().equals(configType)) {
			Optional<ExchangeConfigMasterDaoExt> exchangeConfigMasterDaoOptioanl = exchangeConfigMasterRepository
					.findByConfigTypeAndIsActiveTrue(configType);
			if (exchangeConfigMasterDaoOptioanl.isPresent()) {
				exchangeConfigMasterDao = exchangeConfigMasterDaoOptioanl.get();
			}
		}
		if (ConfigTypeEnum.TEP_ITEM.toString().equals(configType)) {
			Optional<ExchangeConfigMasterDaoExt> exchangeConfigMasterDaoOptioanl = exchangeConfigMasterRepository
					.findByConfigTypeAndDescriptionAndIsActiveTrue(configType,
							exchangeCreateConfigDto.getDescription());
			if (exchangeConfigMasterDaoOptioanl.isPresent()) {
				throw new ServiceException(DUPLICATE_CONFIG, ERR_CONFIG_165,
						Map.of("tepConfig", exchangeCreateConfigDto.getDescription()));
			}
		}
		MapperUtil.beanMapping(exchangeCreateConfigDto, exchangeConfigMasterDao);
		exchangeConfigMasterDao.setConfigType(configType);
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveGepConfigAndStaging(exchangeConfigMasterDao,
				ConfigServiceOperationCodes.EXCHANGE_CONFIG_ADD, null);
		syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		ExchangeConfigResponseDto exchangeConfigResponse = (ExchangeConfigResponseDto) MapperUtil
				.getDtoMapping(exchangeConfigMasterDao, ExchangeConfigResponseDto.class);
		exchangeConfigResponse.setConfigDetails(MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(exchangeConfigMasterDao.getConfigDetails()), JsonData.class));
		exchangeConfigResponse.setOfferDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(exchangeConfigMasterDao.getOfferDetails()), JsonData.class));
		return exchangeConfigResponse;
	}

	/**
	 * @param exchangeConfigMasterDao
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveGepConfigAndStaging(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			String operationCode, Collection<String> customerMobileNos) {
		exchangeConfigMasterDao = exchangeConfigMasterRepository.save(exchangeConfigMasterDao);
		List<SyncData> gepSyncDatas = new ArrayList<>();
		addCustomerMapping(exchangeConfigMasterDao, customerMobileNos, gepSyncDatas);
		ExchangeConfigMasterSyncDtoExt gepConfigMasterSyncDto = new ExchangeConfigMasterSyncDtoExt(
				exchangeConfigMasterDao);
		gepSyncDatas.add(DataSyncUtil.createSyncData(gepConfigMasterSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return exchangeConfigServiceImp.saveGepToSyncStaging(gepSyncDatas, operationCode, destinations,
				DestinationType.ALL.toString());
	}

	private void addCustomerMapping(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			Collection<String> customerMobileNos, List<SyncData> gepSyncDatas) {
		List<ExchangeConfigCustomerMappingDaoExt> customerMapping = new ArrayList<>();
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(exchangeConfigMasterDao.getConfigType())) {
			if (!CollectionUtils.isEmpty(customerMobileNos)) {
				customerMobileNos.forEach(record -> {
					ExchangeConfigCustomerMappingDaoExt exchangeCustomerMapping = exchangeConfigCustomerMappingRepository
							.findByExchangeConfigAndCustomerMobileNo(exchangeConfigMasterDao, record);
					if (exchangeCustomerMapping == null) {
						exchangeCustomerMapping = new ExchangeConfigCustomerMappingDaoExt();
						exchangeCustomerMapping.setCustomerMobileNo(record);
						exchangeCustomerMapping.setExchangeConfig(exchangeConfigMasterDao);
					}
					customerMapping.add(exchangeCustomerMapping);
				});
			}
			ExchangeConfigCustomerSyncDtoExt cutomerSyncDtoExt = new ExchangeConfigCustomerSyncDtoExt();
			List<ExchangeConfigCustomerMappingDaoExt> savedCustomerMappings = exchangeConfigCustomerMappingRepository
					.saveAll(customerMapping);
			gepSyncDatas.add(DataSyncUtil.createSyncData(cutomerSyncDtoExt.getSyncDtoList(savedCustomerMappings), 1));
		}
	}

	/**
	 * @param gepSyncDatas
	 * @param gepConfigAdd
	 * @param destinations
	 * @param destinationType
	 * @return SyncStagingDto
	 */
	public SyncStagingDto saveGepToSyncStaging(List<SyncData> gepSyncDatas, String operation, List<String> destinations,
			String destinationType) {
		SyncStagingDto gepSyncStagingDto = new SyncStagingDto();
		MessageRequest gepMsgRequest = DataSyncUtil.createMessageRequest(gepSyncDatas, operation, destinations,
				MessageType.GENERAL.toString(), destinationType);
		String gepRequestBody = MapperUtil.getJsonString(gepMsgRequest);
		SyncStaging gepStaggingMsg = new SyncStaging();
		gepStaggingMsg.setMessage(gepRequestBody);
		gepStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		gepStaggingMsg = configSyncStagingRepository.save(gepStaggingMsg);
		gepSyncStagingDto.setMessageRequest(gepMsgRequest);
		gepSyncStagingDto.setId(gepStaggingMsg.getId());
		return gepSyncStagingDto;
	}

	private void updateExchnageConfigConfigDetailsAndOfferDetails(ExchangeUpdateConfigDto exchangeUpdateConfigDto,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao, String configType) {
		if (ConfigTypeEnum.GEP_ITEM.toString().equals(configType)) {
			MapperUtil.getObjectMapping(exchangeUpdateConfigDto, exchangeConfigMasterDao);
			if (!StringUtils.isEmpty(exchangeUpdateConfigDto.getConfigDetails())) {
				exchangeConfigMasterDao
						.setConfigDetails(MapperUtil.getStringFromJson(exchangeUpdateConfigDto.getConfigDetails()));
			}
			if (!StringUtils.isEmpty(exchangeUpdateConfigDto.getOfferDetails())) {
				exchangeConfigMasterDao
						.setOfferDetails(MapperUtil.getStringFromJson(exchangeUpdateConfigDto.getOfferDetails()));
			}
		}
		if ((ConfigTypeEnum.TEP_VALIDATION.toString().equals(configType)
				|| ConfigTypeEnum.TEP_GLOBAL.toString().equals(configType)
				|| ConfigTypeEnum.TEP_GENERAL_CODES.toString().equals(configType)
				|| ConfigTypeEnum.TEP_CUT_PIECE_TOT.toString().equals(configType))
				&& !StringUtils.isEmpty(exchangeUpdateConfigDto.getConfigDetails())) {
			exchangeConfigMasterDao
					.setConfigDetails(MapperUtil.getStringFromJson(exchangeUpdateConfigDto.getConfigDetails()));
		}
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)
				&& !StringUtils.isEmpty(exchangeUpdateConfigDto.getOfferDetails())) {
			exchangeConfigMasterDao
					.setOfferDetails(MapperUtil.getStringFromJson(exchangeUpdateConfigDto.getOfferDetails()));
		}
//		if (ConfigTypeEnum.TEP_GENERAL_CODES.toString().equals(configType)
//				&& !StringUtils.isEmpty(exchangeUpdateConfigDto.getConfigDetails())) {
//			exchangeConfigMasterDao
//					.setConfigDetails(MapperUtil.getStringFromJson(exchangeUpdateConfigDto.getConfigDetails()));
//		}
	}

	@Override
	@Transactional
	public ExchangeConfigResponseDto updateExchangeConfig(String configId, String configType,
			ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		// json validation for
		// GEP_ITEM,TEP_VALIDATION,TEP_GLOBAL,TEP_EXCEPTION,TEP_GENERAL_CODES,TEP_CUT_PIECE_TOT
		// config type
		jsonValidation(configType, exchangeUpdateConfigDto);
		// validate dto for TEP_EXCEPTION config type
		validateDto(exchangeUpdateConfigDto, configType);
		checkTepExceptionValidation(configType, configId, exchangeUpdateConfigDto);
		MapperUtil.getObjectMapping(exchangeUpdateConfigDto, exchangeConfigMasterDao, "isOfferEnabled");
		updateExchnageConfigConfigDetailsAndOfferDetails(exchangeUpdateConfigDto, exchangeConfigMasterDao, configType);
		exchangeConfigMasterDao.setSrcSyncId(exchangeConfigMasterDao.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveGepConfigAndStaging(exchangeConfigMasterDao,
				ConfigServiceOperationCodes.EXCHANGE_CONFIG_UPDATE, exchangeUpdateConfigDto.getCustomerMobileNos());
		syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		ExchangeConfigResponseDto exchangeConfigResponseDto = (ExchangeConfigResponseDto) MapperUtil
				.getDtoMapping(exchangeConfigMasterDao, ExchangeConfigResponseDto.class);
		exchangeConfigResponseDto.setConfigId(configId);
		getConfigAndOfferDetails(exchangeConfigMasterDao, exchangeConfigResponseDto);
		exchangeConfigResponseDto.setCustomerMobileNos(exchangeUpdateConfigDto.getCustomerMobileNos());
		return exchangeConfigResponseDto;
	}

	private void checkTepExceptionValidation(String configType, String configId,
			ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)) {
			List<TepExceptionErrorResponseDto> errorList = exchangeConfigMasterRepository.checkExchangeConfigExist(
					configId, exchangeUpdateConfigDto.getStartDate(), exchangeUpdateConfigDto.getEndDate(),
					exchangeUpdateConfigDto.getItemCode(), exchangeUpdateConfigDto.getCustomerMobileNos());
			if (!errorList.isEmpty()) {
				throw new ServiceException(
						ConfigConstants.ITEM_CODE_LOCATIONS_CODE_CUST_MOBILE_NO_START_DATE_AND_END_DATE_COMB_AVAILABLE,
						ConfigConstants.ERR_CONFIG_069, errorList);
			}
		}
	}

	private void validateDto(ExchangeUpdateConfigDto exchangeUpdateConfigDto, String configType) {
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)) {
			if (exchangeUpdateConfigDto.getItemCode() == null && exchangeUpdateConfigDto.getStartDate() == null
					&& exchangeUpdateConfigDto.getEndDate() == null
					&& CollectionUtils.isEmpty(exchangeUpdateConfigDto.getCustomerMobileNos())) {
				// do nothing
			} else {
				validateTepExceptionDtoFields(exchangeUpdateConfigDto);
			}
		}
	}

	private void validateTepExceptionDtoFields(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (StringUtils.isEmpty(exchangeUpdateConfigDto.getItemCode())) {
			throw new ServiceException(ConfigConstants.ITEM_CODE_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_063);
		}
		if (exchangeUpdateConfigDto.getStartDate() == null) {
			throw new ServiceException(ConfigConstants.START_DATE_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_064);
		}
		if (exchangeUpdateConfigDto.getEndDate() == null) {
			throw new ServiceException(ConfigConstants.END_DATE_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_065);
		}
		if (CollectionUtils.isEmpty(exchangeUpdateConfigDto.getCustomerMobileNos())) {
			throw new ServiceException(ConfigConstants.CUST_MOBILE_NO_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_066);
		}
		if (exchangeUpdateConfigDto.getEndDate().compareTo(exchangeUpdateConfigDto.getStartDate()) < 0) {
			throw new ServiceException(ConfigConstants.END_DATE_SHOULD_BE_SAME_OR_GREATER_THAN_START_DATE,
					ConfigConstants.ERR_CONFIG_070, ConfigConstants.START_DATE + exchangeUpdateConfigDto.getStartDate()
							+ ConfigConstants.END_DATE + exchangeUpdateConfigDto.getEndDate());
		}
	}

	private void jsonValidation(String configType, ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (ConfigTypeEnum.GEP_ITEM.toString().equals(configType)) {
			gepJsonValidate(exchangeUpdateConfigDto);
		}
		if (ConfigTypeEnum.TEP_VALIDATION.toString().equals(configType)) {
			tepValidationJsonValidate(exchangeUpdateConfigDto);
		}
		if (ConfigTypeEnum.TEP_GLOBAL.toString().equals(configType)) {
			tepGlobalJsonValidate(exchangeUpdateConfigDto);
		}
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)) {
			tepExceptionValidate(exchangeUpdateConfigDto);
		}
		if (ConfigTypeEnum.TEP_GENERAL_CODES.toString().equals(configType)) {
			tepGeneralCodesValidate(configType, exchangeUpdateConfigDto);
		}
		if (ConfigTypeEnum.TEP_CUT_PIECE_TOT.toString().equals(configType)) {
			tepCutPieceTotValidate(configType, exchangeUpdateConfigDto);
		}
	}

	private void tepCutPieceTotValidate(String configType, ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (!StringUtils.isEmpty(exchangeUpdateConfigDto.getItemCode())
				&& StringUtils.isEmpty(exchangeUpdateConfigDto.getKarat())) {
			throw new ServiceException("Please enter karat", "ERR-CONFIG-117");
		} else if (StringUtils.isEmpty(exchangeUpdateConfigDto.getItemCode())
				&& !StringUtils.isEmpty(exchangeUpdateConfigDto.getKarat())) {
			throw new ServiceException(ConfigConstants.ITEM_CODE_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_063);
		} else {
			// do nothing
		}
		validateItemCodeAndKaratCombination(exchangeUpdateConfigDto);
		if (exchangeUpdateConfigDto.getConfigDetails() != null) {
			if (!"TEP_CUT_PIECE_TOT_CONFIG".equals(exchangeUpdateConfigDto.getConfigDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getConfigDetails().getType());
			}
			TepCutPieceTot tepCutPieceTot = new TepCutPieceTot();
			tepCutPieceTot.validate(exchangeUpdateConfigDto.getConfigDetails().getData());
		}
		ExchangeConfigMasterDaoExt configMaster = exchangeConfigMasterRepository.findByItemCodeAndKaratAndConfigType(
				exchangeUpdateConfigDto.getItemCode(), exchangeUpdateConfigDto.getKarat(), configType);
		if (configMaster != null) {
			throw new ServiceException("Karat and item code combination is already available", "ERR-CONFIG-118",
					"karat : " + exchangeUpdateConfigDto.getKarat() + " & item code : "
							+ exchangeUpdateConfigDto.getItemCode());
		}
	}

	/**
	 * @param exchangeUpdateConfigDto
	 */
	private void validateItemCodeAndKaratCombination(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (!StringUtils.isEmpty(exchangeUpdateConfigDto.getKarat())
				&& !StringUtils.isEmpty(exchangeUpdateConfigDto.getItemCode())) {
			if (new BigDecimal(14).compareTo(exchangeUpdateConfigDto.getKarat()) == 0
					&& "11GOHYM007".equals(exchangeUpdateConfigDto.getItemCode())) {
				// do nothing
			} else if (new BigDecimal(18).compareTo(exchangeUpdateConfigDto.getKarat()) == 0
					&& "11GOLYM009".equals(exchangeUpdateConfigDto.getItemCode())) {
				// do nothing
			} else if (new BigDecimal(22).compareTo(exchangeUpdateConfigDto.getKarat()) == 0
					&& "11GOPYM008".equals(exchangeUpdateConfigDto.getItemCode())) {
				// do nothing
			} else {
				throw new ServiceException("Invalid karat and item code combination", "",
						"karat : " + exchangeUpdateConfigDto.getKarat() + " & item code : "
								+ exchangeUpdateConfigDto.getItemCode());
			}
		}
	}

	private void tepGeneralCodesValidate(String configType, ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (exchangeUpdateConfigDto.getConfigDetails() != null) {
			if (!"TEP_GENERAL_CODES_CONFIG".equals(exchangeUpdateConfigDto.getConfigDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getConfigDetails().getType());
			}
			if (StringUtils.isEmpty(exchangeUpdateConfigDto.getItemCode())) {
				throw new ServiceException(ConfigConstants.ITEM_CODE_CANNOT_BE_NULL, ConfigConstants.ERR_CONFIG_063);
			}
			TepGeneralCodesConfig tepGeneralCodes = new TepGeneralCodesConfig();
			tepGeneralCodes.validate(exchangeUpdateConfigDto.getConfigDetails().getData());
			ExchangeConfigMasterDaoExt exchangeConfigMaster = exchangeConfigMasterRepository
					.findByItemCodeAndConfigType(exchangeUpdateConfigDto.getItemCode(), configType);
			if (exchangeConfigMaster != null) {
				throw new ServiceException("Item code alreday exists", "ERR-CONFIG-122",
						"item code : " + exchangeUpdateConfigDto.getItemCode());
			}
		}
	}

	private void tepExceptionValidate(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (exchangeUpdateConfigDto.getOfferDetails() != null) {
			if (!"TEP_EXCEPTION_CONFIG".equals(exchangeUpdateConfigDto.getOfferDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getOfferDetails().getType());
			}
			TepExceptionDetails tepException = new TepExceptionDetails();
			tepException.validate(exchangeUpdateConfigDto.getOfferDetails().getData());
			tepException = MapperUtil.getObjectMapperInstance()
					.convertValue(exchangeUpdateConfigDto.getOfferDetails().getData(), TepExceptionDetails.class);
			if (tepException.getDeductionPercent().compareTo(BigDecimal.ZERO) > 0
					&& tepException.getFlatTepExchangeValue().compareTo(BigDecimal.ZERO) > 0) {
				throw new ServiceException(ConfigConstants.DEDUCTION_PERCENT_AND_FLAT_TEP_VALUE_ERROR,
						ConfigConstants.ERR_CONFIG_085, "deduction percent : " + tepException.getDeductionPercent()
								+ " & flat tep exchange value : " + tepException.getFlatTepExchangeValue());
			}
			Optional<ExchangeConfigMasterDaoExt> configMaster = exchangeConfigMasterRepository
					.findByConfigTypeAndIsActiveTrue(ConfigTypeEnum.TEP_GLOBAL.toString());
			if (!configMaster.isPresent()) {
				throw new ServiceException(ConfigConstants.TEP_GLOBAL_NOT_AVAILABLE, ConfigConstants.ERR_CONFIG_061);
			}
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(configMaster.get().getConfigDetails()), JsonData.class);
			TepGlobalConfigDetails tepGlobal = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
					TepGlobalConfigDetails.class);
			// if flat TEP exchange value is greater than max flat TEP exchange value then
			// throw exception
			if (tepException.getFlatTepExchangeValue().compareTo(tepGlobal.getMaxFlatTepExchangeValue()) > 0) {
				throw new ServiceException(
						ConfigConstants.FLAT_TEP_EXCHANGE_VALUE_SHOULD_NOT_BE_GREATER_THAN_MAX_FLAT_TEP_EXCHANGE,
						ConfigConstants.ERR_CONFIG_062,
						"Flat TEP exchange value : " + tepException.getFlatTepExchangeValue()
								+ " & max flat TEP exchange value : " + tepGlobal.getMaxFlatTepExchangeValue());
			}
		}
	}

	private void tepGlobalJsonValidate(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (exchangeUpdateConfigDto.getConfigDetails() != null) {
			if (!"TEP_GLOBAL_CONFIG".equals(exchangeUpdateConfigDto.getConfigDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getConfigDetails().getType());
			}
			TepGlobalConfigDetails tepGlobalConfig = new TepGlobalConfigDetails();
			tepGlobalConfig.validate(exchangeUpdateConfigDto.getConfigDetails().getData());
		}
	}

	private void tepValidationJsonValidate(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (exchangeUpdateConfigDto.getConfigDetails() != null) {
			if (!"TEP_VALIDATION_CONFIG".equals(exchangeUpdateConfigDto.getConfigDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getConfigDetails().getType());
			}
			TepValidationConfigDetails tepValidation = new TepValidationConfigDetails();
			tepValidation.validate(exchangeUpdateConfigDto.getConfigDetails().getData());
		}
	}

	private void gepJsonValidate(ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		if (exchangeUpdateConfigDto.getConfigDetails() != null) {
			if (!"GEP_CONFIG".equals(exchangeUpdateConfigDto.getConfigDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getConfigDetails().getType());
			}
			GepConfigDetails configDetails = new GepConfigDetails();
			configDetails.validate(exchangeUpdateConfigDto.getConfigDetails().getData());
		}
		if (exchangeUpdateConfigDto.getIsOfferEnabled() != null && exchangeUpdateConfigDto.getIsOfferEnabled()) {
			if (!"GEP_OFFER".equals(exchangeUpdateConfigDto.getOfferDetails().getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + exchangeUpdateConfigDto.getOfferDetails().getType());
			}
			GepOfferDetails offerDetails = new GepOfferDetails();
			offerDetails.validate(exchangeUpdateConfigDto.getOfferDetails().getData());
		}
	}

	private ExchangeConfigMasterDaoExt getExchangeConfigMasterDao(String configId, String configType) {
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = exchangeConfigMasterRepository
				.findByConfigIdAndConfigType(configId, configType);
		if (exchangeConfigMasterDao == null) {
			throw new ServiceException(ConfigConstants.NO_EXCHANGE_CONFIG_FOUND, ConfigConstants.ERR_CONFIG_009,
					"config id : " + configId + " & config type : " + configType);
		}
		return exchangeConfigMasterDao;
	}

	private ExchangeConfigDetailsDaoExt getGepConfigDetailsDao(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			String id) {
		return exchangeConfigDetailsRepository.findByExchangeConfigAndId(exchangeConfigMasterDao, id)
				.orElseThrow(() -> new ServiceException(ConfigConstants.NO_EXCHANGE_CONFIG_DETAILS_FOUND,
						ConfigConstants.ERR_CONFIG_010, "id : " + id));
	}

	@Override
	public PagedRestResponse<List<ExchangeConfigDetailsResponseDto>> getExchangeConfigDetails(String configId,
			String configType, Pageable pageable) {
		validationForGepDetailsConfig(configType);
		List<ExchangeConfigDetailsResponseDto> exchangeConfigDetailsResponseDtoList = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		Page<ExchangeConfigDetailsDaoExt> gepConfigDetailsPage = exchangeConfigDetailsRepository
				.findByExchangeConfig(exchangeConfigMasterDao, pageable);
		gepConfigDetailsPage.forEach(record -> {
			ExchangeConfigDetailsResponseDto exchangeConfigDetailsResponseDto = (ExchangeConfigDetailsResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigDetailsResponseDto.class);
			exchangeConfigDetailsResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			exchangeConfigDetailsResponseDto.setRangeId(record.getRange().getId());
			exchangeConfigDetailsResponseDtoList.add(exchangeConfigDetailsResponseDto);
		});
		return new PagedRestResponse<>(exchangeConfigDetailsResponseDtoList, gepConfigDetailsPage);
	}

	private void validationForGepDetailsConfig(String configType) {
		if (!ConfigTypeEnum.GEP_ITEM.toString().equals(configType)) {
			throw new ServiceException(ConfigConstants.INVALID_CHOICE, ConfigConstants.ERR_CONFIG_045,
					"Config type :" + configType);
		}
	}

	@Override
	public ListResponse<ExchangeConfigDetailsResponseDto> updateExchangeConfigDetails(String configId,
			String configType, ExchangeConfigDetailsRequestDto exchangeConfigDetailsRequestDto) {
		validationForGepDetailsConfig(configType);
		List<ExchangeConfigDetailsDaoExt> exchangeConfigDetailsList = new ArrayList<>();
		List<ExchangeConfigDetailsResponseDto> exchangeConfigDetailsDtoList = new ArrayList<>();
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveExchangeConfigDetailsAndStaging(configId,
				configType, exchangeConfigDetailsRequestDto, exchangeConfigDetailsList,
				ConfigServiceOperationCodes.EXCHANGE_CONFIG_DETAILS_ADD);
		if (syncStagingDto != null)
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		if (!CollectionUtils.isEmpty(exchangeConfigDetailsList)) {
			exchangeConfigDetailsList.forEach(record -> {
				ExchangeConfigDetailsResponseDto exchangeConfigDetailsResponseDto = (ExchangeConfigDetailsResponseDto) MapperUtil
						.getDtoMapping(record, ExchangeConfigDetailsResponseDto.class);
				exchangeConfigDetailsResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
				exchangeConfigDetailsResponseDto.setRangeId(record.getRange().getId());
				exchangeConfigDetailsDtoList.add(exchangeConfigDetailsResponseDto);
			});
		}
		return new ListResponse<>(exchangeConfigDetailsDtoList);
	}

	/**
	 * @param configId
	 * @param exchangeConfigDetailsRequestDto
	 * @param exchangeConfigDetailsList
	 * @param operationCode
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveExchangeConfigDetailsAndStaging(String configId, String configType,
			ExchangeConfigDetailsRequestDto exchangeConfigDetailsRequestDto,
			List<ExchangeConfigDetailsDaoExt> exchangeConfigDetailsList, String operationCode) {
		List<SyncData> gepSyncDatas = new ArrayList<>();
		ExchangeConfigDetailsSyncDtoExt syncDto = new ExchangeConfigDetailsSyncDtoExt();
		Map<String, List<AddRangeDto>> slabDetailsMap = new HashMap<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		List<ExchangeConfigDetailsDaoExt> exchangeConfigDetails = new ArrayList<>();
		addGepDetails(exchangeConfigDetailsRequestDto, exchangeConfigMasterDao, exchangeConfigDetails, slabDetailsMap);
		updateGepDetails(exchangeConfigDetailsRequestDto, exchangeConfigMasterDao, exchangeConfigDetails,
				slabDetailsMap);
		validateExchangeConfigSlab(slabDetailsMap);
		if (!exchangeConfigDetails.isEmpty()) {
			exchangeConfigDetailsRepository.saveAll(exchangeConfigDetails);
			for (ExchangeConfigDetailsDaoExt exchangeConfig : exchangeConfigDetails) {
				exchangeConfigDetailsList.add(exchangeConfig);
			}
			gepSyncDatas.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoExtList(exchangeConfigDetails), 1));
		}
		removeGepDetails(exchangeConfigDetailsRequestDto, gepSyncDatas, syncDto, exchangeConfigMasterDao);
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = null;
		if (!gepSyncDatas.isEmpty())
			syncStagingDto = exchangeConfigServiceImp.saveGepToSyncStaging(gepSyncDatas, operationCode, destinations,
					DestinationType.ALL.toString());
		return syncStagingDto;
	}

	private void validateExchangeConfigSlab(Map<String, List<AddRangeDto>> slabDetailsMap) {
		slabDetailsMap.forEach((key, value) -> SlabValidator.createAndValidateSlabObject(value, AddRangeDto.class,
				ConfigConstants.FROM_RANGE, ConfigConstants.TO_RANGE, ConfigConstants.ROW_ID));
	}

	private void removeGepDetails(ExchangeConfigDetailsRequestDto gepConfigDetailsRequestDto,
			List<SyncData> gepSyncDatas, ExchangeConfigDetailsSyncDtoExt syncDto,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao) {
		if (!CollectionUtils.isEmpty(gepConfigDetailsRequestDto.getRemoveConfigDetails())) {
			List<ExchangeConfigDetailsDaoExt> delExchangeConfigDetailsList = exchangeConfigDetailsRepository
					.findByExchangeConfigAndIdIn(exchangeConfigMasterDao,
							gepConfigDetailsRequestDto.getRemoveConfigDetails());
			exchangeConfigDetailsRepository.deleteAll(delExchangeConfigDetailsList);
			delExchangeConfigDetailsList.forEach(gepConfig -> gepConfig.setSyncTime(new Date().getTime()));
			gepSyncDatas.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoExtList(delExchangeConfigDetailsList), 0));
		}
	}

	private void updateGepDetails(ExchangeConfigDetailsRequestDto exchangeConfigDetailsRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao, List<ExchangeConfigDetailsDaoExt> exchangeConfigDetails,
			Map<String, List<AddRangeDto>> slabDetailsMap) {
		if (!CollectionUtils.isEmpty(exchangeConfigDetailsRequestDto.getUpdateConfigDetails())) {
			for (UpdateExchangeConfigDetailsRequestDto updateExchangeConfigDetails : exchangeConfigDetailsRequestDto
					.getUpdateConfigDetails()) {
				ExchangeConfigDetailsDaoExt exchangeConfigDetailsDao = getGepConfigDetailsDao(exchangeConfigMasterDao,
						updateExchangeConfigDetails.getId());
				MapperUtil.getObjectMapping(updateExchangeConfigDetails, exchangeConfigDetailsDao);
				RangeMasterDaoExt rangeMasterDao = validateGepDetails(exchangeConfigDetailsDao.getStartDate(),
						exchangeConfigDetailsDao.getEndDate(), updateExchangeConfigDetails.getRangeId(),
						updateExchangeConfigDetails.getRowId(), exchangeConfigDetailsDao.getMetalType(),
						exchangeConfigDetailsDao.getItemType(), slabDetailsMap, exchangeConfigDetailsDao,
						exchangeConfigDetailsDao.getSchemePercent());
				List<ExchangeConfigDetailsDaoExt> gepConfigDetailsUpdateList = new ArrayList<>();
				if (rangeMasterDao != null) {
					exchangeConfigDetailsDao.setRange(rangeMasterDao);
				}
				exchangeConfigDetailsDao.setSyncTime(new Date().getTime());
				gepConfigDetailsUpdateList.add(exchangeConfigDetailsDao);
				exchangeConfigDetails.add(exchangeConfigDetailsDao);
			}
		}
	}

	private void addGepDetails(ExchangeConfigDetailsRequestDto exchangeConfigDetailsRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao, List<ExchangeConfigDetailsDaoExt> exchangeConfigDetails,
			Map<String, List<AddRangeDto>> slabDetailsMap) {
		if (!CollectionUtils.isEmpty(exchangeConfigDetailsRequestDto.getAddConfigDetails())) {
			exchangeConfigDetailsRequestDto.getAddConfigDetails().forEach(record -> {
				RangeMasterDaoExt rangeMasterDao = validateGepDetails(record.getStartDate(), record.getEndDate(),
						record.getRangeId(), record.getRowId(), record.getMetalType(), record.getItemType(),
						slabDetailsMap, null, record.getSchemePercent());
				ExchangeConfigDetailsDaoExt exchangeConfigDetailsDao = (ExchangeConfigDetailsDaoExt) MapperUtil
						.getDtoMapping(record, ExchangeConfigDetailsDaoExt.class);
				exchangeConfigDetailsDao.setExchangeConfig(exchangeConfigMasterDao);
				exchangeConfigDetailsDao.setRange(rangeMasterDao);
				exchangeConfigDetailsDao.setSyncTime(new Date().getTime());
				exchangeConfigDetails.add(exchangeConfigDetailsDao);
			});
		}
	}

	private RangeMasterDaoExt validateGepDetails(Date startDate, Date endDate, String rangeId, Integer rowId,
			String metalType, String itemType, Map<String, List<AddRangeDto>> slabDetailsMap,
			ExchangeConfigDetailsDaoExt gepConfigDetailsDao, BigDecimal schemePercent) {
		RangeMasterDaoExt rangeMasterDao = null;
		if (!StringUtils.isEmpty(rangeId) && rowId != null) {
			rangeMasterDao = getRangeMasterDao(rangeId);
			validateRangeTypeAndMetalType(metalType, rangeMasterDao);
			AddRangeDto addRange = (AddRangeDto) MapperUtil.getDtoMapping(rangeMasterDao, AddRangeDto.class);
			addRange.setRowId(rowId);
			addSlabDetails(metalType, itemType, slabDetailsMap, addRange);
		} else if (StringUtils.isEmpty(rangeId) && rowId == null) {
			validateRangeTypeAndMetalType(gepConfigDetailsDao.getMetalType(), gepConfigDetailsDao.getRange());
		} else if (!StringUtils.isEmpty(rangeId) && rowId == null) {
			throw new ServiceException(ConfigConstants.COMBINATION_OF_RANGE_ID_AND_ROW_ID_SHOULD_NOT_BE_NULL,
					ConfigConstants.ERR_CONFIG_021, "Combination : rangeId:- " + rangeId + " & rowId :- " + rowId);
		}
		validateSchemeDate(startDate, endDate, schemePercent);
		return rangeMasterDao;
	}

	private void addSlabDetails(String metalType, String itemType, Map<String, List<AddRangeDto>> slabDetailsMap,
			AddRangeDto addRange) {
		List<AddRangeDto> slabDetailsList = slabDetailsMap.get(metalType + itemType);
		if (slabDetailsList == null) {
			slabDetailsList = new ArrayList<>();
			slabDetailsMap.put(metalType + itemType, slabDetailsList);
		}
		slabDetailsList.add(addRange);
	}

	private void validateSchemeDate(Date startDate, Date endDate, BigDecimal schemePercent) {
		// if scheme end date is lesser than scheme start date then throw exception
		// if start date & end date is not null and scheme percent is null then throw
		// exception
		if (startDate != null && endDate == null) {
			throw new ServiceException(ConfigConstants.ENTER_END_DATE, ConfigConstants.ERR_CONFIG_103,
					ConfigConstants.START_DATE + startDate + ConfigConstants.END_DATE + endDate);
		} else if (startDate == null && endDate != null) {
			throw new ServiceException(ConfigConstants.ENTER_START_DATE, ConfigConstants.ERR_CONFIG_102,
					ConfigConstants.START_DATE + startDate + ConfigConstants.END_DATE + endDate);
		} else if (startDate != null) {
			if (endDate.compareTo(startDate) < 0) {
				throw new ServiceException(ConfigConstants.END_DATE_MUST_BE_AFTER_START_DATE,
						ConfigConstants.ERR_CONFIG_101,
						ConfigConstants.START_DATE + startDate + ConfigConstants.END_DATE + endDate);
			}
			if (schemePercent == null) {
				throw new ServiceException(ConfigConstants.ENTER_SCHEME_PERCENT, ConfigConstants.ERR_CONFIG_104);
			}

		}
	}

	private void validateRangeTypeAndMetalType(String metalType, RangeMasterDaoExt rangeMasterDao) {
		if (MetalTypeCodeEnum.J.getCode().equals(metalType)
				&& RangeTypeEnum.GEP_GOLD_PURITY.toString().equals(rangeMasterDao.getRangeType())) {
			// do nothing
		} else if (MetalTypeCodeEnum.P.getCode().equals(metalType)
				&& RangeTypeEnum.GEP_SILVER_PURITY.toString().equals(rangeMasterDao.getRangeType())) {
			// do nothing
		} else if (MetalTypeCodeEnum.L.getCode().equals(metalType)
				&& RangeTypeEnum.GEP_PLATINUM_PURITY.toString().equals(rangeMasterDao.getRangeType())) {
			// do nothing
		} else {
			throw new ServiceException(ConfigConstants.CHOOSE_PROPER_METAL_TYPE, ConfigConstants.ERR_CONFIG_022,
					"Metal type : " + metalType + " , range type : " + rangeMasterDao.getRangeType() + " , range id : "
							+ rangeMasterDao.getId());
		}
	}

	private RangeMasterDaoExt getRangeMasterDao(String rangeId) {
		RangeMasterDaoExt rangeMaster = rangeMasterRepository.findByIdAndIsActiveTrue(rangeId);
		if (rangeMaster == null) {
			throw new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_011,
					ConfigConstants.RANGE_ID + rangeId + " & isActive : false");
		}
		return rangeMaster;
	}

	@Override
	public ExchangeConfigLocationsRequestDto updateLocationsMapping(String configId, String configType,
			ExchangeConfigLocationsRequestDto exchangeConfigLocationsRequestDto) {
		List<ExchangeConfigLocationMappingDaoExt> exchangeConfigLocationsDaoList = new ArrayList<>();
		ExchangeConfigMasterDaoExt gepConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		Map<String, SyncStagingDto> locationSyncDataMap = exchangeConfigServiceImp.saveExchangeConfigLocationAndStaging(
				gepConfigMasterDao, exchangeConfigLocationsRequestDto, exchangeConfigLocationsDaoList,
				ConfigServiceOperationCodes.EXCHANGE_CONFIG_LOCATION_ADD, configType);
		if (!locationSyncDataMap.isEmpty()) {
			for (Map.Entry<String, SyncStagingDto> entry : locationSyncDataMap.entrySet()) {
				List<String> destinations = new ArrayList<>();
				destinations.add(entry.getKey());
				syncDataService.publishConfigMessagesToQueue(entry.getValue());
			}
		}
		return exchangeConfigLocationsRequestDto;
	}

	/**
	 * @param gepConfigMasterDao
	 * @param exchangeConfigLocationsRequestDto
	 * @param exchangeConfigLocationsDaoList
	 * @param operationCode
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveExchangeConfigLocationAndStaging(
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			ExchangeConfigLocationsRequestDto exchangeConfigLocationsRequestDto,
			List<ExchangeConfigLocationMappingDaoExt> exchangeConfigLocationsDaoList, String operationCode,
			String configType) {
		List<ExchangeConfigLocationMappingDaoExt> deletedLocations = new ArrayList<>();
		List<ExchangeConfigLocationMappingDaoExt> savedLocations;
		removeLocations(exchangeConfigLocationsRequestDto, deletedLocations, configType);
		updateOverwriteLocations(exchangeConfigMasterDao, exchangeConfigLocationsRequestDto,
				exchangeConfigLocationsDaoList, deletedLocations, configType);
		addLocations(exchangeConfigMasterDao, exchangeConfigLocationsRequestDto, exchangeConfigLocationsDaoList,
				configType);
		savedLocations = exchangeConfigLocationMappingRepository.saveAll(exchangeConfigLocationsDaoList);
		return exchangeConfigSync(deletedLocations, savedLocations);
	}

	private Map<String, SyncStagingDto> exchangeConfigSync(List<ExchangeConfigLocationMappingDaoExt> deletedLocations,
			List<ExchangeConfigLocationMappingDaoExt> savedLocations) {
		Map<String, List<SyncData>> gepSyncDataMap = new HashMap<>();
		if (!deletedLocations.isEmpty()) {
			getdeleteListSyncData(deletedLocations, gepSyncDataMap);
		}
		if (!savedLocations.isEmpty()) {
			getAddListSyncData(savedLocations, gepSyncDataMap);
		}
		Map<String, SyncStagingDto> gepSyncStagingDataMap = new HashMap<>();
		for (Map.Entry<String, List<SyncData>> entry : gepSyncDataMap.entrySet()) {
			List<String> destinations = new ArrayList<>();
			destinations.add(entry.getKey());
			gepSyncStagingDataMap.put(entry.getKey(),
					exchangeConfigServiceImp.saveGepToSyncStaging(entry.getValue(),
							ConfigServiceOperationCodes.EXCHANGE_CONFIG_LOCATION_ADD, destinations,
							DestinationType.SELECTIVE.toString()));
		}
		return gepSyncStagingDataMap;
	}

	private void addLocations(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			ExchangeConfigLocationsRequestDto gepConfigLocationsRequestDto,
			List<ExchangeConfigLocationMappingDaoExt> gepConfigLocationsDaoList, String configType) {
		if (!CollectionUtils.isEmpty(gepConfigLocationsRequestDto.getAddLocations())) {
			locationValidation(gepConfigLocationsRequestDto, configType, exchangeConfigMasterDao);
			gepConfigLocationsRequestDto.getAddLocations()
					.forEach(record -> addGepLocationsToDb(gepConfigLocationsDaoList, exchangeConfigMasterDao, record,
							configType));
		}
	}

	private void locationValidation(ExchangeConfigLocationsRequestDto gepConfigLocationsRequestDto, String configType,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao) {
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)) {
			List<TepExceptionErrorResponseDto> errorList = exchangeConfigLocationMappingRepository
					.checkLocationMappingExist(exchangeConfigMasterDao.getStartDate(),
							exchangeConfigMasterDao.getEndDate(), gepConfigLocationsRequestDto.getAddLocations(),
							exchangeConfigMasterDao.getItemCode(), exchangeConfigMasterDao.getConfigId());
			if (!errorList.isEmpty()) {
				throw new ServiceException(
						ConfigConstants.ITEM_CODE_LOCATIONS_CODE_CUST_MOBILE_NO_START_DATE_AND_END_DATE_COMB_AVAILABLE,
						ConfigConstants.ERR_CONFIG_069, errorList);
			}
		} else {
			List<ExchangeConfigLocationMappingDaoExt> locationsList = exchangeConfigLocationMappingRepository
					.findByLocationCodeInAndConfigType(gepConfigLocationsRequestDto.getAddLocations(), configType);
			// get all locations code
			List<String> exchangeConfigMappingLocationsList = locationsList.stream()
					.map(ExchangeConfigLocationMappingDaoExt::getLocationCode).collect(Collectors.toList());
			log.info("exchange config mapping locations details {}", exchangeConfigMappingLocationsList);
			// filter mapped locations list between exchange config location table & add
			// locations object
			Set<String> matchedLocations = exchangeConfigMappingLocationsList.stream()
					.filter(e -> gepConfigLocationsRequestDto.getAddLocations().contains(e))
					.collect(Collectors.toSet());
			log.info("match locations {}", matchedLocations);
			// if matched locations list is not empty then throw exception
			if (!CollectionUtils.isEmpty(matchedLocations)) {
				throw new ServiceException(ConfigConstants.LOCATION_ARE_MAPPED, ConfigConstants.ERR_CONFIG_067,
						"Location codes : " + matchedLocations);
			}
		}
	}

	private void updateOverwriteLocations(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			ExchangeConfigLocationsRequestDto exchangeConfigLocationsRequestDto,
			List<ExchangeConfigLocationMappingDaoExt> gepConfigLocationsDaoList,
			List<ExchangeConfigLocationMappingDaoExt> deletedLocations, String configType) {
		// overwrite locations are not valid for TEP_EXCEPTION config type
		if (ConfigTypeEnum.TEP_EXCEPTION.toString().equals(configType)
				&& !CollectionUtils.isEmpty(exchangeConfigLocationsRequestDto.getOverwriteLocations())) {
			throw new ServiceException(ConfigConstants.OVERWRITE_LOCATIONS_NOT_AVAILABLE_TEP_EXCEPTION,
					ConfigConstants.ERR_CONFIG_068);
		}
		if (!CollectionUtils.isEmpty(exchangeConfigLocationsRequestDto.getOverwriteLocations())) {
			exchangeConfigLocationsRequestDto.getOverwriteLocations().forEach(record -> {
				List<ExchangeConfigLocationMappingDaoExt> locationList = exchangeConfigLocationMappingRepository
						.findByLocationCodeInAndConfigType(exchangeConfigLocationsRequestDto.getOverwriteLocations(),
								configType);
				exchangeConfigLocationMappingRepository.deleteAll(locationList);
				exchangeConfigLocationMappingRepository.flush();
				addGepLocationsToDb(gepConfigLocationsDaoList, exchangeConfigMasterDao, record, configType);
				locationList.forEach(location -> {
					location.setSyncTime(new Date().getTime());
					deletedLocations.add(location);
				});
			});
		}
	}

	private void removeLocations(ExchangeConfigLocationsRequestDto exchangeConfigLocationsRequestDto,
			List<ExchangeConfigLocationMappingDaoExt> deletedLocations, String configType) {
		if (!CollectionUtils.isEmpty(exchangeConfigLocationsRequestDto.getRemoveLocations())) {
			List<ExchangeConfigLocationMappingDaoExt> removeLocations = exchangeConfigLocationMappingRepository
					.findByLocationCodeInAndConfigType(exchangeConfigLocationsRequestDto.getRemoveLocations(),
							configType);
			exchangeConfigLocationMappingRepository.deleteAll(removeLocations);
			removeLocations.forEach(removeLocation -> {
				removeLocation.setSyncTime(new Date().getTime());
				deletedLocations.add(removeLocation);
			});
		}
	}

	/**
	 * @param savedLocations
	 * @param gepSyncDataMap
	 */
	private void getAddListSyncData(List<ExchangeConfigLocationMappingDaoExt> savedLocations,
			Map<String, List<SyncData>> gepSyncDataMap) {
		savedLocations.forEach(gepLocAdd -> {
			if (gepSyncDataMap.containsKey(gepLocAdd.getLocationCode())) {
				ExchangeConfigLocationSyncDtoExt syncDtoExt = new ExchangeConfigLocationSyncDtoExt(gepLocAdd);
				gepSyncDataMap.get(gepLocAdd.getLocationCode()).add(DataSyncUtil.createSyncData(syncDtoExt, 1));
			} else {
				List<SyncData> syncDatas = new ArrayList<>();
				ExchangeConfigLocationSyncDtoExt syncDtoExt = new ExchangeConfigLocationSyncDtoExt(gepLocAdd);
				syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 1));
				gepSyncDataMap.put(gepLocAdd.getLocationCode(), syncDatas);
			}
		});

	}

	/**
	 * @param deletedLocations
	 * @param gepSyncDataMap
	 */
	private void getdeleteListSyncData(List<ExchangeConfigLocationMappingDaoExt> deletedLocations,
			Map<String, List<SyncData>> gepSyncDataMap) {
		deletedLocations.forEach(gepLoc -> {
			if (gepSyncDataMap.containsKey(gepLoc.getLocationCode())) {
				ExchangeConfigLocationSyncDtoExt syncDtoExt = new ExchangeConfigLocationSyncDtoExt(gepLoc);
				gepSyncDataMap.get(gepLoc.getLocationCode()).add(DataSyncUtil.createSyncData(syncDtoExt, 0));
			} else {
				List<SyncData> syncDatas = new ArrayList<>();
				ExchangeConfigLocationSyncDtoExt syncDtoExt = new ExchangeConfigLocationSyncDtoExt(gepLoc);
				syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 0));
				gepSyncDataMap.put(gepLoc.getLocationCode(), syncDatas);
			}
		});
	}

	private void addGepLocationsToDb(List<ExchangeConfigLocationMappingDaoExt> exchangeConfigMappingDaoList,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao, String record, String configType) {
		ExchangeConfigLocationMappingDaoExt exchangeConfigLocationMappingDao = new ExchangeConfigLocationMappingDaoExt();
		exchangeConfigLocationMappingDao.setLocationCode(record);
		exchangeConfigLocationMappingDao.setExchangeConfig(exchangeConfigMasterDao);
		exchangeConfigLocationMappingDao.setConfigType(configType);
		exchangeConfigLocationMappingDao.setSyncTime(new Date().getTime());
		exchangeConfigMappingDaoList.add(exchangeConfigLocationMappingDao);
	}

	@Override
	public ListResponse<ExchangeConfigProductGropusResponseDto> updateProductMapping(String configId, String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto) {
		List<ExchangeConfigProductGropusResponseDto> exchangeConfigProductsListDto = new ArrayList<>();
		List<ExchangeConfigProductMappingDaoExt> gepConfigProductsList = new ArrayList<>();
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveExchangeProductAndStaging(configId, configType,
				exchangeConfigProductGroupMappingRequestDto, gepConfigProductsList, exchangeConfigProductsListDto);
		if (syncStagingDto != null) {
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		}
		return getProductGroupsListDto(exchangeConfigProductsListDto, gepConfigProductsList);
	}

	/**
	 * @param configId
	 * @param exchangeConfigProductGroupMappingRequestDto
	 * @param exchangeConfigProductsList
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveExchangeProductAndStaging(String configId, String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			List<ExchangeConfigProductGropusResponseDto> gepConfigProductsListDto) {
		SyncStagingDto syncStagingDto = null;
		ExchangeConfigMasterDaoExt exchangeConfig = getExchangeConfigMasterDao(configId, configType);
		List<SyncData> syncDatas = new ArrayList<>();
		ExchangeConfigProductSyncDtoExt syncDtoExt = new ExchangeConfigProductSyncDtoExt();
		// if config type is TEP_ITEM
		tepProductGroup(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
				exchangeConfig, syncDatas, syncDtoExt);
		// if config type is GEP_ITEM
		gepProductGroup(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
				exchangeConfig, syncDatas, syncDtoExt);
		// if config type is CUT_PIECE_TEP
		cutPieceProduct(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
				exchangeConfig, syncDatas, syncDtoExt);
		// if config type is TEP_GENERAL_CODES
		tepGeneralCodeProductGroup(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfig,
				exchangeConfigProductsList, syncDatas);
		List<ExchangeConfigProductMappingDaoExt> savedList = exchangeConfigProductMappingRepository
				.saveAll(exchangeConfigProductsList);
		if (!savedList.isEmpty()) {
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(exchangeConfigProductsList), 0));
		}
		if (!syncDatas.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			syncStagingDto = exchangeConfigServiceImp.saveGepToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.EXCHANGE_CONFIG_PRODUCT_ADD, destinations,
					DestinationType.ALL.toString());
		}
		return syncStagingDto;
	}

	private void tepGeneralCodeProductGroup(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfig,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList, List<SyncData> syncDatas) {
		if (ConfigTypeEnum.TEP_GENERAL_CODES.toString().equals(configType)) {
			addTepGeneralCodeProductGroup(exchangeConfigProductGroupMappingRequestDto, exchangeConfig,
					exchangeConfigProductsList);
			removeTepGeneralCodeProductGroup(exchangeConfigProductGroupMappingRequestDto, exchangeConfig, syncDatas);
		}
	}

	private void removeTepGeneralCodeProductGroup(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfig, List<SyncData> syncDatas) {
		ExchangeConfigProductSyncDtoExt syncDtoExt = new ExchangeConfigProductSyncDtoExt();
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getRemoveProductGroups())) {
			List<ExchangeConfigProductMappingDaoExt> gepConfigProductsDeleteList = exchangeConfigProductMappingRepository
					.findByExchangeConfigAndIdIn(exchangeConfig,
							exchangeConfigProductGroupMappingRequestDto.getRemoveProductGroups());
			exchangeConfigProductMappingRepository.deleteAll(gepConfigProductsDeleteList);
			if (!gepConfigProductsDeleteList.isEmpty()) {
				gepConfigProductsDeleteList.forEach(gepProduct -> gepProduct.setSyncTime(new Date().getTime()));
				syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(gepConfigProductsDeleteList), 1));
			}
		}
	}

	private void addTepGeneralCodeProductGroup(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfig,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getAddProductGroups())) {
			exchangeConfigProductGroupMappingRequestDto.getAddProductGroups().forEach(record -> {
				ExchangeConfigProductMappingDaoExt exchangeConfigProductMappingDao = new ExchangeConfigProductMappingDaoExt();
				exchangeConfigProductMappingDao.setProductGroupCode(record.getProductGroupCode());
				exchangeConfigProductMappingDao.setExchangeConfig(exchangeConfig);
				exchangeConfigProductMappingDao.setSyncTime(new Date().getTime());
				exchangeConfigProductsList.add(exchangeConfigProductMappingDao);
			});
		}
	}

	private void gepProductGroup(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig, List<SyncData> syncDatas,
			ExchangeConfigProductSyncDtoExt syncDtoExt) {
		if (ConfigTypeEnum.GEP_ITEM.toString().equals(configType)) {
			addGepProductGroups(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
					exchangeConfig);
			updateGepProduct(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
					exchangeConfig);
			removeProductMapping(exchangeConfigProductGroupMappingRequestDto, syncDatas, syncDtoExt, exchangeConfig);
		}
	}

	private void tepProductGroup(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig, List<SyncData> syncDatas,
			ExchangeConfigProductSyncDtoExt syncDtoExt) {
		if (ConfigTypeEnum.TEP_ITEM.toString().equals(configType)) {
			addTepProduct(exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList, exchangeConfig,
					configType);
			updateTepProduct(configType, exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
					exchangeConfig);
			removeProductMapping(exchangeConfigProductGroupMappingRequestDto, syncDatas, syncDtoExt, exchangeConfig);
		}
	}

	private void updateTepProduct(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getUpdateProductGroups())) {
			exchangeConfigProductGroupMappingRequestDto.getUpdateProductGroups().forEach(record -> {
				Optional<ExchangeConfigProductMappingDaoExt> exchangeConfigOptional = exchangeConfigProductMappingRepository
						.findByExchangeConfigAndId(exchangeConfig, record.getId());
				if (!exchangeConfigOptional.isPresent()) {
					throw new ServiceException(ConfigConstants.NO_PRODUCT_MAPPING_FOUND,
							ConfigConstants.ERR_CONFIG_060);
				}
				JsonData tepProductConfigJson = tepJsonValidation(configType, record.getConfigDetails(),
						exchangeConfigOptional.get().getProductGroupCode());
				ExchangeConfigProductMappingDaoExt exchangeProductMapping = exchangeConfigOptional.get();
				exchangeProductMapping.setConfigDetails(MapperUtil.getStringFromJson(tepProductConfigJson));
				exchangeProductMapping.setSyncTime(new Date().getTime());
				exchangeConfigProductsList.add(exchangeProductMapping);
			});
		}
	}

	private void updateGepProduct(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getUpdateGepProductGroups())
				&& !CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getUpdateRanges())) {
			exchangeConfigProductGroupMappingRequestDto.getUpdateRanges().forEach(
					data -> exchangeConfigProductGroupMappingRequestDto.getUpdateGepProductGroups().forEach(record -> {
						Optional<ExchangeConfigProductMappingDaoExt> exchangeConfigOptional = exchangeConfigProductMappingRepository
								.findByExchangeConfigAndProductGroupCodeAndRangeId(exchangeConfig,
										record.getProductGroupCode(), data.getRangeId());
						if (exchangeConfigOptional.isPresent()) {
							ExchangeConfigProductMappingDaoExt exchangeProductMapping = exchangeConfigOptional.get();
							exchangeProductMapping.setSyncTime(new Date().getTime());
							exchangeProductMapping.setPercentValue(data.getPercentValue());
							if (exchangeConfigProductGroupMappingRequestDto.getRivaahExchangeConfigDto() != null) {
								JsonData gepRivaahJson = new JsonData();
								gepRivaahJson.setType(configType);
								RivaahProductGroupGepPurityDetails rivaahProductGroupGepPurityDetails = new RivaahProductGroupGepPurityDetails();
								rivaahProductGroupGepPurityDetails
										.setRivaahAdditionalDiscount(exchangeConfigProductGroupMappingRequestDto
												.getRivaahExchangeConfigDto().getRivaahAdditionalDiscount());
								gepRivaahJson.setData(rivaahProductGroupGepPurityDetails);
								exchangeProductMapping.setConfigDetails(MapperUtil.getJsonString(gepRivaahJson));
							}
							exchangeConfigProductsList.add(exchangeProductMapping);
						}
					}));
		}
	}

	private void cutPieceProduct(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig, List<SyncData> syncDatas,
			ExchangeConfigProductSyncDtoExt syncDtoExt) {
		if (ConfigTypeEnum.TEP_CUT_PIECE.toString().equals(configType)) {
			// add product categories
			addProductCategories(exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
					exchangeConfig);
			// remove product categories
			removeProductCategories(exchangeConfigProductGroupMappingRequestDto, exchangeConfig, syncDatas, syncDtoExt);
			// update product categories
			updateProductCategories(exchangeConfigProductGroupMappingRequestDto, exchangeConfigProductsList,
					exchangeConfig);
		}
	}

	private void updateProductCategories(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getUpdateProductCategories())) {
			exchangeConfigProductGroupMappingRequestDto.getUpdateProductCategories().forEach(record -> {
				Optional<ExchangeConfigProductMappingDaoExt> exchangeOptional = exchangeConfigProductMappingRepository
						.findByExchangeConfigAndId(exchangeConfig, record.getId());
				if (!exchangeOptional.isPresent()) {
					throw new ServiceException(ConfigConstants.NO_PRODUCT_MAPPING_FOUND,
							ConfigConstants.ERR_CONFIG_060);
				}
				ExchangeConfigProductMappingDaoExt exchangeProductMapping = exchangeOptional.get();
				JsonData jsonData = cutPieceConfigDetailsJson(record.getCutPieceTepPercent());
				exchangeProductMapping.setConfigDetails(MapperUtil.getStringFromJson(jsonData));
				exchangeProductMapping.setSyncTime(new Date().getTime());
				exchangeConfigProductsList.add(exchangeProductMapping);
			});
		}
	}

	private void removeProductCategories(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfig, List<SyncData> syncDatas,
			ExchangeConfigProductSyncDtoExt syncDtoExt) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getRemoveProductCategories())) {
			List<ExchangeConfigProductMappingDaoExt> productCategoryList = exchangeConfigProductMappingRepository
					.findByExchangeConfigAndIdIn(exchangeConfig,
							exchangeConfigProductGroupMappingRequestDto.getRemoveProductCategories());
			exchangeConfigProductMappingRepository.deleteAll(productCategoryList);
			if (!productCategoryList.isEmpty()) {
				productCategoryList.forEach(gepProduct -> gepProduct.setSyncTime(new Date().getTime()));
				syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(productCategoryList), 1));
			}
		}
	}

	private void addProductCategories(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> exchangeConfigProductsList,
			ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getAddProductCategories())) {
			exchangeConfigProductGroupMappingRequestDto.getAddProductCategories().forEach(record -> {
				ExchangeConfigProductMappingDaoExt exchangeConfigproduct = new ExchangeConfigProductMappingDaoExt();
				exchangeConfigproduct.setProductCategoryCode(record.getProductCategoryCode());
				JsonData jsonData = cutPieceConfigDetailsJson(record.getCutPieceTepPercent());
				exchangeConfigproduct.setConfigDetails(MapperUtil.getStringFromJson(jsonData));
				exchangeConfigproduct.setExchangeConfig(exchangeConfig);
				exchangeConfigproduct.setSyncTime(new Date().getTime());
				exchangeConfigProductsList.add(exchangeConfigproduct);
			});
		}
	}

	private JsonData cutPieceConfigDetailsJson(BigDecimal cutPieceTepPercent) {
		JsonData jsonData = new JsonData();
		jsonData.setType("CUT_PIECE_TEP_CONFIG");
		String data = "{\"cutPieceTepPercent\": " + cutPieceTepPercent + "}";
		jsonData.setData(MapperUtil.getJsonFromString(data));
		return jsonData;
	}

	private void addTepProduct(ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> gepConfigProductsList, ExchangeConfigMasterDaoExt exchangeConfig,
			String configType) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getAddProductGroups())) {
			exchangeConfigProductGroupMappingRequestDto.getAddProductGroups().forEach(record -> {
				// JSON validation for TEP
				JsonData tepProductGroupJson = tepJsonValidation(configType, record.getConfigDetails(),
						record.getProductGroupCode());
				log.debug("tep product config json:  {}", tepProductGroupJson);
				ExchangeConfigProductMappingDaoExt exchangeProductMapping = (ExchangeConfigProductMappingDaoExt) MapperUtil
						.getDtoMapping(record, ExchangeConfigProductMappingDaoExt.class);
				exchangeProductMapping.setExchangeConfig(exchangeConfig);
				exchangeProductMapping.setConfigDetails(MapperUtil.getStringFromJson(tepProductGroupJson));
				exchangeProductMapping.setSyncTime(new Date().getTime());
				gepConfigProductsList.add(exchangeProductMapping);
			});
		}
	}

	private void removeProductMapping(
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<SyncData> syncDatas, ExchangeConfigProductSyncDtoExt syncDtoExt,
			ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getRemoveProductGroups())) {
			List<ExchangeConfigProductMappingDaoExt> gepConfigProductsDeleteList = exchangeConfigProductMappingRepository
					.findByExchangeConfigAndIdIn(exchangeConfig,
							exchangeConfigProductGroupMappingRequestDto.getRemoveProductGroups());
			exchangeConfigProductMappingRepository.deleteAll(gepConfigProductsDeleteList);
			if (!gepConfigProductsDeleteList.isEmpty()) {
				gepConfigProductsDeleteList.forEach(gepProduct -> gepProduct.setSyncTime(new Date().getTime()));
				syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(gepConfigProductsDeleteList), 1));
			}
		}
	}

	private void addGepProductGroups(String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto,
			List<ExchangeConfigProductMappingDaoExt> gepConfigProductsList, ExchangeConfigMasterDaoExt exchangeConfig) {
		if (!CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getAddProductGroups())
				&& !CollectionUtils.isEmpty(exchangeConfigProductGroupMappingRequestDto.getAddRanges())) {
			exchangeConfigProductGroupMappingRequestDto.getAddRanges().forEach(
					data -> exchangeConfigProductGroupMappingRequestDto.getAddProductGroups().forEach(record -> {
						ExchangeConfigProductMappingDaoExt exchangeConfigProductMappingDao = new ExchangeConfigProductMappingDaoExt();
						RangeMasterDaoExt rangeMasterDao = getRangeMasterDao(data.getRangeId());
						exchangeConfigProductMappingDao.setRange(rangeMasterDao);
						exchangeConfigProductMappingDao.setPercentValue(data.getPercentValue());
						exchangeConfigProductMappingDao.setProductGroupCode(record.getProductGroupCode());
						exchangeConfigProductMappingDao.setExchangeConfig(exchangeConfig);
						exchangeConfigProductMappingDao.setSyncTime(new Date().getTime());
						if (exchangeConfigProductGroupMappingRequestDto.getRivaahExchangeConfigDto() != null) {
							JsonData gepRivaahJson = new JsonData();
							gepRivaahJson.setType(configType);
							RivaahProductGroupGepPurityDetails rivaahProductGroupGepPurityDetails = new RivaahProductGroupGepPurityDetails();
							rivaahProductGroupGepPurityDetails
									.setRivaahAdditionalDiscount(exchangeConfigProductGroupMappingRequestDto
											.getRivaahExchangeConfigDto().getRivaahAdditionalDiscount());
							gepRivaahJson.setData(rivaahProductGroupGepPurityDetails);
							exchangeConfigProductMappingDao.setConfigDetails(MapperUtil.getJsonString(gepRivaahJson));
						}
						gepConfigProductsList.add(exchangeConfigProductMappingDao);
					}));
		}
	}

	private JsonData tepJsonValidation(String configType, JsonData configDetails, String productGroupCode) {
		JsonData tepProduct = new JsonData();
		if (ConfigTypeEnum.TEP_ITEM.toString().equals(configType)) {
			if (!"TEP_PRODUCT_CONFIG".equals(configDetails.getType())) {
				throw new ServiceException(ConfigConstants.JSON_TYPE_MISMATCH, ConfigConstants.ERR_CORE_014,
						ConfigConstants.JSON_TYPE + configDetails.getType());
			}
			TepProductGroupConfigDetails tepProductConfig = new TepProductGroupConfigDetails();
			tepProductConfig.validate(configDetails.getData());
			tepProductConfig = MapperUtil.getObjectMapperInstance().convertValue(configDetails.getData(),
					TepProductGroupConfigDetails.class);
			validateUCP(tepProductConfig);
			validateStoneCharges(tepProductConfig);
			validateTEPSaleableBin(tepProductConfig, productGroupCode);
			validateQuantityEditable(productGroupCode, tepProductConfig);
			validateSolitarie(tepProductConfig);
			tepProduct.setType(configDetails.getType());
			tepProduct.setData(tepProductConfig);
		}
		return tepProduct;
	}

	private void validateTEPSaleableBin(TepProductGroupConfigDetails tepProductConfig, String productGroupCode) {
		if (!("71".equals(productGroupCode) || "73".equals(productGroupCode))
				&& Boolean.TRUE.equals(tepProductConfig.getIsTEPSaleBin())) {
			throw new ServiceException(
					"Only coins and plain items can be saleable, can't configure {productGrp} as IsTEPSaleBin : {isSale}",
					"ERR-CONFIG-185",
					Map.of("productGrp", productGroupCode, "isSale", tepProductConfig.getIsTEPSaleBin()));
		}
	}

	private void validateUCP(TepProductGroupConfigDetails tepProductConfig) {
		// ucp deduction flat value & ucp deduction percent value both should not be
		// null at the same time
		if (tepProductConfig.getUcpDeductionFlatValue() == null && tepProductConfig.getUcpDeductionPercent() == null) {
			throw new ServiceException(
					"UCP deduction flat value and UCP deduction percent both cannot be null at the same time",
					"ERR-CONFIG-094", "UCP deduction flat value : " + tepProductConfig.getUcpDeductionFlatValue()
							+ " & UCP deduction flat percent : " + tepProductConfig.getUcpDeductionPercent());
		}
		// ucp deduction flat value & ucp deduction percent value both should not be
		// configured
		if (tepProductConfig.getUcpDeductionFlatValue() != null && tepProductConfig.getUcpDeductionPercent() != null) {
			throw new ServiceException(
					"UCP deduction flat value and UCP deduction percent both cannot be configured at the same time",
					"ERR-CONFIG-106", "UCP deduction flat value : " + tepProductConfig.getUcpDeductionFlatValue()
							+ " & UCP deduction flat percent : " + tepProductConfig.getUcpDeductionPercent());
		}
	}

	private void validateStoneCharges(TepProductGroupConfigDetails tepProductConfig) {
		// if stone charges applicable is checked & stone deduction percent is null then
		// throw exception
		// if stone charges applicable is unchecked & stone deduction percent is not
		// null then throw exception
		if (tepProductConfig.getIsStoneChargesApplicable() && tepProductConfig.getStoneDeductionPercent() == null) {
			throw new ServiceException("Enter stone deduction percent", "ERR-CONFIG-107");
		} else if (!tepProductConfig.getIsStoneChargesApplicable()
				&& tepProductConfig.getStoneDeductionPercent() != null) {
			throw new ServiceException("Stone deduction percent should be null", "ERR-CONFIG-108",
					"isStoneChargesApplicable : " + tepProductConfig.getIsStoneChargesApplicable()
							+ " & stoneDeductionPercent : " + tepProductConfig.getStoneDeductionPercent());
		}
	}
	
	private void validateSolitarie(TepProductGroupConfigDetails tepProductConfig) {
		// if solitarie charges applicable is checked & solitarie deduction percent is null then
		// throw exception
		// if solitarie charges applicable is unchecked & solitarie deduction percent is not
		// null then throw exception
		if (tepProductConfig.getIsCmDeductionAllowed() && tepProductConfig.getCmDeductionPercent() == null) {
			throw new ServiceException("Enter CM deduction percent", "ERR-CONFIG-190");
		} else if (!tepProductConfig.getIsCmDeductionAllowed()
				&& tepProductConfig.getCmDeductionPercent() != null) {
			throw new ServiceException("CM deduction percent should be null", "ERR-CONFIG-191",
					"isCmDeductionAllowed : " + tepProductConfig.getIsCmDeductionAllowed()
							+ " & cmDeductionPercent : " + tepProductConfig.getCmDeductionPercent());
		}
	}

	private void validateQuantityEditable(String productGroupCode, TepProductGroupConfigDetails tepProduct) {
		/**
		 * isQuantityEditable flag should be true only for 74(diamond) & 73(gold coin).
		 */
		if ("74".equals(productGroupCode) || "73".equals(productGroupCode)) {
			tepProduct.setIsQuantityEditable(true);
		} else {
			tepProduct.setIsQuantityEditable(false);
		}
	}

	private ListResponse<ExchangeConfigProductGropusResponseDto> getProductGroupsListDto(
			List<ExchangeConfigProductGropusResponseDto> gepConfigProductsListDto,
			List<ExchangeConfigProductMappingDaoExt> gepConfigProductsList) {
		gepConfigProductsList.forEach(record -> {
			ExchangeConfigProductGropusResponseDto gepConfigProductGropusResponseDto = (ExchangeConfigProductGropusResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigProductGropusResponseDto.class);
			gepConfigProductGropusResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			if (record.getRange() != null) {
				gepConfigProductGropusResponseDto.setRangeId(record.getRange().getId());
			}
			gepConfigProductGropusResponseDto.setConfigDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(record.getConfigDetails()), JsonData.class));
			gepConfigProductsListDto.add(gepConfigProductGropusResponseDto);
		});
		return new ListResponse<>(gepConfigProductsListDto);
	}

	@Override
	public ListResponse<ExchangeConfigLocationsResponseDto> getLocationsMapping(String configId, String configType) {
		List<ExchangeConfigLocationsResponseDto> exchangeConfigLocationList = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		List<ExchangeConfigLocationMappingDaoExt> exchangeConfigLocationPage = exchangeConfigLocationMappingRepository
				.findByExchangeConfig(exchangeConfigMasterDao);
		exchangeConfigLocationPage.forEach(record -> {
			ExchangeConfigLocationsResponseDto exchangeConfigLocationsResponseDto = (ExchangeConfigLocationsResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigLocationsResponseDto.class);
			exchangeConfigLocationsResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			exchangeConfigLocationList.add(exchangeConfigLocationsResponseDto);
		});
		return new ListResponse<>(exchangeConfigLocationList);
	}

	@Override
	public PagedRestResponse<List<ExchangeConfigProductGropusResponseDto>> getProductMapping(String configId,
			String configType, String productGroup, String productCategory, Pageable pageable) {
		List<ExchangeConfigProductGropusResponseDto> exchangeConfigProductsList = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		Page<ExchangeConfigProductMappingDaoExt> gepProductPage = getPageableGepProduct(productGroup, productCategory,
				configId, pageable);
		gepProductPage.forEach(record -> {
			ExchangeConfigProductGropusResponseDto exchangeConfigProductGropusResponseDto = (ExchangeConfigProductGropusResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigProductGropusResponseDto.class);
			exchangeConfigProductGropusResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			if (record.getRange() != null) {
				exchangeConfigProductGropusResponseDto.setRangeId(record.getRange().getId());
			}
			Object configDetails = MapperUtil.getJsonFromString(record.getConfigDetails());
			exchangeConfigProductGropusResponseDto
					.setConfigDetails(MapperUtil.getObjectMapperInstance().convertValue(configDetails, JsonData.class));
			exchangeConfigProductsList.add(exchangeConfigProductGropusResponseDto);
		});
		return new PagedRestResponse<>(exchangeConfigProductsList, gepProductPage);
	}

	private Page<ExchangeConfigProductMappingDaoExt> getPageableGepProduct(String productGroup, String productCategory,
			String configId, Pageable pageable) {
		ExchangeConfigProductMappingDaoExt exchangeProductMapping = new ExchangeConfigProductMappingDaoExt();
//		exchangeProductMapping.setExchangeConfig(exchangeConfigMasterDao);
		exchangeProductMapping.setProductGroupCode(productGroup);
		exchangeProductMapping.setProductCategoryCode(productCategory);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ExchangeConfigProductMappingDaoExt> gepConFigProductExample = Example.of(exchangeProductMapping,
				matcher);
		return exchangeConfigProductMappingRepository.findAllProductCategory(productGroup, productCategory, configId,
				pageable);

	}

	@Override
	public PagedRestResponse<List<ExchangeConfigItemThemeMappingResponseDto>> getItemThemeMapping(String configType,
			Boolean isTheme, String configId, String itemCode, String themeCode, Pageable pageable) {
		List<ExchangeConfigItemThemeMappingResponseDto> exchangeConfigThemeList = new ArrayList<>();
		Page<ExchangeConfigExcludeMappingDaoExt> exchangeConfigExcludePage;
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		if (isTheme) {
			exchangeConfigExcludePage = exchangeConfigExcludeMappingRepository.getThemeMapping(exchangeConfigMasterDao,
					themeCode, pageable);
		} else {
			exchangeConfigExcludePage = exchangeConfigExcludeMappingRepository.getItemMapping(exchangeConfigMasterDao,
					itemCode, pageable);
		}
		exchangeConfigExcludePage.forEach(record -> {
			ExchangeConfigItemThemeMappingResponseDto exchangeConfigItemMappingResponseDto = (ExchangeConfigItemThemeMappingResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigItemThemeMappingResponseDto.class);
			exchangeConfigItemMappingResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			exchangeConfigThemeList.add(exchangeConfigItemMappingResponseDto);
		});
		return new PagedRestResponse<>(exchangeConfigThemeList, exchangeConfigExcludePage);
	}

	@Override
	public ListResponse<ExchangeUpdateThemeResponseDto> updateThemes(String configId, String configType,
			GepThemeRequestDto gepThemeRequestDto) {
		List<ExchangeUpdateThemeResponseDto> exchangeConfigResponseList = new ArrayList<>();
		List<ExchangeConfigExcludeMappingDaoExt> exchangeConfigThemeDaoList = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveThemsesAndStaging(gepThemeRequestDto,
				exchangeConfigMasterDao, exchangeConfigThemeDaoList);
		exchangeConfigThemeDaoList.forEach(record -> {
			ExchangeUpdateThemeResponseDto exchangeUpdateTheme = (ExchangeUpdateThemeResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeUpdateThemeResponseDto.class);
			exchangeUpdateTheme.setConfigId(record.getExchangeConfig().getConfigId());
			exchangeConfigResponseList.add(exchangeUpdateTheme);
		});
		if (syncStagingDto != null) {
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		}
		return new ListResponse<>(exchangeConfigResponseList);
	}

	/**
	 * @param gepThemeRequestDto
	 * @param exchangeConfigMasterDao
	 * @param gepConfigThemeDaoList
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveThemsesAndStaging(GepThemeRequestDto gepThemeRequestDto,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			List<ExchangeConfigExcludeMappingDaoExt> gepConfigThemeDaoList) {
		List<SyncData> syncDatas = new ArrayList<>();
		ExchangeConfigExcludeMappingSyncDtoExt syncDtoExt = new ExchangeConfigExcludeMappingSyncDtoExt();
		addTheme(gepThemeRequestDto, exchangeConfigMasterDao, gepConfigThemeDaoList, syncDatas, syncDtoExt);
		removeTheme(gepThemeRequestDto, syncDatas, syncDtoExt);
		SyncStagingDto syncStagingDto = null;
		if (!syncDatas.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			syncStagingDto = exchangeConfigServiceImp.saveGepToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.EXCHANGE_CONFIG_THEME_ADD, destinations,
					DestinationType.ALL.toString());
		}
		return syncStagingDto;
	}

	private void removeTheme(GepThemeRequestDto gepThemeRequestDto, List<SyncData> syncDatas,
			ExchangeConfigExcludeMappingSyncDtoExt syncDtoExt) {
		if (!CollectionUtils.isEmpty(gepThemeRequestDto.getRemoveThemes())) {
			List<ExchangeConfigExcludeMappingDaoExt> gepConfigExcludeList = exchangeConfigExcludeMappingRepository
					.findAllById(gepThemeRequestDto.getRemoveThemes());
			exchangeConfigExcludeMappingRepository.deleteAll(gepConfigExcludeList);
			gepConfigExcludeList.forEach(gepExclude -> gepExclude.setSyncTime(new Date().getTime()));
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(gepConfigExcludeList), 1));
		}
	}

	private void addTheme(GepThemeRequestDto gepThemeRequestDto, ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			List<ExchangeConfigExcludeMappingDaoExt> gepConfigThemeDaoList, List<SyncData> syncDatas,
			ExchangeConfigExcludeMappingSyncDtoExt syncDtoExt) {
		gepThemeRequestDto.getAddThemes().forEach(record -> {
			ExchangeConfigExcludeMappingDaoExt exchangeConfigThemeDao = new ExchangeConfigExcludeMappingDaoExt();
			exchangeConfigThemeDao.setExchangeConfig(exchangeConfigMasterDao);
			exchangeConfigThemeDao.setIsExcluded(Boolean.TRUE);
			exchangeConfigThemeDao.setThemeCode(record);
			exchangeConfigThemeDao.setSyncTime(new Date().getTime());
			gepConfigThemeDaoList.add(exchangeConfigThemeDao);
		});
		if (!StringUtils.isEmpty(gepConfigThemeDaoList)) {
			List<ExchangeConfigExcludeMappingDaoExt> savedList = exchangeConfigExcludeMappingRepository
					.saveAll(gepConfigThemeDaoList);
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(savedList), 0));
		}
	}

	@Override
	public ListResponse<ExchangeUpdateItemResponseDto> updateItems(String configId, String configType,
			GepConfigItemRequestDto gepItemRequest) {
		List<ExchangeUpdateItemResponseDto> exchangeUpdateItemLists = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(configId, configType);
		List<ExchangeConfigExcludeMappingDaoExt> exchangeConfigThemeDaoList = new ArrayList<>();
		SyncStagingDto syncStagingDto = exchangeConfigServiceImp.saveItemsAndStaging(gepItemRequest,
				exchangeConfigThemeDaoList, exchangeConfigMasterDao);
		if (syncStagingDto != null)
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		exchangeConfigThemeDaoList.forEach(data -> {
			ExchangeUpdateItemResponseDto exchangeItemDto = (ExchangeUpdateItemResponseDto) MapperUtil
					.getDtoMapping(data, ExchangeUpdateItemResponseDto.class);
			exchangeItemDto.setConfigId(data.getExchangeConfig().getConfigId());
			exchangeUpdateItemLists.add(exchangeItemDto);
		});
		return new ListResponse<>(exchangeUpdateItemLists);
	}

	/**
	 * @param gepItemRequest
	 * @param gepConfigThemeDaoList
	 * @param gepConfigMasterDao
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveItemsAndStaging(GepConfigItemRequestDto gepItemRequest,
			List<ExchangeConfigExcludeMappingDaoExt> gepConfigThemeDaoList,
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao) {
		List<SyncData> syncDatas = new ArrayList<>();
		ExchangeConfigExcludeMappingSyncDtoExt syncDtoExt = new ExchangeConfigExcludeMappingSyncDtoExt();
		gepItemRequest.getUpdateItems().forEach(record -> {
			ExchangeConfigExcludeMappingDaoExt gepConfigExcludeDao = exchangeConfigExcludeMappingRepository
					.findById(record.getId())
					.orElseThrow(() -> new ServiceException(ConfigConstants.NO_GEP_ITEM_THEME_MAPPING_FOUND,
							ConfigConstants.ERR_CONFIG_020, "id :" + record.getId()));
			gepConfigExcludeDao.setIsExcluded(record.getIsExcluded());
			gepConfigExcludeDao.setSyncTime(new Date().getTime());
			gepConfigExcludeDao.setExchangeConfig(exchangeConfigMasterDao);
			gepConfigExcludeDao.setSyncTime(new Date().getTime());
			gepConfigThemeDaoList.add(gepConfigExcludeDao);
		});
		if (!StringUtils.isEmpty(gepConfigThemeDaoList)) {
			exchangeConfigExcludeMappingRepository.saveAll(gepConfigThemeDaoList);
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(gepConfigThemeDaoList), 0));
		}
		SyncStagingDto syncStagingDto = null;
		if (!syncDatas.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			syncStagingDto = exchangeConfigServiceImp.saveGepToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.EXCHANGE_CONFIG_ITEMS_ADD, destinations,
					DestinationType.ALL.toString());
		}
		return syncStagingDto;
	}

	@Override
	public ListResponse<MappedConfigResponseDto> getLocationsMappingList(String configType,
			ExchangeConfigLocationsMappingRequestDto gepConfigLocationsMappingRequestDto) {
		List<MappedConfigResponseDto> locationList = new ArrayList<>();
		List<ExchangeConfigLocationMappingDaoExt> exchangeConfigLocations = null;
		Set<String> includeLocations = CollectionUtil
				.setNullIfEmpty(gepConfigLocationsMappingRequestDto.getIncludeLocations());
		if (StringUtils.isEmpty(gepConfigLocationsMappingRequestDto.getExcludeConfigId())) {
			exchangeConfigLocations = exchangeConfigLocationMappingRepository.getAllLocations(includeLocations,
					configType);
		} else {
			ExchangeConfigMasterDaoExt exchangeConfigMasterDao = getExchangeConfigMasterDao(
					gepConfigLocationsMappingRequestDto.getExcludeConfigId(), configType);
			exchangeConfigLocations = exchangeConfigLocationMappingRepository
					.findOtherLocationCode(exchangeConfigMasterDao, includeLocations, configType);
		}
		for (ExchangeConfigLocationMappingDaoExt record : exchangeConfigLocations) {
			MappedConfigResponseDto mappedConfigResponseDto = (MappedConfigResponseDto) MapperUtil.getDtoMapping(record,
					MappedConfigResponseDto.class);
			mappedConfigResponseDto.setConfigId(record.getExchangeConfig().getConfigId());
			mappedConfigResponseDto.setConfigName(record.getExchangeConfig().getDescription());
			mappedConfigResponseDto.setConfigType(record.getExchangeConfig().getConfigType());
			locationList.add(mappedConfigResponseDto);
		}
		return new ListResponse<>(locationList);
	}

	@Override
	public PagedRestResponse<List<ExchangeConfigStoneResponseDto>> getExchangeConfigStoneMapping(String configId,
			String configType, String stoneTypeCode, Pageable pageable) {
		List<ExchangeConfigStoneResponseDto> exchangeConfigDtoList = new ArrayList<>();
		ExchangeConfigMasterDaoExt exchangeConfigMaster = getExchangeConfigMasterDao(configId, configType);
		Page<ExchangeConfigStoneMappingDaoExt> exchangeConfigStonePage = getExchangeConfigStoneMappingData(
				stoneTypeCode, pageable, exchangeConfigMaster);
		exchangeConfigStonePage.forEach(record -> {
			ExchangeConfigStoneResponseDto exchangeStoneConfig = (ExchangeConfigStoneResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigStoneResponseDto.class);
			exchangeStoneConfig.setConfigId(exchangeConfigMaster.getConfigId());
			exchangeStoneConfig.setRangeId(record.getRange().getId());
			exchangeConfigDtoList.add(exchangeStoneConfig);
		});
		return new PagedRestResponse<>(exchangeConfigDtoList, exchangeConfigStonePage);
	}

	private Page<ExchangeConfigStoneMappingDaoExt> getExchangeConfigStoneMappingData(String stoneTypeCode,
			Pageable pageable, ExchangeConfigMasterDaoExt exchangeConfigMaster) {
		ExchangeConfigStoneMappingDaoExt exchangeConfigStoneMapping = new ExchangeConfigStoneMappingDaoExt();
		exchangeConfigStoneMapping.setExchangeConfig(exchangeConfigMaster);
		exchangeConfigStoneMapping.setStoneTypeCode(stoneTypeCode);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ExchangeConfigStoneMappingDaoExt> stoneCriteria = Example.of(exchangeConfigStoneMapping, matcher);
		return exchangeConfigStoneRepository.findAll(stoneCriteria, pageable);
	}

	@Override
	public ListResponse<ExchangeConfigStoneResponseDto> updateStones(String configId, String configType,
			ExchangeConfigStoneRequestDto exchangeStonesRequest) {
		List<ExchangeConfigStoneResponseDto> exchangeStoneConfigLists = new ArrayList<>();
		List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList = new ArrayList<>();
		SyncStagingDto stagingDto = exchangeConfigServiceImp.saveExchangeStoneAndStaging(exchangeStoneList, configId,
				configType, exchangeStonesRequest);
		if (stagingDto != null)
			syncDataService.publishConfigMessagesToQueue(stagingDto);
		return getTepStoneResponse(exchangeStoneConfigLists, exchangeStoneList);
	}

	/**
	 * @param exchangeStoneConfigLists
	 * @param configId
	 * @param configType
	 * @param exchangeStonesRequest
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveExchangeStoneAndStaging(List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList,
			String configId, String configType, ExchangeConfigStoneRequestDto exchangeStonesRequest) {
		ExchangeConfigMasterDaoExt exchangeConfigMaster = getExchangeConfigMasterDao(configId, configType);
		List<SyncData> syncDatas = new ArrayList<>();
		Map<String, List<AddRangeDto>> slabDetailsMap = new HashMap<>();
		ExchangeConfigStoneSyncDtoExt syncDtoExt = new ExchangeConfigStoneSyncDtoExt();
		addStones(exchangeStonesRequest, exchangeConfigMaster, exchangeStoneList, slabDetailsMap);
		updateStones(exchangeStonesRequest, exchangeConfigMaster, exchangeStoneList, slabDetailsMap);
		removeStones(exchangeStonesRequest, exchangeConfigMaster, syncDatas);
		slabDetailsMap.forEach((key, value) -> SlabValidator.createAndValidateSlabObject(value, AddRangeDto.class,
				ConfigConstants.FROM_RANGE, ConfigConstants.TO_RANGE, ConfigConstants.ROW_ID));
		if (!CollectionUtils.isEmpty(exchangeStoneList)) {
			List<ExchangeConfigStoneMappingDaoExt> savedList = exchangeConfigStoneRepository.saveAll(exchangeStoneList);
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(savedList), 1));
		}
		SyncStagingDto syncStagingDto = null;
		if (!syncDatas.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			syncStagingDto = exchangeConfigServiceImp.saveGepToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.EXCHANGE_CONFIG_STONE_MAPPING, destinations,
					DestinationType.ALL.toString());
		}
		return syncStagingDto;
	}

	private void updateStones(ExchangeConfigStoneRequestDto exchangeStonesRequest,
			ExchangeConfigMasterDaoExt exchangeConfigMaster, List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList,
			Map<String, List<AddRangeDto>> slabDetailsMap) {
		if (!CollectionUtils.isEmpty(exchangeStonesRequest.getUpdateStones())) {
			exchangeStonesRequest.getUpdateStones().forEach(record -> {
				ExchangeConfigStoneMappingDaoExt exchangeConfigStoneMapping = exchangeConfigStoneRepository
						.findByExchangeConfigAndId(exchangeConfigMaster, record.getId());
				if (exchangeConfigStoneMapping == null) {
					throw new ServiceException(ConfigConstants.NO_STONE_MAPPING_CONFIGURATION_FOUND,
							ConfigConstants.ERR_CONFIG_095, "id : " + record.getId());
				}
				MapperUtil.getObjectMapping(record, exchangeConfigStoneMapping, "id");
				validateStoneRange(record.getRangeId(), record.getRowId(),
						exchangeConfigStoneMapping.getStoneTypeCode(), exchangeConfigStoneMapping.getStoneQuality(),
						slabDetailsMap);
				exchangeStoneList.add(exchangeConfigStoneMapping);
			});
		}
	}

	private RangeMasterDaoExt validateStoneRange(String rangeId, Integer rowId, String stoneTypeCode,
			String stoneQuality, Map<String, List<AddRangeDto>> slabDetailsMap) {
		if ((rangeId != null && rowId == null) || (rangeId == null && rowId != null)) {
			throw new ServiceException(ConfigConstants.COMBINATION_OF_RANGE_ID_AND_ROW_ID_SHOULD_NOT_BE_NULL,
					ConfigConstants.ERR_CONFIG_021, "Combination : rangeId:- " + rangeId + " & rowId :- " + rowId);
		}
		RangeMasterDaoExt rangeMasterDao = getRangeMasterDao(rangeId);
		if (!RangeTypeEnum.TEP_CARAT.toString().equals(rangeMasterDao.getRangeType())) {
			throw new ServiceException(ConfigConstants.CHOOSE_PROPER_RANGE_DETAILS, ConfigConstants.ERR_CONFIG_105,
					"range id : " + rangeId + " & range type : " + rangeMasterDao.getRangeType());
		}
		AddRangeDto addRangeDto = (AddRangeDto) MapperUtil.getDtoMapping(rangeMasterDao, AddRangeDto.class);
		addRangeDto.setRowId(rowId);
		addStoneSlabDetails(stoneTypeCode, stoneQuality, slabDetailsMap, addRangeDto);
		return rangeMasterDao;
	}

	private ListResponse<ExchangeConfigStoneResponseDto> getTepStoneResponse(
			List<ExchangeConfigStoneResponseDto> exchangeStoneConfigLists,
			List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList) {
		exchangeStoneList.forEach(record -> {
			ExchangeConfigStoneResponseDto exchangeStoneResponse = (ExchangeConfigStoneResponseDto) MapperUtil
					.getDtoMapping(record, ExchangeConfigStoneResponseDto.class);
			exchangeStoneResponse.setConfigId(record.getExchangeConfig().getConfigId());
			exchangeStoneResponse.setRangeId(record.getRange().getId());
			exchangeStoneConfigLists.add(exchangeStoneResponse);
		});
		return new ListResponse<>(exchangeStoneConfigLists);
	}

	private void removeStones(ExchangeConfigStoneRequestDto exchangeStonesRequest,
			ExchangeConfigMasterDaoExt exchangeConfigMaster, List<SyncData> syncDatas) {
		if (!CollectionUtils.isEmpty(exchangeStonesRequest.getRemoveStones())) {
			ExchangeConfigStoneSyncDtoExt syncDtoExt = new ExchangeConfigStoneSyncDtoExt();
			List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList = exchangeConfigStoneRepository
					.findByExchangeConfigAndIdIn(exchangeConfigMaster, exchangeStonesRequest.getRemoveStones());
			exchangeConfigStoneRepository.deleteAll(exchangeStoneList);
			exchangeStoneList.forEach(stone -> stone.setSyncTime(new Date().getTime()));
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(exchangeStoneList), 0));
		}
	}

	private void addStones(ExchangeConfigStoneRequestDto exchangeStonesRequest,
			ExchangeConfigMasterDaoExt exchangeConfigMaster, List<ExchangeConfigStoneMappingDaoExt> exchangeStoneList,
			Map<String, List<AddRangeDto>> slabDetailsMap) {
		if (!CollectionUtils.isEmpty(exchangeStonesRequest.getAddStones())) {
			exchangeStonesRequest.getAddStones().forEach(record -> {
				RangeMasterDaoExt rangeMasterDao = validateStoneRange(record.getRangeId(), record.getRowId(),
						record.getStoneTypeCode(), record.getStoneQuality(), slabDetailsMap);
				ExchangeConfigStoneMappingDaoExt exchangeStoneConfig = (ExchangeConfigStoneMappingDaoExt) MapperUtil
						.getDtoMapping(record, ExchangeConfigStoneMappingDaoExt.class);
				exchangeStoneConfig.setExchangeConfig(exchangeConfigMaster);
				exchangeStoneConfig.setRange(rangeMasterDao);
				exchangeStoneConfig.setSyncTime(new Date().getTime());
				exchangeStoneList.add(exchangeStoneConfig);
			});
		}
	}

	private void addStoneSlabDetails(String stoneTypeCode, String stoneQuality,
			Map<String, List<AddRangeDto>> slabDetailsMap, AddRangeDto addRange) {
		log.debug("stoneTypeCode : {}", stoneTypeCode);
		log.debug("stoneQuality : {}", stoneQuality);
		log.debug("slabDetailsMap : {}", slabDetailsMap);
		List<AddRangeDto> slabDetailsList = slabDetailsMap.computeIfAbsent(stoneTypeCode + stoneQuality, value -> null);
		if (slabDetailsList == null) {
			slabDetailsList = new ArrayList<>();
			slabDetailsMap.put(stoneTypeCode + stoneQuality, slabDetailsList);
		}
		slabDetailsList.add(addRange);
	}

}
