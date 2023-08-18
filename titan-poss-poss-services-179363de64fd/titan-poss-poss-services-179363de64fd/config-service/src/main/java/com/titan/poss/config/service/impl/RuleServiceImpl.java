/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.service.impl;

import static com.titan.poss.config.dto.constants.ConfigConstants.RULE_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.dao.RangeMasterDaoExt;
import com.titan.poss.config.dao.RivaahProductMappingDaoExt;
import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleLocationMappingDaoExt;
import com.titan.poss.config.dao.RuleMarketMappingDaoExt;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleMetadataDao;
import com.titan.poss.config.dao.RuleProductDaoExt;
import com.titan.poss.config.dao.RuleRangeDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.AddRuleProductDto;
import com.titan.poss.config.dto.RivaahErrorDto;
import com.titan.poss.config.dto.RivaahProductMappingSyncDtoExt;
import com.titan.poss.config.dto.RuleLocationMappingSyncDtoExt;
import com.titan.poss.config.dto.RuleMarketMappingSyncDtoExt;
import com.titan.poss.config.dto.RuleMasterSyncDto;
import com.titan.poss.config.dto.RuleMetadataSyncDto;
import com.titan.poss.config.dto.RuleProductMappingSyncDtoExt;
import com.titan.poss.config.dto.RuleProductUpdateDto;
import com.titan.poss.config.dto.RuleRangeSyncDtoExt;
import com.titan.poss.config.dto.UpdateRuleProductDto;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.AddRuleRangeDto;
import com.titan.poss.config.dto.request.MappedRuleLocationDto;
import com.titan.poss.config.dto.request.RivaahProductMappingDto;
import com.titan.poss.config.dto.request.RuleLocationUpdateDto;
import com.titan.poss.config.dto.request.RuleMasterUpdateDto;
import com.titan.poss.config.dto.request.RuleRangeDto;
import com.titan.poss.config.dto.request.RuleRequestMappingListDto;
import com.titan.poss.config.dto.request.UpdateMarketMappingDto;
import com.titan.poss.config.dto.request.UpdateRuleRangeDto;
import com.titan.poss.config.dto.response.MarketMappingResponseDto;
import com.titan.poss.config.dto.response.RivaahProductMappingResponse;
import com.titan.poss.config.dto.response.RivaahRuleLocationDto;
import com.titan.poss.config.dto.response.RuleLocationDto;
import com.titan.poss.config.dto.response.RuleMasterDto;
import com.titan.poss.config.dto.response.RuleMasterResponseDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleProductDto;
import com.titan.poss.config.dto.response.RuleRangeDetailsDto;
import com.titan.poss.config.dto.response.RuleRangeResponseDto;
import com.titan.poss.config.factory.RuleDetailsFactory;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.repository.RangeMasterRepository;
import com.titan.poss.config.repository.RivaahProductMappingRepositoryExt;
import com.titan.poss.config.repository.RuleLocationMappingRepositoryExt;
import com.titan.poss.config.repository.RuleMarketMappingRepositoryExt;
import com.titan.poss.config.repository.RuleMasterRepository;
import com.titan.poss.config.repository.RuleMetadataRepository;
import com.titan.poss.config.repository.RuleProductMappingRepositoryExt;
import com.titan.poss.config.repository.RuleRangeMappingRepositoryExt;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.EngineService;
import com.titan.poss.config.service.RangeService;
import com.titan.poss.config.service.RuleService;
import com.titan.poss.config.service.RuleUtilService;
import com.titan.poss.core.domain.constant.RuleFieldCodesEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.SlabValidator;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.RivaahEligibilityProductMappingDetails;
import com.titan.poss.core.dto.RivaahLocationFilterDto;
import com.titan.poss.core.dto.SlabDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(RULE_SERVICE_IMPL)
public class RuleServiceImpl implements RuleService {

	@Autowired
	RuleMetadataRepository ruleMetadataRepository;

	@Autowired
	RuleMasterRepository ruleMasterRepository;

	@Autowired
	RuleLocationMappingRepositoryExt ruleLocationMappingRepository;

	@Autowired
	private RangeMasterRepository rangeMasterRepository;

	@Autowired
	RuleProductMappingRepositoryExt ruleProductMappingRepository;

	@Autowired
	RuleUtilService ruleUtilService;

	@Autowired
	RuleDetailsFactory ruleFactory;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private RuleServiceImpl ruleService;

	@Autowired
	private RangeService rangeService;

	@Autowired
	EngineService engineService;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	@Autowired
	private RuleMarketMappingRepositoryExt ruleMarketMappingRepository;

	@Autowired
	private RuleRangeMappingRepositoryExt rangeMappingRepository;

	@Autowired
	private RivaahProductMappingRepositoryExt rivaahProductMappingRepository;

	/**
	 * This method will save the rule details.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return ruleMasterResponseDto
	 */
	@Override
	@Transactional
	public RuleMasterResponseDto createRules(String ruleType, RuleMasterDto ruleMasterDto) {

		Integer ruleId = null;
		RuleMasterDao ruleMasterDao = new RuleMasterDao();

		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);
		
		if(ruleMasterDto.getDescription()!= null) {
			List<RuleMasterDao> exstingRules = ruleMasterRepository.findByRuleIdDaoRuleTypeAndDescription(ruleType, ruleMasterDto.getDescription());
			if(!exstingRules.isEmpty())
				throw new ServiceException(ConfigConstants.CONFIG_NAME_EXISTS, ConfigConstants.ERR_CONFIG_182);
		}

		if (ruleMetadataDao != null) {
			// for global rule ruleId should always be 1.
			if (ruleMetadataDao.getRuleGroup().equals(RuleFieldCodesEnum.GLOBAL_CONFIGURATION.toString())) {

				ruleId = 1;
			} else {

				ruleId = ruleMetadataDao.getRuleId() + 1;
			}

			RuleIdDao ruleIdDao = new RuleIdDao();
			ruleIdDao.setRuleId(ruleId);
			ruleIdDao.setRuleType(ruleType);

			ruleMasterDao.setRuleIdDao(ruleIdDao);
			ruleMasterDao.setDescription(ruleMasterDto.getDescription());

			if (ruleMetadataDao.getHeaderLevelValue()) {

				String headerRuleType = ruleType + ConfigConstants.HEADER_LEVEL;
				BaseFieldsValidator ruleDto = ruleFactory.getRuleDetails(headerRuleType);
				ruleDto.validate(ruleMasterDto.getRuleDetails().getData());
				ruleMasterDao.setRuleDetails(MapperUtil.getJsonString(ruleMasterDto.getRuleDetails()));
			}

			ruleMasterDao.setIsActive(ruleMasterDto.getIsActive());
			ruleMasterDao.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			ruleMasterDao.setCreatedDate(new Date());
			ruleMasterDao.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			ruleMasterDao.setLastModifiedDate(new Date());
			ruleMasterDao.setSrcSyncId(0);
			ruleMasterDao.setDestSyncId(0);

			ruleMetadataDao.setRuleId(ruleId);
			ruleMetadataDao.setSrcSyncId(ruleMetadataDao.getSrcSyncId() + 1);
			Map<String, SyncStagingDto> data = ruleService.saveRuleToDB(ruleMasterDao, ruleMetadataDao,
					ConfigServiceOperationCodes.RULE_ADD);
			// Publishing to POSS & EGHS
			syncDataService.publishConfigMessages(data);
			RuleMasterResponseDto ruleResponseDto = (RuleMasterResponseDto) MapperUtil.getObjectMapping(ruleMasterDao,
					new RuleMasterResponseDto());

			Object obj = MapperUtil.getJsonFromString(ruleMasterDao.getRuleDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);

			ruleResponseDto.setRuleId(ruleId);
			ruleResponseDto.setRuleType(ruleType);
			ruleResponseDto.setRuleDetails(jsonData);
			return ruleResponseDto;
		} else {
			throw new ServiceException(ConfigConstants.NO_RULE_TYPE_DEFINED_IN_METADATA,
					ConfigConstants.ERR_CONFIG_013);
		}
	}

	/**
	 * @param ruleMasterDao
	 * @param ruleMetadataDao
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveRuleToDB(RuleMasterDao ruleMasterDao, RuleMetadataDao ruleMetadataDao,
			String operation) {

		List<SyncData> ruleSyncDatas = new ArrayList<>();
		ruleMasterDao = ruleMasterRepository.save(ruleMasterDao);
		RuleMasterSyncDto ruleMasterSyncDto = new RuleMasterSyncDto(ruleMasterDao);
		ruleSyncDatas.add(DataSyncUtil.createSyncData(ruleMasterSyncDto, 0));
		if (ruleMetadataDao != null) {
			ruleMetadataDao = ruleMetadataRepository.save(ruleMetadataDao);
			RuleMetadataSyncDto ruleMetadataSyncDto = new RuleMetadataSyncDto(ruleMetadataDao);
			ruleSyncDatas.add(DataSyncUtil.createSyncData(ruleMetadataSyncDto, 1));
		}
		List<String> destinations = new ArrayList<>();
		return syncDataService.getConfigSyncStagingMap(ruleSyncDatas, operation, destinations, true,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * @param ruleSyncDatas
	 * @param operation
	 * @param destinations
	 * @param destinationType
	 * @return SyncStagingDto
	 */
	public SyncStagingDto saveToSyncStaging(List<SyncData> ruleSyncDatas, String operation, List<String> destinations,
			String destinationType) {
		SyncStagingDto ruleSyncStagingDto = new SyncStagingDto();
		MessageRequest ruleMsgRequest = DataSyncUtil.createMessageRequest(ruleSyncDatas, operation, destinations,
				MessageType.GENERAL.toString(), destinationType);
		SyncStaging ruleStaggingMsg = new SyncStaging();
		String ruleRequestBody = MapperUtil.getJsonString(ruleMsgRequest);
		ruleStaggingMsg.setMessage(ruleRequestBody);
		ruleStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		ruleStaggingMsg = configSyncStagingRepository.save(ruleStaggingMsg);
		ruleSyncStagingDto.setMessageRequest(ruleMsgRequest);
		ruleSyncStagingDto.setId(ruleStaggingMsg.getId());
		return ruleSyncStagingDto;

	}

	/**
	 * This method will return the Rule details based on the ruleType and ruleId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return RuleMasterResponseDto
	 */
	@Override
	public RuleMasterResponseDto getRuleDetails(String ruleType, Integer ruleId) {

		RuleMasterDao ruleMasterDao = ruleMasterRepository.findByRuleIdDaoRuleTypeAndRuleIdDaoRuleId(ruleType, ruleId);

		if (ruleMasterDao == null) {
			throw new ServiceException(ConfigConstants.NO_RULE_DETAILS_FOUND_FOR_THE_REQUESTED_RULE_ID_AND_RULE_TYPE,
					ConfigConstants.ERR_CONFIG_001);
		}
		RuleMasterResponseDto ruleMasterResponseDto = (RuleMasterResponseDto) MapperUtil.getObjectMapping(ruleMasterDao,
				new RuleMasterResponseDto());

		Object obj = MapperUtil.getJsonFromString(ruleMasterDao.getRuleDetails());
		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);

		ruleMasterResponseDto.setRuleId(ruleId);
		ruleMasterResponseDto.setRuleType(ruleType);
		ruleMasterResponseDto.setRuleDetails(jsonData);
		return ruleMasterResponseDto;
	}

	/**
	 * This method will update the Rule details based on the RuleType and RuleId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return RuleMasterResponseDto
	 */
	@Override
	public RuleMasterResponseDto updateRuleDetails(String ruleType, Integer ruleId,
			RuleMasterUpdateDto ruleMasterUpdateDto) {

		RuleMasterDao ruleMasterDao = ruleMasterRepository.findByRuleIdDaoRuleTypeAndRuleIdDaoRuleId(ruleType, ruleId);

		if (ruleMasterDao == null) {
			throw new ServiceException(ConfigConstants.NO_RULE_DETAILS_FOUND_FOR_THE_REQUESTED_RULE_ID_AND_RULE_TYPE,
					ConfigConstants.ERR_CONFIG_001);
		}

		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);
		if (ruleMasterUpdateDto.getRuleDetails() != null && ruleMetadataDao.getHeaderLevelValue()) {

			String headerRuleType = ruleType + ConfigConstants.HEADER_LEVEL;
			BaseFieldsValidator ruleDto = ruleFactory.getRuleDetails(headerRuleType);
			ruleDto.validate(ruleMasterUpdateDto.getRuleDetails().getData());
		}

		ruleMasterDao = (RuleMasterDao) MapperUtil.getObjectMapping(ruleMasterUpdateDto, ruleMasterDao);

		if (ruleMasterUpdateDto.getRuleDetails() != null) {
			ruleMasterDao.setRuleDetails(MapperUtil.getStringFromJson(ruleMasterUpdateDto.getRuleDetails()));
		}
		ruleMasterDao.setSrcSyncId(ruleMasterDao.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = ruleService.saveRuleToDB(ruleMasterDao, null,
				ConfigServiceOperationCodes.RULE_UPDATE);
		// Publishing to POSS & EGHS
		syncDataService.publishConfigMessages(data);

		RuleMasterResponseDto ruleResponseDto = (RuleMasterResponseDto) MapperUtil.getObjectMapping(ruleMasterDao,
				new RuleMasterResponseDto());

		ruleResponseDto.setRuleId(ruleId);
		ruleResponseDto.setRuleType(ruleType);

		if (ruleMasterUpdateDto.getRuleDetails() != null) {
			ruleResponseDto.setRuleDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(ruleMasterDao.getRuleDetails()), JsonData.class));
		}
		return ruleResponseDto;
	}

	/**
	 * This method will create/remove mapping between rule and location.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @param ruleLocationDto
	 * @return RuleLocationDto
	 */
	@Override
	public RuleLocationUpdateDto ruleLocationMapping(String ruleType, Integer ruleId,
			RuleLocationUpdateDto ruleLocationUpdateDto) {

		RuleMetadataDao ruleMetadataRepo = ruleMetadataRepository.findByRuleType(ruleType);
		if (ruleMetadataRepo.getLocationMapping()) {
			Map<String, SyncStagingDto> locationSyncDataMap = ruleService.saveRuleLocationAndStaging(ruleType, ruleId,
					ruleLocationUpdateDto);
			if (!locationSyncDataMap.isEmpty()) {
				for (Map.Entry<String, SyncStagingDto> entry : locationSyncDataMap.entrySet()) {
					List<String> destinations = new ArrayList<>();
					destinations.add(entry.getKey());
					syncDataService.publishConfigMessagesToQueue(entry.getValue());
				}
			}
		} else {
			throw new ServiceException(ConfigConstants.LOCATION_MAPPING_NOT_ALLOWED_FOR_THIS_RULE_TYPE,
					ConfigConstants.ERR_CONFIG_006);
		}
		return ruleLocationUpdateDto;
	}

	/**
	 * @param ruleMetadataRepo
	 * @param ruleType
	 * @param ruleId
	 * @param ruleLocationUpdateDto
	 * @return Map<String, List<SyncData>>
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveRuleLocationAndStaging(String ruleType, Integer ruleId,
			RuleLocationUpdateDto ruleLocationUpdateDto) {
		RuleMasterDao ruleMaster = ruleUtilService.validateRuleTypeAndRuleId(ruleType, ruleId);

		Set<String> addLocations = ruleLocationUpdateDto.getAddLocations();
		Set<String> removeLocations = ruleLocationUpdateDto.getRemoveLocations();
		Set<String> overwriteLocations = ruleLocationUpdateDto.getOverwriteLocations();

		List<RuleLocationMappingDaoExt> ruleLocationList = new ArrayList<>();

		List<RuleLocationMappingDaoExt> deleteMappingList = new ArrayList<>();

		// delete locations
		if (!CollectionUtils.isEmpty(removeLocations)) {

			List<RuleLocationMappingDaoExt> locationDaoList = ruleLocationMappingRepository
					.findByRuleTypeAndLocationCode(ruleType, removeLocations);
			locationDaoList.forEach(locationDao -> {
				// add sync time
				locationDao.setSyncTime(new Date().getTime());
				deleteMappingList.add(locationDao);
			});
			ruleLocationMappingRepository.deleteAll(locationDaoList);
		}

		// overwrite locations
		if (!CollectionUtils.isEmpty(overwriteLocations)) {

			List<RuleLocationMappingDaoExt> locationDaoList = ruleLocationMappingRepository
					.findByRuleTypeAndLocationCode(ruleType, overwriteLocations);
			locationDaoList.forEach(locationDao -> {
				// add sync time
				locationDao.setSyncTime(new Date().getTime());
				deleteMappingList.add(locationDao);
			});
			ruleLocationMappingRepository.deleteAll(locationDaoList);
			ruleLocationMappingRepository.flush();
			saveLocationsToDb(overwriteLocations, ruleLocationList, ruleMaster, ruleLocationUpdateDto);
		}

		// add locations
		if (!CollectionUtils.isEmpty(addLocations))

			saveLocationsToDb(addLocations, ruleLocationList, ruleMaster, ruleLocationUpdateDto);

		ruleLocationList = ruleLocationMappingRepository.saveAll(ruleLocationList);

		Set<String> locationSet = new HashSet<>();
		ruleLocationList.forEach(ruleLocation -> locationSet.add(ruleLocation.getLocationCode()));
		deleteMappingList.forEach(ruleLocation -> locationSet.add(ruleLocation.getLocationCode()));
		Map<String, List<SyncData>> syncDataMap = new HashMap<>();
		if (!deleteMappingList.isEmpty())
			getdeleteListSyncData(deleteMappingList, locationSet, syncDataMap);
		if (!ruleLocationList.isEmpty())
			getAddListSyncData(ruleLocationList, locationSet, syncDataMap);
		Map<String, SyncStagingDto> locationSyncDataMap = new HashMap<>();
		for (Map.Entry<String, List<SyncData>> entry : syncDataMap.entrySet()) {
			List<String> destinations = new ArrayList<>();
			destinations.add(entry.getKey());
			locationSyncDataMap.put(entry.getKey(), ruleService.saveToSyncStaging(entry.getValue(),
					ConfigServiceOperationCodes.RULE_LOC_MAPPING, destinations, DestinationType.SELECTIVE.toString()));
		}
		return locationSyncDataMap;
	}

	/**
	 * @param ruleLocationList
	 * @param locationSet
	 * @param syncDataMap
	 */
	private void getdeleteListSyncData(List<RuleLocationMappingDaoExt> deleteMappingList, Set<String> locationSet,
			Map<String, List<SyncData>> syncDataMap) {
		for (String location : locationSet) {
			deleteMappingList.forEach(ruleLoc -> {
				if (ruleLoc.getLocationCode().equals(location)) {
					if (syncDataMap.containsKey(location)) {
						RuleLocationMappingSyncDtoExt syncDtoExt = new RuleLocationMappingSyncDtoExt(ruleLoc);
						syncDataMap.get(location).add(DataSyncUtil.createSyncData(syncDtoExt, 0));
					} else {
						List<SyncData> syncDatas = new ArrayList<>();
						RuleLocationMappingSyncDtoExt syncDtoExt = new RuleLocationMappingSyncDtoExt(ruleLoc);
						syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 0));
						syncDataMap.put(location, syncDatas);
					}
				}
			});
		}
	}

	/**
	 * @param ruleLocationList
	 * @param deleteMappingList
	 * @param locationSet
	 * @param syncDataMap
	 */
	private void getAddListSyncData(List<RuleLocationMappingDaoExt> ruleLocationList, Set<String> locationSet,
			Map<String, List<SyncData>> syncDataMap) {
		for (String location : locationSet) {
			ruleLocationList.forEach(ruleLoc -> {
				if (ruleLoc.getLocationCode().equals(location)) {
					if (syncDataMap.containsKey(location)) {
						RuleLocationMappingSyncDtoExt syncDtoExt = new RuleLocationMappingSyncDtoExt(ruleLoc);
						syncDataMap.get(location).add(DataSyncUtil.createSyncData(syncDtoExt, 1));
					} else {
						List<SyncData> syncDatas = new ArrayList<>();
						RuleLocationMappingSyncDtoExt syncDtoExt = new RuleLocationMappingSyncDtoExt(ruleLoc);
						syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 1));
						syncDataMap.put(location, syncDatas);
					}
				}
			});
		}
	}

	/**
	 * @param overwriteLocations
	 * @param ruleLocationList
	 * @param ruleMaster
	 * @param ruleLocationUpdateDto
	 */
	private void saveLocationsToDb(Set<String> locationList, List<RuleLocationMappingDaoExt> ruleLocationList,
			RuleMasterDao ruleMaster, RuleLocationUpdateDto ruleLocationUpdateDto) {
		locationList.forEach(location -> {
			RuleLocationMappingDaoExt ruleLocMapping = new RuleLocationMappingDaoExt();
			ruleLocMapping.setRuleMasterDao(ruleMaster);
			ruleLocMapping.setLocationCode(location);
			if (ruleLocationUpdateDto.getValidity() != null) {
				if (ruleLocationUpdateDto.getValidity().getOfferStartDate() != null)
					ruleLocMapping.setOfferStartDate(ruleLocationUpdateDto.getValidity().getOfferStartDate());
				if (ruleLocationUpdateDto.getValidity().getOfferEndDate() != null)
					ruleLocMapping.setOfferEndDate(ruleLocationUpdateDto.getValidity().getOfferEndDate());
			}
			// add sync time
			ruleLocMapping.setSyncTime(new Date().getTime());
			ruleLocationList.add(ruleLocMapping);
		});

	}

	/**
	 * This method will return the list of Rule Location mapping details based on
	 * RuleType and ruleId.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @return ListResponse<ConfigLocationDto>
	 */
	@Override
	public ListResponse<RuleLocationDto> listRuleLocationMapping(String ruleType, Integer ruleId) {

		RuleMasterDao configMaster = ruleUtilService.setRuleMasterObject(ruleType, ruleId);

		RuleLocationMappingDaoExt ruleLocDao = new RuleLocationMappingDaoExt();
		ruleLocDao.setRuleMasterDao(configMaster);

		List<RuleLocationMappingDaoExt> ruleLocList = ruleLocationMappingRepository.findByRuleTypeAndRuleId(ruleType,
				ruleId);

		if (ruleLocList == null || ruleLocList.isEmpty()) {
			throw new ServiceException(
					ConfigConstants.NO_RULE_LOCATION_MAPPING_FOUND_FOR_REQUESTED_RULE_TYPE_AND_RULE_ID,
					ConfigConstants.ERR_CONFIG_002);
		}
		List<RuleLocationDto> ruleLocDtoList = new ArrayList<>();
		for (RuleLocationMappingDaoExt location : ruleLocList) {
			RuleLocationDto ruleLocationDto = new RuleLocationDto();
			ruleLocationDto.setRuleId(location.getRuleMasterDao().getRuleIdDao().getRuleId());
			ruleLocationDto.setRuleType(location.getRuleMasterDao().getRuleIdDao().getRuleType());
			ruleLocationDto.setLocationCode(location.getLocationCode());
			ruleLocDtoList.add(ruleLocationDto);
		}
		return new ListResponse<>(ruleLocDtoList);
	}

	/**
	 * 
	 * 
	 * /** This method will return the list of Rule Details details based on the
	 * ruleType.
	 * 
	 * @param ruleType
	 * @param pageable
	 * @param ruleReqMapListDto
	 * @return PagedRestResponse<List<ConfigMasterDto>>
	 */
	@Override
	public PagedRestResponse<List<RuleMasterResponseDto>> listRuleDetailsBasedOnFilters(
			RuleRequestMappingListDto ruleReqMapListDto, Boolean isExactSearch, Pageable pageable) {

		Page<RuleMasterDao> ruleListPage = null;
		
		ruleListPage = ruleUtilService.getRuleTypesBasedOnFilter(ruleReqMapListDto.getRuleType(), ruleReqMapListDto,
				pageable,isExactSearch);

		List<RuleMasterResponseDto> ruleDtoList = new ArrayList<>();
		ruleListPage.forEach(rule -> {
			RuleMasterResponseDto ruleDto = (RuleMasterResponseDto) MapperUtil.getObjectMapping(rule,
					new RuleMasterResponseDto());
			ruleDto.setRuleId(rule.getRuleIdDao().getRuleId());
			ruleDto.setRuleType(rule.getRuleIdDao().getRuleType());

			if (rule.getRuleDetails() != null) {
				Object obj = MapperUtil.getJsonFromString(rule.getRuleDetails());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				ruleDto.setRuleDetails(jsonData);
				ruleDtoList.add(ruleDto);
			} else
				ruleDtoList.add(ruleDto);
		});
		return new PagedRestResponse<>(ruleDtoList, ruleListPage);

	}

	/**
	 * This method will create/remove mapping between Rule and Products.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @param ruleProductDto
	 * @return RuleProductDto
	 */
	@Override
	public RuleProductDetailsDto ruleProductMapping(String ruleType, Integer ruleId,
			RuleProductUpdateDto ruleProductDto) {

		RuleMetadataDao ruleMetadataRepo = ruleMetadataRepository.findByRuleType(ruleType);

		if (ruleMetadataRepo.getProductCategoryMapping() || ruleMetadataRepo.getProductGroupMapping()) {

			Set<AddRuleProductDto> productSet = ruleProductDto.getAddProducts();
			List<RuleProductDaoExt> ruleProductList = new ArrayList<>();

			SyncStagingDto syncStagingDto = ruleService.saveRuleProductAndStaging(ruleProductList, productSet, ruleType,
					ruleId, ruleMetadataRepo, ruleProductDto);
			if (syncStagingDto != null)
				syncDataService.publishConfigMessagesToQueue(syncStagingDto);
			return ruleUtilService.getRuleProductResponse(ruleProductList, ruleType, ruleId);
		}

		else {
			throw new ServiceException(ConfigConstants.PRODUCT_MAPPING_NOT_ALLOWED_FOR_THIS_RULE_TYPE,
					ConfigConstants.ERR_CONFIG_007);
		}

	}

	/**
	 * @param ruleProductList
	 * @param addProductSet
	 * @param ruleType
	 * @param ruleId
	 * @param ruleMetadataRepo
	 * @param ruleProductDto
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveRuleProductAndStaging(List<RuleProductDaoExt> ruleProductList,
			Set<AddRuleProductDto> addProductSet, String ruleType, Integer ruleId, RuleMetadataDao ruleMetadataRepo,
			RuleProductUpdateDto ruleProductDto) {

		List<RuleProductDaoExt> deleteRuleProductList = new ArrayList<>();

		if (ruleProductDto.getRemoveProducts() != null && !ruleProductDto.getRemoveProducts().isEmpty()) {
			List<String> ruleProductIds = ruleProductDto.getRemoveProducts().stream().collect(Collectors.toList());

			if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name()))
				rivaahProductMappingRepository.deleteRivaahProductDetails(ruleProductIds);

			deleteRuleProductList = ruleProductMappingRepository.getRuleProductDetails(ruleProductIds);
			deleteRuleProductList.forEach(ruleProduct -> ruleProduct.setSyncTime(new Date().getTime()));
			ruleProductMappingRepository.deleteRuleProductDetails(ruleProductIds);
		}

		Set<UpdateRuleProductDto> updateProducts = ruleProductDto.getUpdateProducts();
		List<SlabDto> slabList = new ArrayList<>();

		Map<String, List<SlabDto>> mapSlab = new HashMap<>();
		if (!CollectionUtils.isEmpty(updateProducts)) {
			validateRivaahDuplication(ruleId, ruleType, updateProducts);

			Map<String, UpdateRuleProductDto> productMap = new HashMap<>();
			updateProducts.forEach(product -> productMap.put(product.getId(), product));

			Map<String, List<UpdateRuleProductDto>> updateProductMap = updateProducts.stream()
					.filter(x -> x.getRangeId() != null)
					.collect(Collectors.groupingBy(UpdateRuleProductDto::getProductGroupCode,
							Collectors.mapping(obj -> obj, Collectors.toList())));

			updateProductMap.forEach((productGroupCode, updateProductList) -> {
				if (!CollectionUtils.isEmpty(updateProductList)) {

					updateProductList.forEach(rangeObject -> createRangeObjectForValidation(rangeObject.getRangeId(),
							rangeObject.getRowId(), productGroupCode, mapSlab));
				}
			});

			List<RuleProductDaoExt> productDaoList = ruleProductMappingRepository.findByIdIn(productMap.keySet());

			if (!CollectionUtils.isEmpty(productDaoList)) {

				productDaoList.forEach(productDao ->

				getRuleProductDao(productDao, productMap.get(productDao.getId()), ruleProductList, slabList));

			}

		}

		if (addProductSet != null && !addProductSet.isEmpty()) {

			validateJson(addProductSet, ruleType, ruleMetadataRepo, mapSlab);

//			validateRivaahDuplication(ruleId, ruleType, addProductSet, null);

			addProductSet.forEach(
					addRule -> ruleProductList.add(ruleUtilService.getRuleDetailDao(addRule, ruleType, ruleId)));
		}

		if (!CollectionUtils.isEmpty(mapSlab)) {
			mapSlab.forEach((productGroupCode, rangeList) -> {
				if (!CollectionUtils.isEmpty(rangeList)) {
					rangeList.forEach(rangeObject -> {

						try {
							SlabValidator.createAndValidateSlabObject(rangeList, SlabDto.class, "fromRange", "toRange",
									"rowId");
						}

						catch (ServiceException e) {
							throw new ServiceException(e.getMessage(), "ERR-CONFIG-005",
									"Range overlap for ProductGroupCode-" + productGroupCode);
						}

					});

				}
			});

		}

		List<RuleProductDaoExt> ruleResponse = ruleProductMappingRepository.saveAll(ruleProductList);

		List<SyncData> syncDatas = new ArrayList<>();
		SyncStagingDto syncStagingDto = null;
		RuleProductMappingSyncDtoExt syncDtoExt = new RuleProductMappingSyncDtoExt();
		List<String> destinations = new ArrayList<>();
		if (!deleteRuleProductList.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(deleteRuleProductList), 0));
		if (!ruleResponse.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(ruleResponse), 1));
		if (!syncDatas.isEmpty())
			syncStagingDto = ruleService.saveToSyncStaging(syncDatas, ConfigServiceOperationCodes.RULE_PGRP_MAPPING,
					destinations, DestinationType.ALL.toString());
		return syncStagingDto;
	}

	private void validateRivaahDuplication(Integer ruleId, String ruleType, Set<UpdateRuleProductDto> updateProducts) {
		if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name())) {
			List<Object> errorList = new ArrayList<>();
			for (UpdateRuleProductDto product : updateProducts) {
				RivaahEligibilityProductMappingDetails configToUpdate = MapperUtil.mapObjToClass(
						product.getRuleDetails().getData(), RivaahEligibilityProductMappingDetails.class);
				List<RuleProductDaoExt> ruleAll = ruleProductMappingRepository
						.findByRuleTypeAndRuleIdAndProductCategoryCode(ruleType, ruleId,
								product.getProductCategoryCode());
				List<List<String>> productMappingList = new ArrayList<>();
				List<RuleProductDaoExt> rulePresent = new ArrayList<>();
				if (!CollectionUtil.isEmpty(ruleAll)) {
					for (RuleProductDaoExt rule : ruleAll) {
						if (!rule.getId().equalsIgnoreCase(product.getId())) {
							rulePresent.add(rule);
							List<RivaahProductMappingDaoExt> rivaahProducts = rivaahProductMappingRepository
									.findAllByProductMap(rule.getId());
							List<String> productGroups = new ArrayList<>();
							if (!CollectionUtil.isEmpty(rivaahProducts)) {
								for (RivaahProductMappingDaoExt productRivaah : rivaahProducts) {
									productGroups.add(productRivaah.getProductGroupCode());
								}
							}
							if (!CollectionUtil.isEmpty(productGroups)) {
								productMappingList.add(productGroups);
							}
						}
					}
					if (!CollectionUtil.isEmpty(rulePresent)) {
						rulePresent.forEach(rule -> {
							if (rule.getFieldDetails() != null) {
								JsonData eligibilityJsonData = MapperUtil.getObjectMapperInstance().convertValue(
										MapperUtil.getJsonFromString(rule.getFieldDetails()), JsonData.class);
								RivaahEligibilityProductMappingDetails eligibility = MapperUtil.mapObjToClass(
										eligibilityJsonData.getData(), RivaahEligibilityProductMappingDetails.class);
								List<RivaahProductMappingDaoExt> rivaahProducts = rivaahProductMappingRepository
										.findAllByProductMap(product.getId());
								if (eligibility != null && configToUpdate != null
										&& !CollectionUtil.isEmpty(rivaahProducts)) {
									configToUpdate.getEleventhDigit().forEach(eleven -> {
										if (eligibility.getEleventhDigit().contains(eleven)) {
											rivaahProducts.forEach(rivaahProduct -> {
												productMappingList.forEach(productsMapped -> {
													if (productsMapped.contains(rivaahProduct.getProductGroupCode())) {
														RivaahErrorDto error = new RivaahErrorDto();
														error.setProductCategoryCode(product.getProductCategoryCode());
														error.setProductGroupCode(rivaahProduct.getProductGroupCode());
														error.setEleventhDigit(eleven);
														errorList.add(error);
													}
												});
											});
										}
									});
								}
							}
						});
					}
				}
				if (!CollectionUtils.isEmpty(errorList))
					throw new ServiceException(
							"Configuration is already present for the selected combination of productCategoryCode, productGroupCode and 11thDigit(s)",
							"ERR-CONFIG-179", errorList);
			}
		}
	}

//	private void validateRivaahDuplication(Integer ruleId, String ruleType, Set<AddRuleProductDto> addProductSet,
//			Set<UpdateRuleProductDto> updateProducts) {
//		List<Object> errorList = new ArrayList<>();
//		if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name())) {
//			if (addProductSet != null) {
//				for (AddRuleProductDto product : addProductSet) {
//					RivaahEligibilityProductMappingDetails configToadd = MapperUtil.mapObjToClass(
//							product.getRuleDetails().getData(), RivaahEligibilityProductMappingDetails.class);
//					List<RuleProductDaoExt> rulePresent = ruleProductMappingRepository
//							.findByRuleTypeAndRuleIdAndProductCategoryCode(ruleType, ruleId,
//									product.getProductCategoryCode());
//					if (!CollectionUtils.isEmpty(rulePresent)) {
//						rulePresent.forEach(rule -> {
//							if (rule.getFieldDetails() != null) {
//								JsonData eligibilityJsonData = MapperUtil.getObjectMapperInstance().convertValue(
//										MapperUtil.getJsonFromString(rule.getFieldDetails()), JsonData.class);
//								RivaahEligibilityProductMappingDetails eligibility = MapperUtil.mapObjToClass(
//										eligibilityJsonData.getData(), RivaahEligibilityProductMappingDetails.class);
//								if (eligibility != null && configToadd != null
//										&& eligibility.getGrammage().compareTo(configToadd.getGrammage()) == 0) {
//									configToadd.getEleventhDigit().forEach(eleven -> {
//										if (eligibility.getEleventhDigit().contains(eleven)) {
//											RivaahErrorDto error = new RivaahErrorDto();
//											error.setProductCategoryCode(product.getProductCategoryCode());
//											error.setEleventhDigit(eleven);
//											errorList.add(error);
//										}
//									});
//								}
//							}
//						});
//					}
//				}
//				if (!CollectionUtils.isEmpty(errorList))
//					throw new ServiceException(
//							"Configuration is already present for the selected combination of productCategoryCode, eleventhDigit and grammage(s)",
//							"ERR-CONFIG-179", errorList);
//			} else {
//				for (UpdateRuleProductDto product : updateProducts) {
//					RivaahEligibilityProductMappingDetails configToUpdate = MapperUtil.mapObjToClass(
//							product.getRuleDetails().getData(), RivaahEligibilityProductMappingDetails.class);
//					List<RuleProductDaoExt> ruleAll = ruleProductMappingRepository
//							.findByRuleTypeAndRuleIdAndProductCategoryCode(ruleType, ruleId,
//									product.getProductCategoryCode());
//					List<RuleProductDaoExt> rulePresent = new ArrayList<>();
//					for (RuleProductDaoExt rule : ruleAll) {
//						if (!rule.getId().equalsIgnoreCase(product.getId()))
//							rulePresent.add(rule);
//					}
//					if (!CollectionUtils.isEmpty(rulePresent)) {
//						rulePresent.forEach(rule -> {
//							if (rule.getFieldDetails() != null) {
//								JsonData eligibilityJsonData = MapperUtil.getObjectMapperInstance().convertValue(
//										MapperUtil.getJsonFromString(rule.getFieldDetails()), JsonData.class);
//								RivaahEligibilityProductMappingDetails eligibility = MapperUtil.mapObjToClass(
//										eligibilityJsonData.getData(), RivaahEligibilityProductMappingDetails.class);
//								if (eligibility != null && configToUpdate != null
//										&& eligibility.getGrammage().compareTo(configToUpdate.getGrammage()) == 0) {
//									configToUpdate.getEleventhDigit().forEach(eleven -> {
//										if (eligibility.getEleventhDigit().contains(eleven)) {
//											RivaahErrorDto error = new RivaahErrorDto();
//											error.setProductCategoryCode(product.getProductCategoryCode());
//											error.setEleventhDigit(eleven);
//											errorList.add(error);
//										}
//									});
//								}
//							}
//						});
//					}
//				}
//				if (!CollectionUtils.isEmpty(errorList))
//					throw new ServiceException(
//							"Configuration is already present for the selected combination of productCategoryCode, eleventhDigit and grammage(s)",
//							"ERR-CONFIG-179", errorList);
//			}
//		}
//	}

	void createRangeObject(String rangeId, Integer rowId, List<SlabDto> slabList) {
		RangeMasterDaoExt rangeMasterDao = rangeService.getRangeMasterDao(rangeId);

		SlabDto slabDto = new SlabDto();
		slabDto.setFromRange(rangeMasterDao.getFromRange());
		slabDto.setToRange(rangeMasterDao.getToRange());
		slabDto.setRowId(rowId);
		slabList.add(slabDto);
	}

	void createRangeObjectForValidation(String rangeId, Integer rowId, String productGroupOrMetalType,
			Map<String, List<SlabDto>> mapSlab) {
		RangeMasterDaoExt rangeMasterDao = rangeService.getRangeMasterDao(rangeId);

		SlabDto slabDto = new SlabDto();
		slabDto.setFromRange(rangeMasterDao.getFromRange());
		slabDto.setToRange(rangeMasterDao.getToRange());
		slabDto.setRowId(rowId);

		if (mapSlab.containsKey(productGroupOrMetalType)) {
			List<SlabDto> slabDtoList = new ArrayList<>(); // immutableCollection issue
			mapSlab.get(productGroupOrMetalType).forEach(record -> slabDtoList.add(record));
			slabDtoList.add(slabDto);
			mapSlab.put(productGroupOrMetalType, slabDtoList);

		} else {
			List<SlabDto> slabDtoList = List.of(slabDto);
			mapSlab.put(productGroupOrMetalType, slabDtoList);
		}
	}

	/**
	 * @param productDao
	 * @param updateRuleProductDto
	 * @param ruleProductList
	 * @param slabList
	 * @param slabList
	 */
	private void getRuleProductDao(RuleProductDaoExt productDao, UpdateRuleProductDto updateRuleProductDto,
			List<RuleProductDaoExt> ruleProductList, List<SlabDto> slabList) {

		productDao = (RuleProductDaoExt) MapperUtil.getObjectMapping(updateRuleProductDto, productDao);
		productDao.setSyncTime(new Date().getTime());
		if (updateRuleProductDto.getRangeId() != null) {
			productDao.setRangeId(getRangeMasterDao(updateRuleProductDto.getRangeId()));
		}

		if (updateRuleProductDto.getRuleDetails() != null) {
			productDao.setFieldDetails(MapperUtil.getStringFromJson(updateRuleProductDto.getRuleDetails()));
		}

		ruleProductList.add(productDao);

	}

	private RangeMasterDao getRangeMasterDao(String rangeId) {
		RangeMasterDao rangeMaster = rangeMasterRepository.findByIdAndIsActiveTrue(rangeId);
		if (rangeMaster == null) {
			throw new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_011,
					ConfigConstants.RANGE_ID + rangeId + " & isActive : false");
		}
		return rangeMaster;
	}

	/**
	 * This method will check whether product is mapped based on RuleType and
	 * RuleId.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @param slabList
	 * @param slabList
	 * @param mapSlab
	 * @param productDto
	 */

	private void validateJson(Set<AddRuleProductDto> productSet, String ruleType, RuleMetadataDao ruleMetadataRepo,
			Map<String, List<SlabDto>> mapSlab) {

		Map<String, List<AddRuleProductDto>> productMap = productSet.stream().filter(x -> x.getRangeId() != null)
				.collect(Collectors.groupingBy(AddRuleProductDto::getProductGroupCode,
						Collectors.mapping(x -> x, Collectors.toList())));

		productMap.forEach((productGroup, reqObjList) -> {
			reqObjList.forEach(addProductObject -> createRangeObjectForValidation(addProductObject.getRangeId(),
					addProductObject.getRowId(), productGroup, mapSlab));

		});

		for (AddRuleProductDto productDto : productSet) {

			if (ruleMetadataRepo.getProductLevelValue()) {
				String productRuleType = ruleType + ConfigConstants.PRODUCT_LEVEL;
				BaseFieldsValidator ruleDto = ruleFactory.getRuleDetails(productRuleType);
				ruleDto.validate(productDto.getRuleDetails());
			}

		}

	}

	/**
	 * This method will return the list of Rule Product mapping details based on
	 * RuleType and ruleId.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @return ListResponse<RuleProductDetailsDto>
	 */
	@Override
	public PagedRestResponse<List<RuleProductDetailsDto>> listRuleProductMapping(String ruleType, Integer ruleId,
			String productGroupCode, String productCategoryCode, Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Page<RuleProductDaoExt> ruleProductList = new PageImpl<>(new ArrayList<>());
		if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name()) && productGroupCode != null) {

			List<RivaahProductMappingDaoExt> rivaahProductList = rivaahProductMappingRepository
					.findByProductGroupCode(productGroupCode);
			if (!CollectionUtil.isEmpty(rivaahProductList)) {
				Set<String> productMappingIds = new HashSet<>();
				rivaahProductList.forEach(rivaah -> productMappingIds.add(rivaah.getRuleProductDao().getId()));
				if (!CollectionUtil.isEmpty(productMappingIds))
					ruleProductList = ruleProductMappingRepository.getRivaahRuleDetails(productMappingIds, pageable);
			}
		} else {
			ruleProductList = ruleProductMappingRepository
					.findByRuleTypeAndRuleIdAndProductGroupCodeAndProductCategoryCodePagination(ruleType, ruleId,
							productGroupCode, productCategoryCode, pageable);
		}
		List<RuleProductDetailsDto> ruleProductDetailsList = new ArrayList<>();
		if (!ruleProductList.isEmpty()) {
			ruleProductList.forEach(ruleProductGrpCat -> {
				RuleProductDetailsDto ruleProductDetailsDto = new RuleProductDetailsDto();
				ruleProductDetailsDto.setRuleId(ruleProductGrpCat.getRuleMasterDao().getRuleIdDao().getRuleId());
				ruleProductDetailsDto.setRuleType(ruleProductGrpCat.getRuleMasterDao().getRuleIdDao().getRuleType());

				List<RuleProductDto> ruleProductDtoList = new ArrayList<>();
				RuleProductDto ruleProductDto = new RuleProductDto();
				ruleProductDto.setId(ruleProductGrpCat.getId());
				if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name())) {
					List<RivaahProductMappingDaoExt> rivaahProductMappingDaoExtList = rivaahProductMappingRepository
							.findAllByProductMap(ruleProductGrpCat.getId());
					if (!CollectionUtil.isEmpty(rivaahProductMappingDaoExtList))
						ruleProductDto.setProductGroupCode(Integer.toString(rivaahProductMappingDaoExtList.size()));
					else
						ruleProductDto.setProductGroupCode("0");
				} else {
					ruleProductDto.setProductGroupCode(ruleProductGrpCat.getProductGroupCode());
				}
				ruleProductDto.setProductCategoryCode(ruleProductGrpCat.getProductCategoryCode());
				if (ruleProductGrpCat.getRangeId() != null) {
					ruleProductDto.setRangeId(ruleProductGrpCat.getRangeId().getId());
				}

				ruleProductDto.setRuleDetails(MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(ruleProductGrpCat.getFieldDetails()), JsonData.class));

				ruleProductDtoList.add(ruleProductDto);
				ruleProductDetailsDto.setRules(ruleProductDtoList);
				ruleProductDetailsList.add(ruleProductDetailsDto);
			});
		}
		return new PagedRestResponse<>(ruleProductDetailsList, ruleProductList);

	}

	/**
	 * This method will return the list of location codes which is already mapped to
	 * ruleId based on location Codes and RuleType,
	 * 
	 * @param RuleType,
	 * @param ruleId,
	 * @return List<MappedConfigResponseDto>
	 */
	@Override
	public ListResponse<RuleLocationDto> getMappedLocationCodes(String ruleType,
			MappedRuleLocationDto ruleLocationDto) {
		List<RuleLocationDto> mappedLocationList = new ArrayList<>();
		if (ruleLocationDto != null) {
			Set<String> includeLocations = CollectionUtil.setNullIfEmpty(ruleLocationDto.getIncludeLocations());

			List<RuleLocationMappingDaoExt> locationCodeDao = ruleLocationMappingRepository
					.findOtherRuleMappedLocationCode(ruleType, ruleLocationDto.getExcludeRuleId(), includeLocations);
			if (!CollectionUtils.isEmpty(locationCodeDao)) {
				for (RuleLocationMappingDaoExt configDao : locationCodeDao) {
					RuleLocationDto responseDto = new RuleLocationDto();
					responseDto.setRuleId(configDao.getRuleMasterDao().getRuleIdDao().getRuleId());
					responseDto.setRuleType(configDao.getRuleMasterDao().getRuleIdDao().getRuleType());
					responseDto.setRuleName(configDao.getRuleMasterDao().getDescription());
					responseDto.setLocationCode(configDao.getLocationCode());
					mappedLocationList.add(responseDto);
				}
			}
		}

		return new ListResponse<>(mappedLocationList);

	}

	@Override
	public ListResponse<MarketMappingResponseDto> updateMarketMapping(Integer ruleId, String ruleType,
			UpdateMarketMappingDto updateMarketMappingDto) {

		List<RuleMarketMappingDaoExt> marketMappingDaoList = new ArrayList<>();

		SyncStagingDto stagingDto = ruleService.saveMarketMappingAndStaging(marketMappingDaoList, ruleId, ruleType,
				updateMarketMappingDto);
		if (stagingDto != null) {
			syncDataService.publishConfigMessagesToQueue(stagingDto);
		}

		return new ListResponse<>(getMarketMappingResponseDto(marketMappingDaoList));
	}

	/**
	 * @param marketMappingDaoList
	 * @param ruleId
	 * @param ruleType
	 * @param updateMarketMappingDto
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveMarketMappingAndStaging(List<RuleMarketMappingDaoExt> marketMappingDaoList,
			Integer ruleId, String ruleType, UpdateMarketMappingDto updateMarketMappingDto) {
		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);

		List<RuleMarketMappingDaoExt> deleteMappingList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(updateMarketMappingDto.getRemoveMarkets()))
			updateMarketMappingDto.getRemoveMarkets().forEach(marketMapping -> {
				List<RuleMarketMappingDaoExt> marketMappingRemoveDaoList = ruleMarketMappingRepository
						.findAllById(updateMarketMappingDto.getRemoveMarkets());

				marketMappingRemoveDaoList.forEach(marketDao -> {
					// add sync time
					marketDao.setSyncTime(new Date().getTime());
					deleteMappingList.add(marketDao);
				});

				ruleMarketMappingRepository.deleteAll(marketMappingRemoveDaoList);
				ruleMarketMappingRepository.flush();

			});

		if (!CollectionUtils.isEmpty(updateMarketMappingDto.getAddMarkets())) {
			if (!ruleMetadataDao.getMarketMapping())
				throw new ServiceException(ConfigConstants.MARKET_MAPPING_NOT_ALLOWED_FOR_THIS_RULE_TYPE,
						ConfigConstants.ERR_CONFIG_073);

			RuleMasterDao configMaster = ruleUtilService.setRuleMasterObject(ruleType, ruleId);
			updateMarketMappingDto.getAddMarkets().forEach(marketCode -> {
				RuleMarketMappingDaoExt ruleMarketMappingDao = new RuleMarketMappingDaoExt();
				ruleMarketMappingDao.setMarketCode(marketCode);
				ruleMarketMappingDao.setRuleMasterDao(configMaster);
				ruleMarketMappingDao.setSyncTime(new Date().getTime());
				marketMappingDaoList.add(ruleMarketMappingDao);
			});
			ruleMarketMappingRepository.saveAll(marketMappingDaoList);
		}
		List<SyncData> syncDatas = new ArrayList<>();
		SyncStagingDto syncStagingDto = null;
		RuleMarketMappingSyncDtoExt syncDtoExt = new RuleMarketMappingSyncDtoExt();
		List<String> destinations = new ArrayList<>();
		if (!deleteMappingList.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(deleteMappingList), 0));
		if (!marketMappingDaoList.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(marketMappingDaoList), 1));
		if (!syncDatas.isEmpty())
			syncStagingDto = ruleService.saveToSyncStaging(syncDatas, ConfigServiceOperationCodes.RULE_MARKET_MAPPING,
					destinations, DestinationType.ALL.toString());
		return syncStagingDto;
	}

	/**
	 * @param marketMappingDaoList
	 * @return
	 */
	private List<MarketMappingResponseDto> getMarketMappingResponseDto(
			List<RuleMarketMappingDaoExt> marketMappingDaoList) {

		List<MarketMappingResponseDto> mappingUpdateResponseDtoList = new ArrayList<>();

		marketMappingDaoList.forEach(marketMappingDao -> {
			MarketMappingResponseDto marketMappingUpdateResponseDto = new MarketMappingResponseDto();
			marketMappingUpdateResponseDto.setMarketCode(marketMappingDao.getMarketCode());
			marketMappingUpdateResponseDto.setRuleId(marketMappingDao.getRuleMasterDao().getRuleIdDao().getRuleId());
			marketMappingUpdateResponseDto
					.setRuleType(marketMappingDao.getRuleMasterDao().getRuleIdDao().getRuleType());
			// interservice call needed for description
			MarketDto marketDto = engineService.getMarketDetails(marketMappingDao.getMarketCode());
			marketMappingUpdateResponseDto.setDescription(marketDto.getDescription());

			mappingUpdateResponseDtoList.add(marketMappingUpdateResponseDto);
		});
		return mappingUpdateResponseDtoList;
	}

	@Override
	public ListResponse<MarketMappingResponseDto> listMarketMapping(Integer ruleId, String ruleType) {
		List<RuleMarketMappingDaoExt> ruleMarketMappingDaoList = ruleMarketMappingRepository
				.findByRuleTypeAndRuleId(ruleType, ruleId);
		if (ruleMarketMappingDaoList == null)
			throw new ServiceException(ConfigConstants.NO_RULE_MARKET_MAPPING_FOUND_FOR_REQUESTED_RULE_TYPE_AND_RULE_ID,
					ConfigConstants.ERR_CONFIG_074);
		return new ListResponse<>(getMarketMappingResponseDto(ruleMarketMappingDaoList));
	}

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param ruleRangeDto
	 * @return
	 */
	@Override
	public RuleRangeResponseDto ruleRangeMapping(@ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive Integer ruleId, @Valid RuleRangeDto ruleRangeDto) {

		RuleMetadataDao ruleMetadataRepo = ruleMetadataRepository.findByRuleType(ruleType);
		List<RuleRangeDaoExt> deleteRuleRangeList = new ArrayList<>();
		if (ruleMetadataRepo.getRangeMapping()) {

			RuleMasterDao ruleMaster = ruleUtilService.validateRuleTypeAndRuleId(ruleType, ruleId);
			if (!CollectionUtils.isEmpty(ruleRangeDto.getRemoveRangeConfigs())) {
				deleteRuleRangeList = rangeMappingRepository.findAllById(ruleRangeDto.getRemoveRangeConfigs());

			}

			List<RuleRangeDaoExt> ruleRangeList = new ArrayList<>();
			Map<String, List<SlabDto>> mapSlab = new HashMap<>();

			if (!CollectionUtils.isEmpty(ruleRangeDto.getUpdateRangeConfigs())) {

				updateRangeDetails(ruleMetadataRepo, ruleMaster, ruleRangeDto.getUpdateRangeConfigs(), ruleRangeList,
						mapSlab);

			}

			if (!CollectionUtils.isEmpty(ruleRangeDto.getAddRangeConfigs())) {

				Map<String, List<AddRuleRangeDto>> rangeMap = ruleRangeDto.getAddRangeConfigs().stream()
						.filter(rangeDto -> rangeDto.getMetalType() != null).collect(Collectors.groupingBy(
								AddRuleRangeDto::getMetalType, Collectors.mapping(obj -> obj, Collectors.toList())));
				
				rangeMap.forEach((k, v) -> v.forEach(rangeObject -> {
					createRangeObjectForValidation(rangeObject.getRangeId(), rangeObject.getRowId(), k, mapSlab);
				}));

				ruleRangeDto.getAddRangeConfigs().forEach(addRange -> {

					validateRangeJson(ruleType, ruleMetadataRepo, addRange);

					RuleRangeDaoExt rangeDao = (RuleRangeDaoExt) MapperUtil.getObjectMapping(addRange,
							new RuleRangeDaoExt());
					if (addRange.getRangeId() != null) {

						rangeDao.setRangeId(rangeService.getActiveRangeId(addRange.getRangeId()));
					}
					rangeDao.setRangeDetails(MapperUtil.getJsonString(addRange.getRangeDetails()));
					rangeDao.setRuleMasterDao(ruleMaster);
					rangeDao.setSyncTime(new Date().getTime());
					ruleRangeList.add(rangeDao);
				});
			}

			if (!CollectionUtils.isEmpty(mapSlab)) {

				mapSlab.forEach((metalType, slabList1) -> {

					if (!CollectionUtils.isEmpty(slabList1)) {

						try {
							SlabValidator.createAndValidateSlabObject(slabList1, SlabDto.class, "fromRange", "toRange",
									"rowId");
						} catch (ServiceException e) {
							throw new ServiceException(e.getMessage(), "ERR-CONFIG-005",
									"Range Overlap for MetalType -" + metalType);
						}

					}

				});

			}

			SyncStagingDto syncStagingDto = ruleService.ruleRangeSaveOrDeleteAndStaging(ruleRangeList,
					deleteRuleRangeList);
			if (syncStagingDto != null)
				syncDataService.publishConfigMessagesToQueue(syncStagingDto);

			return ruleUtilService.getRuleRangeResponse(ruleMaster, ruleRangeList);
		} else {
			throw new ServiceException(ConfigConstants.RANGE_MAPPING_NOT_APPLICABLE, ConfigConstants.ERR_CONFIG_077);
		}
	}

	/**
	 * @param ruleRangeList
	 * @param deleteRuleRangeList
	 * @return
	 */
	@Transactional
	public SyncStagingDto ruleRangeSaveOrDeleteAndStaging(List<RuleRangeDaoExt> ruleRangeList,
			List<RuleRangeDaoExt> deleteRuleRangeList) {
		List<SyncData> syncDatas = new ArrayList<>();
		RuleRangeSyncDtoExt syncDtoExt = new RuleRangeSyncDtoExt();
		if (!deleteRuleRangeList.isEmpty()) {
			rangeMappingRepository.deleteAll(deleteRuleRangeList);
			rangeMappingRepository.flush();
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(deleteRuleRangeList), 0));
		}
		if (!ruleRangeList.isEmpty()) {
			ruleRangeList = rangeMappingRepository.saveAll(ruleRangeList);
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(ruleRangeList), 1));
		}
		SyncStagingDto syncStagingDto = null;
		List<String> destinations = new ArrayList<>();
		if (!syncDatas.isEmpty())
			syncStagingDto = ruleService.saveToSyncStaging(syncDatas, ConfigServiceOperationCodes.RULE_RANGE_MAPPING,
					destinations, DestinationType.ALL.toString());
		return syncStagingDto;
	}

	/**
	 * @param ruleType
	 * @param ruleMetadataRepo
	 * @param addRange
	 */
	private void validateRangeJson(String ruleType, RuleMetadataDao ruleMetadataRepo, AddRuleRangeDto addRange) {
		if (ruleMetadataRepo.getRangeLevelValue()) {
			String rangeRuleType = ruleType + ConfigConstants.RANGE_LEVEL;
			BaseFieldsValidator ruleDto = ruleFactory.getRuleDetails(rangeRuleType);
			ruleDto.validate(addRange.getRangeDetails());
		}
	}

	/**
	 * @param ruleMetadataRepo
	 * @param ruleMaster
	 * @param ruleType
	 * @param ruleId
	 * @param updateRangeConfigs
	 * @param ruleRangeList
	 * @param mapSlab
	 */
	private void updateRangeDetails(RuleMetadataDao ruleMetadataRepo, RuleMasterDao ruleMaster,
			List<UpdateRuleRangeDto> updateRangeConfigs, List<RuleRangeDaoExt> ruleRangeList,
			Map<String, List<SlabDto>> mapSlab) {
		Map<String, List<UpdateRuleRangeDto>> rangeMap = updateRangeConfigs.stream()
				.filter(x -> x.getMetalType() != null).collect(Collectors.groupingBy(UpdateRuleRangeDto::getMetalType,
						Collectors.mapping(obj -> obj, Collectors.toList())));
		// Map<String, List<AddRuleRangeDto>> rangeMap = null;

		rangeMap.forEach((k, v) -> {
			v.forEach(rangeObject -> createRangeObjectForValidation(rangeObject.getRangeId(), rangeObject.getRowId(), k,
					mapSlab));
		});

		Map<String, UpdateRuleRangeDto> requestMap = new HashMap<>();
		updateRangeConfigs.forEach(updateDto -> {
			requestMap.put(updateDto.getId(), updateDto);

			AddRuleRangeDto addRangeDto = (AddRuleRangeDto) MapperUtil.getObjectMapping(updateDto,
					new AddRuleRangeDto());
			validateRangeJson(ruleMaster.getRuleIdDao().getRuleType(), ruleMetadataRepo, addRangeDto);

		});

		List<RuleRangeDaoExt> rangeDaoList = rangeMappingRepository.findAllById(requestMap.keySet());
		if (!CollectionUtils.isEmpty(rangeDaoList)) {

			rangeDaoList.forEach(rangeDao -> {

				UpdateRuleRangeDto rangeUpdateDto = requestMap.get(rangeDao.getId());
				RuleRangeDaoExt ruleRangeDao = (RuleRangeDaoExt) MapperUtil.getObjectMapping(rangeUpdateDto, rangeDao);

				if (rangeUpdateDto.getRangeId() != null) {

					ruleRangeDao.setRangeId(rangeService.getActiveRangeId(rangeUpdateDto.getRangeId()));
				}

				ruleRangeDao.setRangeDetails(MapperUtil.getJsonString(rangeUpdateDto.getRangeDetails()));
				rangeDao.setRuleMasterDao(ruleMaster);
				rangeDao.setSyncTime(new Date().getTime());
				ruleRangeList.add(rangeDao);
			});

		}
	}

	@Override
	public PagedRestResponse<List<RuleRangeResponseDto>> getRuleRangeMapping(
			@ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType, @Positive Integer ruleId, Boolean isPageable,
			Pageable pageable) {

		RuleMasterDao ruleMaster = ruleUtilService.validateRuleTypeAndRuleId(ruleType, ruleId);

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Page<RuleRangeDaoExt> rangeDaoList = rangeMappingRepository.findAllByRuleIdAndRuleType(ruleId, ruleType,
				pageable);
		List<RuleRangeResponseDto> rangeResponseList = new ArrayList<>();
		if (!rangeDaoList.isEmpty()) {
			rangeDaoList.forEach(rangeDao -> {

				RuleRangeResponseDto rangeResponseDto = new RuleRangeResponseDto();
				rangeResponseDto.setRuleId(ruleMaster.getRuleIdDao().getRuleId());
				rangeResponseDto.setRuleType(ruleMaster.getRuleIdDao().getRuleType());

				List<RuleRangeDetailsDto> rangeDetailsList = new ArrayList<>();

				RuleRangeDetailsDto rangeDetail = (RuleRangeDetailsDto) MapperUtil.getObjectMapping(rangeDao,
						new RuleRangeDetailsDto());
				if (rangeDao.getRangeId() != null) {
					rangeDetail.setRangeId(rangeDao.getRangeId().getId());
				}
				rangeDetail.setRuleDetails(MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(rangeDao.getRangeDetails()), JsonData.class));

				rangeDetailsList.add(rangeDetail);
				rangeResponseDto.setRules(rangeDetailsList);
				rangeResponseList.add(rangeResponseDto);
			});
		}

		return new PagedRestResponse<>(rangeResponseList, rangeDaoList);

	}

	@Override
	public ListResponse<RivaahProductMappingResponse> rivaahProductMapping(String ruleType, Integer ruleId,
			String productId, RivaahProductMappingDto rivaahProductDto) {
		List<RivaahProductMappingDaoExt> rivaahProductMappingDaoExtList = new ArrayList<>();
		List<RivaahProductMappingDaoExt> productListDelete = new ArrayList<>();
		List<RivaahProductMappingResponse> rivaahProductMappingResponseList = new ArrayList<>();
		ruleUtilService.validateRuleTypeAndRuleId(ruleType, ruleId);

		RuleProductDaoExt ruleProductDao = ruleProductMappingRepository.findById(productId)
				.orElseThrow(() -> new ServiceException(ConfigConstants.INVALID_PRODUCT_ID, "ERR-CONFIG-180"));

		return rivaahProductMappingTransactional(rivaahProductDto, ruleProductDao, rivaahProductMappingDaoExtList,
				productListDelete, rivaahProductMappingResponseList);

	}

	@Transactional
	public ListResponse<RivaahProductMappingResponse> rivaahProductMappingTransactional(
			RivaahProductMappingDto rivaahProductDto, RuleProductDaoExt ruleProductDao,
			List<RivaahProductMappingDaoExt> rivaahProductMappingDaoExtList,
			List<RivaahProductMappingDaoExt> productListDelete,
			List<RivaahProductMappingResponse> rivaahProductMappingResponseList) {
		if (!CollectionUtils.isEmpty(rivaahProductDto.getRemoveProducts())) {
			productListDelete = rivaahProductMappingRepository.findAllById(rivaahProductDto.getRemoveProducts());
			if (!CollectionUtil.isEmpty(productListDelete)) {
				rivaahProductMappingRepository.deleteAll(productListDelete);
				rivaahProductMappingRepository.flush();
			}
		}
		if (!CollectionUtils.isEmpty(rivaahProductDto.getAddProducts())) {

			validateDuplicateRivaahMapping(ruleProductDao, rivaahProductDto.getAddProducts());

			for (String productGroupCode : rivaahProductDto.getAddProducts()) {
				RivaahProductMappingDaoExt rivaahProductMappingDao = new RivaahProductMappingDaoExt();
				rivaahProductMappingDao.setProductGroupCode(productGroupCode);
				rivaahProductMappingDao.setRuleProductDao(ruleProductDao);
				rivaahProductMappingDaoExtList.add(rivaahProductMappingDao);
			}
			try {
				rivaahProductMappingDaoExtList = rivaahProductMappingRepository.saveAll(rivaahProductMappingDaoExtList);
				rivaahProductMappingRepository.flush();
			} catch (DataIntegrityViolationException e) {
				throw new ServiceException(ConfigConstants.INVALID_PRODUCT_GROUP, ConfigConstants.ERR_CONFIG_120);
			} catch (Exception ex) {
				throw ex;
			}
			for (RivaahProductMappingDaoExt product : rivaahProductMappingDaoExtList) {
				RivaahProductMappingResponse rivaahProductMappingResponse = new RivaahProductMappingResponse();
				rivaahProductMappingResponse.setId(product.getId());
				rivaahProductMappingResponse.setProductGroupCode(product.getProductGroupCode());
				rivaahProductMappingResponse.setProductCategory(ruleProductDao.getProductCategoryCode());
				rivaahProductMappingResponseList.add(rivaahProductMappingResponse);
			}
		}
		SyncStagingDto syncStagingDto = rivaahProductSyncStaging(productListDelete, rivaahProductMappingDaoExtList);
		if (syncStagingDto != null)
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		return new ListResponse<>(rivaahProductMappingResponseList);

	}

	private void validateDuplicateRivaahMapping(RuleProductDaoExt ruleProductDao, Set<String> productGroupCodes) {
		List<RuleProductDaoExt> ruleAll = ruleProductMappingRepository.findByRuleTypeAndRuleIdAndProductCategoryCode(
				RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name(), 1, ruleProductDao.getProductCategoryCode());
		JsonData eligibilityJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(ruleProductDao.getFieldDetails()), JsonData.class);
		RivaahEligibilityProductMappingDetails eligibilityMaster = MapperUtil.mapObjToClass(eligibilityJson.getData(),
				RivaahEligibilityProductMappingDetails.class);
		List<Object> errorList = new ArrayList<>();
		if (eligibilityMaster != null) {
			List<RuleProductDaoExt> rulePresent = new ArrayList<>();
			if (!CollectionUtil.isEmpty(ruleAll)) {
				for (RuleProductDaoExt rule : ruleAll) {
					if (!rule.getId().equalsIgnoreCase(ruleProductDao.getId()))
						rulePresent.add(rule);
				}
			}
			if (!CollectionUtil.isEmpty(rulePresent)) {
				for (RuleProductDaoExt rule : rulePresent) {
					if (rule.getFieldDetails() != null) {
						JsonData eligibilityJsonData = MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getJsonFromString(rule.getFieldDetails()), JsonData.class);
						RivaahEligibilityProductMappingDetails eligibility = MapperUtil.mapObjToClass(
								eligibilityJsonData.getData(), RivaahEligibilityProductMappingDetails.class);
						List<RivaahProductMappingDaoExt> rivaahProducts = rivaahProductMappingRepository
								.findAllByProductMap(rule.getId());
						if (rule.getProductCategoryCode().equalsIgnoreCase(ruleProductDao.getProductCategoryCode())) {
							eligibilityMaster.getEleventhDigit().forEach(eleven -> {
								if (eligibility.getEleventhDigit().contains(eleven)) {
									productGroupCodes.forEach(productGroupCode -> {
										for (RivaahProductMappingDaoExt rivaahProduct : rivaahProducts) {
											if (productGroupCode
													.equalsIgnoreCase(rivaahProduct.getProductGroupCode())) {
												RivaahErrorDto error = new RivaahErrorDto();
												error.setProductCategoryCode(ruleProductDao.getProductCategoryCode());
												error.setProductGroupCode(productGroupCode);
												error.setEleventhDigit(eleven);
												errorList.add(error);
											}
										}
									});
								}
							});
						}
					}
				}
			}
		}
		if (!CollectionUtils.isEmpty(errorList))
			throw new ServiceException(
					"Configuration is already present for the selected combination of productCategoryCode, productGroupCode and 11thDigit(s)",
					"ERR-CONFIG-179", errorList);
	}

	private SyncStagingDto rivaahProductSyncStaging(List<RivaahProductMappingDaoExt> productListDelete,
			List<RivaahProductMappingDaoExt> rivaahProductMappingDaoExtList) {
		List<SyncData> syncDatasRivaah = new ArrayList<>();
		SyncStagingDto syncStagingDto = null;
		RivaahProductMappingSyncDtoExt syncDtoProductRivaahExt = new RivaahProductMappingSyncDtoExt();
		List<String> destinations = new ArrayList<>();
		if (!productListDelete.isEmpty())
			syncDatasRivaah
					.add(DataSyncUtil.createSyncData(syncDtoProductRivaahExt.getSyncDtoExtList(productListDelete), 0));
		if (!rivaahProductMappingDaoExtList.isEmpty())
			syncDatasRivaah.add(DataSyncUtil
					.createSyncData(syncDtoProductRivaahExt.getSyncDtoExtList(rivaahProductMappingDaoExtList), 1));
		if (!syncDatasRivaah.isEmpty())
			syncStagingDto = ruleService.saveToSyncStaging(syncDatasRivaah,
					ConfigServiceOperationCodes.RIVAAH_PGRP_MAPPING, destinations, DestinationType.ALL.toString());
		return syncStagingDto;
	}

	@Override
	public ListResponse<RivaahProductMappingResponse> listRivaahProductMapping(String ruleType, Integer ruleId,
			String productId) {
		ruleUtilService.validateRuleTypeAndRuleId(ruleType, ruleId);
		List<RivaahProductMappingResponse> rivaahProductMappingResponseList = new ArrayList<>();
		RuleProductDaoExt ruleProductDao = ruleProductMappingRepository.findById(productId)
				.orElseThrow(() -> new ServiceException(ConfigConstants.INVALID_PRODUCT_ID, "ERR-CONFIG-180"));
		List<RivaahProductMappingDaoExt> rivaahProductMappingDaoExtList = rivaahProductMappingRepository
				.findAllByProductMap(ruleProductDao.getId());
		if (rivaahProductMappingDaoExtList != null && !rivaahProductMappingDaoExtList.isEmpty()) {
			rivaahProductMappingDaoExtList.forEach(productMapping -> {
				RivaahProductMappingResponse rivaahProductMappingResponse = new RivaahProductMappingResponse();
				rivaahProductMappingResponse.setId(productMapping.getId());
				rivaahProductMappingResponse.setProductGroupCode(productMapping.getProductGroupCode());
				rivaahProductMappingResponse.setProductCategory(ruleProductDao.getProductCategoryCode());
				rivaahProductMappingResponseList.add(rivaahProductMappingResponse);
			});
		}
		return new ListResponse<>(rivaahProductMappingResponseList);
	}

	@Override
	public PagedRestResponse<List<RivaahRuleLocationDto>> listRivaahLocationMapping(String ruleType, Integer ruleId,
			RivaahLocationFilterDto locationCodeFilter, Pageable pageable) {
		RuleMasterDao configMaster = ruleUtilService.setRuleMasterObject(ruleType, ruleId);

		RuleLocationMappingDaoExt ruleLocDao = new RuleLocationMappingDaoExt();
		ruleLocDao.setRuleMasterDao(configMaster);

		Date offerStart = locationCodeFilter.getOfferStartDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getOfferStartDate());
		Date offerEnd = locationCodeFilter.getOfferEndDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getOfferEndDate());

		Page<RuleLocationMappingDaoExt> ruleLocList = ruleLocationMappingRepository.findRivaahLocationDetails(ruleType,
				ruleId, offerStart, offerEnd, locationCodeFilter.getLocationCode(), pageable);
		List<RivaahRuleLocationDto> ruleLocDtoList = new ArrayList<>();
		if (ruleLocList == null || ruleLocList.isEmpty()) {
			return new PagedRestResponse<>(ruleLocDtoList, ruleLocList);
		}
		Map<String, LocationCacheDto> responseMap = new HashMap<>();
		LocationCacheRequestDto locationCacheRequestDto = new LocationCacheRequestDto();
		List<String> locationCodes = new ArrayList<>();
		ruleLocList.forEach(location -> locationCodes.add(location.getLocationCode()));
		locationCacheRequestDto.setLocationCodes(locationCodes);

		List<LocationCacheDto> responseList = engineService.getStoreLocationDetails(locationCacheRequestDto)
				.getResults();
		responseList.forEach(location -> responseMap.put(location.getLocationCode(), location));

		for (RuleLocationMappingDaoExt location : ruleLocList) {
			RivaahRuleLocationDto ruleLocationDto = new RivaahRuleLocationDto();
			ruleLocationDto.setRuleId(location.getRuleMasterDao().getRuleIdDao().getRuleId());
			ruleLocationDto.setRuleType(location.getRuleMasterDao().getRuleIdDao().getRuleType());
			ruleLocationDto.setLocationCode(location.getLocationCode());
			if (location.getOfferStartDate() != null)
				ruleLocationDto.setOfferStartDate(location.getOfferStartDate());
			if (location.getOfferEndDate() != null)
				ruleLocationDto.setOfferEndDate(location.getOfferEndDate());
			ruleLocationDto.setDescription(responseMap.get(location.getLocationCode()).getDescription());
			ruleLocationDto.setSubBrandCode(responseMap.get(location.getLocationCode()).getSubBrandCode());
			ruleLocDtoList.add(ruleLocationDto);
		}
		return new PagedRestResponse<>(ruleLocDtoList, ruleLocList);
	}
}