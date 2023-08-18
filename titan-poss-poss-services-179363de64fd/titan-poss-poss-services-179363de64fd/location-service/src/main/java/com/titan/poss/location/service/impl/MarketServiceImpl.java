/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDaoExt;
import com.titan.poss.location.dao.MarketUcpPriceMappingDaoExt;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.MarketMarkupMappingSyncDtoExt;
import com.titan.poss.location.dto.MarketSyncDto;
import com.titan.poss.location.dto.MarketUcpPriceMappingDto;
import com.titan.poss.location.dto.MarketUcpPriceMappingSyncDtoExt;
import com.titan.poss.location.dto.request.MarketMarkupFactors;
import com.titan.poss.location.dto.request.MarketMarkupMappingRequestDto;
import com.titan.poss.location.dto.request.MarketUpdateDto;
import com.titan.poss.location.dto.response.MarketMarkupListMappingResponseDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingResponseDto;
import com.titan.poss.location.dto.response.MarketUcpPriceMappingResponseDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.MarketMarkupMappingRepositoryExt;
import com.titan.poss.location.repository.MarketRepositoryExt;
import com.titan.poss.location.repository.MarketUcpPriceMappingRepositoryExt;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.MarketService;
import com.titan.poss.location.service.ProductService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@PropertySource(value = "classpath:application.properties")
@Service("marketService")
public class MarketServiceImpl implements MarketService {

	private static final String ERR_LOC_010 = "ERR-LOC-010";
	private static final String MARKET_CODE_IS_INACTIVE = "Market Code is inactive.";

	private static final String ERR_LOC_017 = "ERR-LOC-017";
	private static final String PROVIDE_ALL_MATERIAL_CODE = "Provide Factors for all the Material Type Code of market";

	private static final String ERR_LOC_018 = "ERR-LOC-018";
	private static final String DESCRIPTION_ALREADY_EXISTS_WITH_THE_SAME_VALUE = "Description already exists with same value";

	private static final String ERR_LOC_019 = "ERR-LOC-019";
	private static final String NO_RECORDS_FOUND_FOR_REQUESTED_ID = "No Record(s) found for requested id";

	private static final String ERR_LOC_033 = "ERR-LOC-033";
	private static final String NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE = "No Market details found for the requested marketCode";

	private static final String ERR_LOC_083 = "ERR-LOC-083";
	private static final String MARKET_CODE_IS_ALREADY_AVAILABLE = "MarketCode is already available";

	private static final String ERR_LOC_084 = "ERR-LOC-084";
	private static final String MARKET_CODE_AND_PRODUCT_GROUP_CODE_COMBINATION_ALREADY_EXISTS = "Market code and product group code combination already exists.";

	private static final String ERR_SALE_010 = "ERR-SALE-010";
	private static final String PRODUCT_GROUP_CODE_IS_NOT_ACTIVE = "Product Group code is not active.";

	@Value("${country.code}")
	private String countryCode;

	@Value("${marketCache}")
	private String marketCache;

	@Autowired
	private CountryService countryService;

	@Autowired
	private MarketRepositoryExt marketRepository;

	@Autowired
	private MarketMarkupMappingRepositoryExt marketMarkupMappingRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private MarketServiceImpl marketService;

	@Value("#{'${metal.code}'.split(',')}")
	private List<String> metalTypeCode;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private MarketUcpPriceMappingRepositoryExt marketUcpPriceMappingRepositoryExt;

	@Autowired
	private ProductService productService;

	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MarketDto>>
	 */
	@Override
	public PagedRestResponse<List<MarketDto>> listMarket(List<String> marketCodes, Boolean isActive, Boolean isPageable,
			Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Page<MarketDao> marketList;
		List<Boolean> isActiveList = new ArrayList<>();
		if (isActive == null) {
			isActiveList.add(Boolean.TRUE);
			isActiveList.add(Boolean.FALSE);
		} else {
			isActiveList.add(isActive);
		}
		marketList = marketRepository.findAllMarketDetails(marketCodes, isActiveList, pageable);
		List<MarketDto> marketDtoList = new ArrayList<>();
		marketList.forEach(market -> {
			MarketDto marketDto = (MarketDto) MapperUtil.getObjectMapping(market, new MarketDto());
			marketDtoList.add(marketDto);
		});
		return (new PagedRestResponse<>(marketDtoList, marketList));
	}

	private MarketDto getMarketDtoMapping(MarketDao market) {
		return (MarketDto) MapperUtil.getObjectMapping(market, new MarketDto());
	}

	/**
	 * This method will return the Market details based on the marketCode.
	 * 
	 * @param marketCode
	 * @return MarketDto
	 */
	@Override
	public MarketDto getMarket(String marketCode) {
		MarketDao market = marketRepository.findOneByMarketCode(marketCode);
		if (market == null) {
			throw new ServiceException(NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE, ERR_LOC_017);
		}
		return getMarketDtoMapping(market);
	}

	/**
	 * This method will save the Market details.
	 * 
	 * @param marketDto
	 * @return MarketDto
	 */
	@Override
	public MarketDto addMarket(MarketDto marketDto) {
		MarketDao market = marketRepository.findOneByDescription(marketDto.getDescription());
		if (market != null) {
			throw new ServiceException(DESCRIPTION_ALREADY_EXISTS_WITH_THE_SAME_VALUE, ERR_LOC_018);
		}
		MarketDao marketDao = marketRepository.findOneByMarketCode(marketDto.getMarketCode());
		if (marketDao != null) {
			throw new ServiceException(MARKET_CODE_IS_ALREADY_AVAILABLE, ERR_LOC_083);
		}
		market = (MarketDao) MapperUtil.getObjectMapping(marketDto, new MarketDao());
		market.setIsActive(false);
		market.setSrcSyncId(0);
		market.setDestSyncId(0);
		SyncStagingDto data = marketService.saveMarketToDB(market, LocationOperationCodes.MARKET_ADD);
		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);

		return (MarketDto) MapperUtil.getObjectMapping(market, new MarketDto());
	}

	/**
	 * @param market
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveMarketToDB(MarketDao market, String operation) {
		// clearing the cache in engine service
		engineServiceClient.clearCache(marketCache, market.getMarketCode());

		MarketDao savedMarket = marketRepository.save(market);
		// converting to required json string
		List<SyncData> marketSyncDataList = new ArrayList<>();
		MarketSyncDto marketSyncDto = new MarketSyncDto(savedMarket);
		marketSyncDataList.add(DataSyncUtil.createSyncData(marketSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest marketMsgRequest = DataSyncUtil.createMessageRequest(marketSyncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(marketMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(marketMsgRequest);
		// saving to staging table
		SyncStaging marketStagingMsg = new SyncStaging();
		marketStagingMsg.setMessage(requestBody);
		marketStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		marketStagingMsg = locationSyncStagingRepository.save(marketStagingMsg);
		syncStagingDto.setId(marketStagingMsg.getId());
		return syncStagingDto;
	}

	/**
	 * This method will update the Market details.
	 * 
	 * @param marketDto
	 * @return MarketDto
	 */
	@Override
	public MarketDto updateMarket(String marketCode, MarketUpdateDto marketUpdateDto) {
		MarketDao market = marketRepository.findOneByMarketCode(marketCode);

		if (market == null) {
			throw new ServiceException(NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE, ERR_LOC_017);
		}
		if (!StringUtils.isEmpty(marketUpdateDto.getDescription())) {
			MarketDao newMarket = marketRepository.findOneByDescription(marketUpdateDto.getDescription());
			if (newMarket != null) {
				throw new ServiceException(DESCRIPTION_ALREADY_EXISTS_WITH_THE_SAME_VALUE, ERR_LOC_018);
			}
		}

		market = (MarketDao) MapperUtil.getObjectMapping(marketUpdateDto, market);

		market.setSrcSyncId(market.getSrcSyncId() + 1);

		SyncStagingDto data = marketService.saveMarketToDB(market, LocationOperationCodes.MARKET_UPDATE);
		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);

		return (MarketDto) MapperUtil.getObjectMapping(market, new MarketDto());
	}

	// 1st stage adding market material to db.
	@Override
	public MarketMarkupMappingResponseDto addMarketMarkupMapping(String marketCode,
			MarketMarkupMappingRequestDto marketMarkupDto) {

		MarketDao market = marketRepository.findOneByMarketCode(marketCode);

		List<MarketMarkupMappingDaoExt> marketMaterial = marketMarkupMappingRepository.findByMarket(market);
		if (!marketMaterial.isEmpty()) {
			throw new ServiceException(
					"Market Factors already defined please UPDATE, Cannot create new MarketMaterialMapping",
					ERR_LOC_033);
		}
		List<MarketMarkupMappingDaoExt> marketMappingList = new ArrayList<>();
		List<String> marketCodeList = new ArrayList<>();

		if (market == null) {
			throw new ServiceException(NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE, ERR_LOC_017);
		} else {

			for (MarketMarkupFactors marketMarkupMappingFactorsDto : marketMarkupDto.getMarketMarkupFactors()) {

				MarketMarkupMappingDaoExt marketMaterialMapping = (MarketMarkupMappingDaoExt) MapperUtil
						.getObjectMapping(marketMarkupMappingFactorsDto, new MarketMarkupMappingDaoExt());
//				market.setIsActive(true);
//				market.setSrcSyncId(market.getSrcSyncId() + 1);
				marketMaterialMapping.setMarket(market);
				marketMaterialMapping.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
				marketMappingList.add(marketMaterialMapping);
				marketCodeList.add(marketMarkupMappingFactorsDto.getMetalTypeCode());

			}

			if (marketCodeList.containsAll(metalTypeCode)) {
				Map<String, SyncStagingDto> data = marketService.saveMarketMarkupMapping(marketMappingList,
						LocationOperationCodes.MARKET_MARKUP_MAPPING_ADD);
				syncDataService.publishLocationMessages(data);
			} else {
				throw new ServiceException(PROVIDE_ALL_MATERIAL_CODE, ERR_LOC_033);
			}
		}

		return generateMarketMarkupMappingUpdateDto(marketMappingList, market.getMarketCode());

	}

	/**
	 * @param marketMappingList
	 * @param operationCode
	 * @return
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveMarketMarkupMapping(List<MarketMarkupMappingDaoExt> marketMappingList,String operationCode) {
		marketMappingList = marketMarkupMappingRepository.saveAll(marketMappingList);
		List<SyncData> mmmSyncDataList = new ArrayList<>();
		MarketMarkupMappingSyncDtoExt syncDto = new MarketMarkupMappingSyncDtoExt();
		mmmSyncDataList.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoList(marketMappingList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(mmmSyncDataList, operationCode, destinations, false,
				MessageType.PRIORITY.toString(), DestinationType.ALL.toString());
	}

	private MarketMarkupMappingResponseDto generateMarketMarkupMappingUpdateDto(
			List<MarketMarkupMappingDaoExt> marketMappingList, String marketCode) {
		MarketMarkupMappingResponseDto materialMappingDto = (MarketMarkupMappingResponseDto) MapperUtil
				.getObjectMapping(generateMarketMarkupMappingResponse(marketMappingList),
						new MarketMarkupMappingResponseDto());
		materialMappingDto.setMarketCode(marketCode);
		return materialMappingDto;
	}

	private MarketMarkupMappingResponseDto generateMarketMarkupMappingResponse(
			List<MarketMarkupMappingDaoExt> marketMappingList) {

		MarketMarkupMappingResponseDto marketMaterialMappingDto = new MarketMarkupMappingResponseDto();
		List<MarketMarkupFactors> marketMarkupFactorsList = new ArrayList<>();
		for (MarketMarkupMappingDaoExt marketMaterialMapping : marketMappingList) {

			MarketMarkupFactors marketMaterial = (MarketMarkupFactors) MapperUtil
					.getObjectMapping(marketMaterialMapping, new MarketMarkupFactors());

			marketMarkupFactorsList.add(marketMaterial);
		}
		marketMaterialMappingDto.setMarketMarkupFactors(marketMarkupFactorsList);

		return marketMaterialMappingDto;
	}

	@Override
	public PagedRestResponse<List<MarketMarkupListMappingResponseDto>> listMarketMarkupMapping(List<String> marketCodes,
			Boolean isActive, Pageable pageable) {
		Page<MarketMarkupMappingDaoExt> marketMarkupMappingList;

		List<MarketMarkupListMappingResponseDto> marketMaterialMappingResponseList = new ArrayList<>();

		List<Boolean> isActiveList = new ArrayList<>();
		if (isActive == null) {
			isActiveList.add(Boolean.TRUE);
			isActiveList.add(Boolean.FALSE);
		} else {
			isActiveList.add(isActive);
		}
		marketMarkupMappingList = marketMarkupMappingRepository.findAllMarketMarkupDetails(marketCodes, pageable);

		for (MarketMarkupMappingDaoExt marketMaterialMapping : marketMarkupMappingList.getContent()) {

			MarketMarkupListMappingResponseDto marketMaterialListMappingResponseDto = (MarketMarkupListMappingResponseDto) MapperUtil
					.getObjectMapping(marketMaterialMapping, new MarketMarkupListMappingResponseDto());
			marketMaterialListMappingResponseDto.setMarket(marketMaterialMapping.getMarket().getMarketCode());
			marketMaterialMappingResponseList.add(marketMaterialListMappingResponseDto);

		}

		return (new PagedRestResponse<>(marketMaterialMappingResponseList, marketMarkupMappingList));

	}

	@Override
	public MarketMarkupMappingResponseDto getMarketMarkupMapping(String marketCode) {

		MarketDao market = marketRepository.findOneByMarketCode(marketCode);
		List<MarketMarkupMappingDaoExt> marketMaterialMappingList = marketMarkupMappingRepository.findByMarket(market);
		return generateMarketMarkupMappingUpdateDto(marketMaterialMappingList, market.getMarketCode());

	}

	@Override
	public MarketMarkupMappingResponseDto updateMarketMarkupMappping(String marketCode,
			MarketMarkupMappingRequestDto marketUpdateDto) {
		MarketDao market = marketRepository.findOneByMarketCode(marketCode);
		List<String> materialTypeCodeList = new ArrayList<>();
		List<MarketMarkupMappingDaoExt> marketMappingList = new ArrayList<>();

		if (market == null) {
			throw new ServiceException(NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE, ERR_LOC_017);
		} else {
			marketUpdateDto.getMarketMarkupFactors()
					.forEach(marketMaterial -> materialTypeCodeList.add(marketMaterial.getMetalTypeCode()));

			List<MarketMarkupMappingDaoExt> getMapping = marketMarkupMappingRepository.getMarketMarkupMapping(market,
					materialTypeCodeList);
			Map<String, MarketMarkupMappingDaoExt> marketMaterialMappingMap = new HashMap<>();
			for (MarketMarkupMappingDaoExt marketMaterialMappingDao : getMapping)
				marketMaterialMappingMap.put(marketMaterialMappingDao.getMetalTypeCode(), marketMaterialMappingDao);

			for (MarketMarkupFactors marketMarkupMappingFactorsDto : marketUpdateDto.getMarketMarkupFactors()) {
				MarketMarkupMappingDaoExt marketMaterialMappingDao;
				if (!marketMaterialMappingMap.isEmpty()
						&& marketMaterialMappingMap.containsKey(marketMarkupMappingFactorsDto.getMetalTypeCode()))
					marketMaterialMappingDao = (MarketMarkupMappingDaoExt) MapperUtil.getObjectMapping(
							marketMarkupMappingFactorsDto,
							marketMaterialMappingMap.get(marketMarkupMappingFactorsDto.getMetalTypeCode()));
				else
					marketMaterialMappingDao = (MarketMarkupMappingDaoExt) MapperUtil
							.getObjectMapping(marketMarkupMappingFactorsDto, new MarketMarkupMappingDaoExt());

				marketMaterialMappingDao.setMarket(market);
				marketMaterialMappingDao.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
				if (marketMaterialMappingDao.getSrcSyncId() != null)
					marketMaterialMappingDao.setSrcSyncId(marketMaterialMappingDao.getSrcSyncId() + 1);
				marketMappingList.add(marketMaterialMappingDao);
			}
			market.setIsActive(true);
			market.setSrcSyncId(market.getSrcSyncId() + 1);
			Map<String, SyncStagingDto> data = marketService.saveMarketMarkupMapping(marketMappingList,
					LocationOperationCodes.MARKET_MARKUP_MAPPING_UPDATE);
			syncDataService.publishLocationMessages(data);
		}
		return generateMarketMarkupMappingUpdateDto(marketMappingList, marketCode);
	}

	@Override
	public MarketUcpPriceMappingResponseDto addMarketUcpPriceMapping(
			MarketUcpPriceMappingDto marketUcpPriceMappingDto) {

		// check if market code exists and is active
		MarketDao marketDao = getActiveMarketByMarketCode(marketUcpPriceMappingDto);

		// check if product group is active(is UCP product group check required or
		// not?)
		getActiveProductGroupCode(marketUcpPriceMappingDto);

		// check if combination exists already
		checkIfMarketAndProductGroupCodeComboExists(marketUcpPriceMappingDto);

		// save
		MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao = (MarketUcpPriceMappingDaoExt) MapperUtil
				.getObjectMapping(marketUcpPriceMappingDto, new MarketUcpPriceMappingDaoExt());
		marketUcpPriceMappingDao.setMarketDao(marketDao);
		marketUcpPriceMappingDao.setSrcSyncId(0);
		marketUcpPriceMappingDao.setDestSyncId(0);
		Map<String, SyncStagingDto> data = marketService.saveMarketUcpPriceMappingToDB(marketUcpPriceMappingDao,
				ProductOperationCodes.MARKET_UCP_PRICE_MAPPING_ADD, false);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		return mapMarketUcpPriceMappingaoToResponse(marketUcpPriceMappingDao);
	}

	/**
	 * @param marketUcpPriceMappingDao
	 * @param operationCode
	 * @param isPublishToEGHS
	 * @return
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveMarketUcpPriceMappingToDB(
			MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao, String operationCode, boolean isPublishToEGHS) {
		marketUcpPriceMappingRepositoryExt.save(marketUcpPriceMappingDao);
		List<SyncData> mupmSyncDataList = new ArrayList<>();
		MarketUcpPriceMappingSyncDtoExt syncDto = new MarketUcpPriceMappingSyncDtoExt(marketUcpPriceMappingDao);
		mupmSyncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(mupmSyncDataList, operationCode, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * @param marketUcpPriceMappingDto
	 */
	private void getActiveProductGroupCode(MarketUcpPriceMappingDto marketUcpPriceMappingDto) {
		ProductGroupDto productGroupDto = productService
				.getProductGroup(marketUcpPriceMappingDto.getProductGroupCode());
		if (!BooleanUtils.isTrue(productGroupDto.getIsActive())) {
			throw new ServiceException(PRODUCT_GROUP_CODE_IS_NOT_ACTIVE, ERR_SALE_010,
					"Product group code - " + marketUcpPriceMappingDto.getProductGroupCode() + " is not active.");
		}
	}

	/**
	 * @param marketUcpPriceMappingDto
	 */
	private MarketUcpPriceMappingDaoExt checkIfMarketAndProductGroupCodeComboExists(
			MarketUcpPriceMappingDto marketUcpPriceMappingDto) {
		MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao = marketUcpPriceMappingRepositoryExt
				.findByMarketDaoMarketCodeAndProductGroupCode(marketUcpPriceMappingDto.getMarketCode(),
						marketUcpPriceMappingDto.getProductGroupCode());
		if (marketUcpPriceMappingDao != null) {
			throw new ServiceException(MARKET_CODE_AND_PRODUCT_GROUP_CODE_COMBINATION_ALREADY_EXISTS, ERR_LOC_084,
					"Market code - '" + marketUcpPriceMappingDto.getMarketCode() + "' and product group code - '"
							+ marketUcpPriceMappingDto.getProductGroupCode() + "' combination already exists.");
		}

		return marketUcpPriceMappingDao;
	}

	/**
	 * @param marketUcpPriceMappingDto
	 * @return
	 */
	private MarketDao getActiveMarketByMarketCode(MarketUcpPriceMappingDto marketUcpPriceMappingDto) {
		MarketDao marketDao = marketRepository.findOneByMarketCode(marketUcpPriceMappingDto.getMarketCode());
		if (marketDao == null) {
			throw new ServiceException(NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE, ERR_LOC_017,
					NO_MARKET_DETAILS_FOUND_FOR_THE_REQUESTED_MARKETCODE + " - "
							+ marketUcpPriceMappingDto.getMarketCode());
		}
		if (!BooleanUtils.isTrue(marketDao.getIsActive())) {
			throw new ServiceException(MARKET_CODE_IS_INACTIVE, ERR_LOC_010,
					MARKET_CODE_IS_INACTIVE + ": " + marketUcpPriceMappingDto.getMarketCode());
		}
		return marketDao;
	}

	@Override
	public PagedRestResponse<List<MarketUcpPriceMappingResponseDto>> listMarketUcpPriceMapping(String marketCode,
			String productGroupCode, Pageable pageable) {

		MarketUcpPriceMappingDaoExt marketUcpCriteria = new MarketUcpPriceMappingDaoExt();

		if (marketCode != null) {
			MarketDao marketDao = new MarketDao();
			marketDao.setMarketCode(marketCode);
			marketUcpCriteria.setMarketDao(marketDao);
		}

		marketUcpCriteria.setProductGroupCode(productGroupCode);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<MarketUcpPriceMappingDaoExt> criteria = Example.of(marketUcpCriteria, matcher);

		Page<MarketUcpPriceMappingDaoExt> marketUcpPriceDaoList = marketUcpPriceMappingRepositoryExt.findAll(criteria,
				pageable);

		List<MarketUcpPriceMappingResponseDto> marketUcpPriceResponseList = new ArrayList<>();
		marketUcpPriceDaoList.forEach(marketUcpPriceMappingDao -> {
			MarketUcpPriceMappingResponseDto marketUcpPriceResponse = mapMarketUcpPriceMappingaoToResponse(
					marketUcpPriceMappingDao);
			marketUcpPriceResponseList.add(marketUcpPriceResponse);
		});

		return new PagedRestResponse<>(marketUcpPriceResponseList, marketUcpPriceDaoList);
	}

	@Override
	public MarketUcpPriceMappingResponseDto getMarketUcpPriceMapping(String id) {

		MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao = getMarketUcpPriceMappingById(id);

		return mapMarketUcpPriceMappingaoToResponse(marketUcpPriceMappingDao);
	}

	@Transactional
	@Override
	public MarketUcpPriceMappingResponseDto updateMarketUcpPriceMapping(String id,
			MarketUcpPriceMappingDto marketUcpPriceMappingDto) {

		MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao = getMarketUcpPriceMappingById(id);
		MarketDao marketDao = marketUcpPriceMappingDao.getMarketDao();

		boolean isChangeInUniqueKey = false;
		if (!marketUcpPriceMappingDao.getMarketDao().getMarketCode().equals(marketUcpPriceMappingDto.getMarketCode())) {
			// check if market code exists and is active
			marketDao = getActiveMarketByMarketCode(marketUcpPriceMappingDto);
			isChangeInUniqueKey = true;
		}

		// check if product group is active
		if (!marketUcpPriceMappingDao.getProductGroupCode().equals(marketUcpPriceMappingDto.getProductGroupCode())) {
			getActiveProductGroupCode(marketUcpPriceMappingDto);
			isChangeInUniqueKey = true;
		}

		// when UK(market_code and product_group_code) is changed, then check if
		// combination exists already
		if (isChangeInUniqueKey) {
			checkIfMarketAndProductGroupCodeComboExists(marketUcpPriceMappingDto);
		}

		// save
		marketUcpPriceMappingDao = (MarketUcpPriceMappingDaoExt) MapperUtil.getObjectMapping(marketUcpPriceMappingDto,
				marketUcpPriceMappingDao);
		marketUcpPriceMappingDao.setMarketDao(marketDao);
		marketUcpPriceMappingDao.setSrcSyncId(marketUcpPriceMappingDao.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = marketService.saveMarketUcpPriceMappingToDB(marketUcpPriceMappingDao,
				ProductOperationCodes.MARKET_UCP_PRICE_MAPPING_UPDATE, false);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		return mapMarketUcpPriceMappingaoToResponse(marketUcpPriceMappingDao);

	}

	private MarketUcpPriceMappingResponseDto mapMarketUcpPriceMappingaoToResponse(
			MarketUcpPriceMappingDaoExt marketUcpPriceMappingDao) {
		MarketUcpPriceMappingResponseDto marketUcpPriceResponse = (MarketUcpPriceMappingResponseDto) MapperUtil
				.getDtoMapping(marketUcpPriceMappingDao, MarketUcpPriceMappingResponseDto.class);
		marketUcpPriceResponse.setMarketCode(marketUcpPriceMappingDao.getMarketDao().getMarketCode());

		return marketUcpPriceResponse;
	}

	private MarketUcpPriceMappingDaoExt getMarketUcpPriceMappingById(String id) {
		Optional<MarketUcpPriceMappingDaoExt> marketUcpPriceMappingOptional = marketUcpPriceMappingRepositoryExt
				.findById(id);

		if (!marketUcpPriceMappingOptional.isPresent()) {
			throw new ServiceException(NO_RECORDS_FOUND_FOR_REQUESTED_ID, ERR_LOC_019,
					NO_RECORDS_FOUND_FOR_REQUESTED_ID + "- " + id);
		}

		return marketUcpPriceMappingOptional.get();
	}

	@Override
	public void updateMarketMarkupMappingAmount() {
		List<MarketMarkupMappingDaoExt> getMapping = marketMarkupMappingRepository.findAll();
		List<MarketMarkupMappingDaoExt> updateMapping = new ArrayList<>();
		if(!getMapping.isEmpty()) {
			getMapping.forEach(marketMarkup->{
				if(marketMarkup.getAddAmount().compareTo(BigDecimal.ZERO)>0 || marketMarkup.getDeductAmount().compareTo(BigDecimal.ZERO)>0) {
					marketMarkup.setAddAmount(BigDecimal.ZERO);
					marketMarkup.setDeductAmount(BigDecimal.ZERO);
					marketMarkup.setSrcSyncId(marketMarkup.getSrcSyncId() + 1);
					updateMapping.add(marketMarkup);
				}
				
			});
			if(!updateMapping.isEmpty()) {
				Map<String, SyncStagingDto> data = marketService.saveMarketMarkupMapping(updateMapping,
						LocationOperationCodes.MARKET_MARKUP_MAPPING_UPDATE);
				syncDataService.publishLocationMessages(data);
			}
		}
		
	}
}
