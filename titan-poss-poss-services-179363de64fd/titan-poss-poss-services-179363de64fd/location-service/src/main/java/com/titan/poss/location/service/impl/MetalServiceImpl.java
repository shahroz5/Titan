/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationMarketDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.MetalPriceLocationMappingDto;
import com.titan.poss.core.dto.MetalPriceLocationResponse;
import com.titan.poss.core.dto.ServiceMetalRequestDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.SerivceMetalEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDaoExt;
import com.titan.poss.location.dao.MetalPriceConfigDaoExt;
import com.titan.poss.location.dao.MetalPriceLocationHistoryDaoExt;
import com.titan.poss.location.dao.MetalPriceLocationMappingDaoExt;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.MetalPriceConfigSyncDtoExt;
import com.titan.poss.location.dto.MetalPriceLocationHistorySyncDtoExt;
import com.titan.poss.location.dto.MetalPriceLocationMappingSyncDtoExt;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MetalBasePriceRequestDto;
import com.titan.poss.location.dto.request.MetalPriceMappingRequestDto;
import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingFactorsDto;
import com.titan.poss.location.dto.response.MetalPriceConfigDto;
import com.titan.poss.location.dto.response.MetalPriceMappingBaseDto;
import com.titan.poss.location.dto.response.MetalPriceMappingResponseDto;
import com.titan.poss.location.dto.response.ResponseBodyMarketMetalMapping;
import com.titan.poss.location.repository.LocationRepositoryExt;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.MarketMarkupMappingRepositoryExt;
import com.titan.poss.location.repository.MarketRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigRepositoryExt;
import com.titan.poss.location.repository.MetalPriceLocationHistoryRepositoryExt;
import com.titan.poss.location.repository.MetalPriceLocationMappingRepositoryExt;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.MetalService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
@Transactional
public class MetalServiceImpl implements MetalService {

	private static final String ERR_LOC_024 = "ERR-LOC-024";

	private static final String PRICE_IS_SET_FOR_DAILY_OPTION = "Price is already define for all markets with Daily option";

	private static final String ERR_LOC_025 = "ERR-LOC-025";

	private static final String NO_METAL_DETAILS_FOUND_IN_TABLE = "no market- details found in mapping Type table";

	private static final String ERR_LOC_026 = "ERR-LOC-026";

	private static final String IMPROPER_PRICE_TYPE = "improper price Type selected";

	@Value("${country.code}")
	private String countryCode;

	@Autowired
	private CountryService countryService;

	@Autowired
	private MarketMarkupMappingRepositoryExt marketMarkupMappingRepository;

	@Autowired
	private MarketRepositoryExt marketRepository;

	@Autowired
	private MetalPriceConfigRepositoryExt metalPriceConfigRepository;

	@Autowired
	private MetalPriceLocationMappingRepositoryExt metalPriceLocationMappingRepository;

	@Autowired
	private MetalPriceLocationHistoryRepositoryExt metalPriceLocationHistoryRepository;

	@Autowired
	private LocationRepositoryExt locationRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private MetalServiceImpl metalService;
	
	@Autowired
	private IntegrationServiceClient integrationServiceClient;
	

	@Override
	public PagedRestResponse<List<MarketMarkupMappingFactorsDto>> listMarketMarkupMapping(List<String> marketCodes,
			List<String> descriptions, String metalTypeCode, Pageable pageable) {

		Page<MarketMarkupMappingDaoExt> marketMarkupMappingPage;

		marketMarkupMappingPage = marketMarkupMappingRepository.findAllByMetalCode(marketCodes, metalTypeCode,
				pageable);

		List<MarketMarkupMappingFactorsDto> marketDtoList = new ArrayList<>();
		marketMarkupMappingPage.forEach(market -> {
			MarketMarkupMappingFactorsDto marketDto = (MarketMarkupMappingFactorsDto) MapperUtil
					.getObjectMapping(market, new MarketMarkupMappingFactorsDto());
			marketDto.setMarketCode(market.getMarket().getMarketCode());
			marketDto.setDescription(market.getMarket().getDescription());
			marketDtoList.add(marketDto);
		});
		return (new PagedRestResponse<>(marketDtoList, marketMarkupMappingPage));

	}

	@Override

	public PagedRestResponse<List<MetalPriceMappingBaseDto>> computeMetalPriceLocationMapping(String metalTypeCode,
			MetalBasePriceRequestDto marketMateriaDto, List<String> filterMarketCodes, List<String> filterLocationCodes,
			Pageable respPageable) {

		// if pricetype =daily then all to be computed
		// base price to bigDecimal
		BigDecimal basePrice = new BigDecimal(marketMateriaDto.getBasePrice());

		if (marketMateriaDto.getPriceTypeCode().equals(PriceTypeCodeEnum.D.toString())) {

			// get all the marketCodes in marketMetalMapping
			List<String> marketCodes = marketMarkupMappingRepository.getActiveUniqueMarketCodes();

			return computeNewPrice(marketCodes, marketMateriaDto.getApplicableDate(), basePrice, metalTypeCode,
					respPageable, filterMarketCodes, filterLocationCodes);

		} else if (marketMateriaDto.getPriceTypeCode().equals(PriceTypeCodeEnum.F.toString())) {

			// forced for all the markets
			// get all available marketCodes from marketMaster
			if (marketMateriaDto.getMarketCodes().isEmpty()) {
				List<String> marketCodes = marketMarkupMappingRepository.getActiveUniqueMarketCodes();
				return computeNewPrice(marketCodes, marketMateriaDto.getApplicableDate(), basePrice, metalTypeCode,
						respPageable, filterMarketCodes, filterLocationCodes);

			}

			else {
				// forced for selected marketcodes

				return computeNewPrice(marketMateriaDto.getMarketCodes(), marketMateriaDto.getApplicableDate(),
						basePrice, metalTypeCode, respPageable, filterMarketCodes, filterLocationCodes);

			}
		} else {
			throw new ServiceException(IMPROPER_PRICE_TYPE, ERR_LOC_026);
		}

	}

	private PagedRestResponse<List<MetalPriceMappingBaseDto>> computeNewPrice(List<String> marketCodes,
			Date applicableDate, BigDecimal basePrice, String metalTypeCode, Pageable respPageable,
			List<String> filterMarketCodes, List<String> filterLocationCodes) {

		List<MetalPriceMappingBaseDto> locationComputedResponse;
		// get the list in result set
		List<Object[]> locationListPrice = marketMarkupMappingRepository.getLocationMappedPrice(basePrice, marketCodes,
				metalTypeCode, respPageable.getPageNumber() * respPageable.getPageSize(), respPageable.getPageSize(),
				filterMarketCodes, filterLocationCodes);
		int pageSize = marketMarkupMappingRepository.getLocationMappedPriceSize(basePrice, marketCodes, metalTypeCode);

		locationComputedResponse = setMetalPriceMappingResponseDto(locationListPrice, applicableDate, metalTypeCode);
		// prepare the response

		Page<MetalPriceMappingBaseDto> pagedData = new PageImpl<>(locationComputedResponse,
				PageRequest.of(respPageable.getPageNumber(), respPageable.getPageSize(), respPageable.getSort()),
				pageSize);

		return new PagedRestResponse<>(locationComputedResponse, pagedData);

	}

	private List<MetalPriceMappingBaseDto> setMetalPriceMappingResponseDto(List<Object[]> locationListPrice,
			Date applicableDate, String metalTypeCode) {

		List<MetalPriceMappingBaseDto> locationComputedResponse = new ArrayList<>();
		for (Object[] l : locationListPrice) {
			MetalPriceMappingBaseDto is = new MetalPriceMappingBaseDto();
			is.setMarketCode((String) l[0]);
			is.setMarketDescription((String) l[1]);
			is.setLocationCode((String) l[2]);

			is.setLocationDescription((String) l[3]);
			is.setMetalTypeCode(metalTypeCode);
			// exact price
			BigDecimal exactPrice = (BigDecimal) l[4];

			// rounding to 0th decimal place
			is.setMetalRate(BigDecimal.valueOf(Math.ceil(exactPrice.doubleValue())));

			is.setApplicableDate(applicableDate);
			locationComputedResponse.add(is);
		}
		return locationComputedResponse;

	}

	private List<MetalPriceMappingResponseDto> computedPrice(List<String> marketCodes, BigDecimal basePrice,
			String metalTypeCode, Date applicableDate, Pageable pageable) {
		Page<MarketMarkupMappingDaoExt> marketMetalMappingPage;

		marketMetalMappingPage = marketMarkupMappingRepository.findAllMetalPriceDetails(marketCodes, metalTypeCode,
				pageable);

		List<MarketMarkupMappingDaoExt> marketMetalMappingsList;
		List<MetalPriceMappingResponseDto> metalPriceMappingResponse = new ArrayList<>();

		marketMetalMappingsList = marketMetalMappingPage.getContent();

		List<LocationMarketDto> locationDetails = locationRepository.findLocationWithFilters(marketCodes, true);

		Map<String, ResponseBodyMarketMetalMapping> mapMetalMapping = new HashMap<>();

		for (MarketMarkupMappingDaoExt marketMetalMapping : marketMetalMappingsList) {

			ResponseBodyMarketMetalMapping rp = new ResponseBodyMarketMetalMapping();
			rp.setMarketCode(marketMetalMapping.getMarket().getMarketCode());
			rp.setComputedPrice(computeMetalPrice(basePrice, marketMetalMapping.getAddAmount(),
					marketMetalMapping.getDeductAmount(), marketMetalMapping.getMarkupFactor()));
			rp.setAddAmount(marketMetalMapping.getAddAmount());
			rp.setDeductAmount(marketMetalMapping.getDeductAmount());
			rp.setMarkupFactor(marketMetalMapping.getMarkupFactor());
			rp.setMetalTypeCode(marketMetalMapping.getMetalTypeCode());
			rp.setApplicableDate(applicableDate);

			mapMetalMapping.put(marketMetalMapping.getMarket().getMarketCode(), rp);

		}

		return getMetalPriceMappingResponse(metalPriceMappingResponse, locationDetails, mapMetalMapping);

	}

	private List<MetalPriceMappingResponseDto> getMetalPriceMappingResponse(
			List<MetalPriceMappingResponseDto> metalPriceMappingResponse, List<LocationMarketDto> locationDetails,
			Map<String, ResponseBodyMarketMetalMapping> mapMetalMapping) {
		if (mapMetalMapping.isEmpty()) {
			throw new ServiceException(NO_METAL_DETAILS_FOUND_IN_TABLE, ERR_LOC_025);
		}
		for (LocationMarketDto locationDto : locationDetails) {
			MetalPriceMappingResponseDto metalPriceMappingDto = new MetalPriceMappingResponseDto();
			metalPriceMappingDto.setMarketCode(locationDto.getMarketCode());
			metalPriceMappingDto.setLocationCode(locationDto.getLocationCode());
			metalPriceMappingDto.setLocationDescription(locationDto.getDescription());
            if(mapMetalMapping.get(locationDto.getMarketCode()) != null) {
			metalPriceMappingDto.setMetalRate(mapMetalMapping.get(locationDto.getMarketCode()).getComputedPrice());// computedPrice

			metalPriceMappingDto.setAddAmount(mapMetalMapping.get(locationDto.getMarketCode()).getAddAmount());
			metalPriceMappingDto.setDeductAmount(mapMetalMapping.get(locationDto.getMarketCode()).getDeductAmount());
			metalPriceMappingDto
					.setApplicableDate(mapMetalMapping.get(locationDto.getMarketCode()).getApplicableDate());
			metalPriceMappingDto.setMarkupFactor(mapMetalMapping.get(locationDto.getMarketCode()).getMarkupFactor());
			metalPriceMappingDto.setMetalTypeCode(mapMetalMapping.get(locationDto.getMarketCode()).getMetalTypeCode());
			metalPriceMappingResponse.add(metalPriceMappingDto);
            }
            }
		return metalPriceMappingResponse;
	}

	private BigDecimal computeMetalPrice(BigDecimal basePrice, BigDecimal addAmount, BigDecimal deductAmount,
			BigDecimal markupFactor) {

		// basePrice*factor +addamoun -deductamount

		// rounding to 0th decimal place

		BigDecimal calculatedValue = ((basePrice.multiply(markupFactor)).add(addAmount)).subtract(deductAmount);
		return BigDecimal.valueOf(Math.ceil(calculatedValue.doubleValue()));
	}

	@Override
	@Transactional
	public void confirmMetalPriceLocationMapping(String metalTypeCode, MetalPriceMappingRequestDto marketMateriaDto) {
		Pageable pageable;
		pageable = PageRequest.of(0, Integer.MAX_VALUE);
		// base price to bigDecimal
		BigDecimal basePrice = new BigDecimal(marketMateriaDto.getBasePrice());
		List<MetalPriceLocationMappingDaoExt> existingMetalPriceLocationList = null;
		List<MetalPriceLocationMappingDaoExt> newMetalPriceLocationList = new ArrayList<>();
		List<MetalPriceMappingResponseDto> metalPriceLocationListResponse = new ArrayList<>();
		MetalPriceConfigDaoExt metalPriceConfig = (MetalPriceConfigDaoExt) MapperUtil.getObjectMapping(marketMateriaDto,
				new MetalPriceConfigDaoExt());
		metalPriceConfig = (MetalPriceConfigDaoExt) MapperUtil.getObjectMapping(marketMateriaDto, metalPriceConfig);
		metalPriceConfig.setMetalTypeCode(metalTypeCode);
		metalPriceConfig.setBasePrice(new BigDecimal(marketMateriaDto.getBasePrice()));
		metalPriceConfig.setPriceType(marketMateriaDto.getPriceTypeCode());
		metalPriceConfig.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
		List<String> marketCodes = marketMarkupMappingRepository.getActiveUniqueMarketCodes();
		List<SyncData> eghsSyncData = new ArrayList<>();
		List<String> locationCodeList;
		locationCodeList = getlocationCodeList(marketMateriaDto, pageable);
		Map<String, List<SyncData>> locationSyncDataMap = new HashMap<>();
		locationCodeList.forEach(location -> {
			List<SyncData> syncDatas = new ArrayList<>();
			locationSyncDataMap.put(location, syncDatas);
		});
		/**
		 * step0 --compute price step1 --get the existing list from table w.r.t
		 * passed,applicabledate,metal_type_code,location_code step2 --move to history
		 * table step3 --delete from existing table step4 --add requestDto data to
		 * priceLocationMapping table
		 **/
		if (marketMateriaDto.getPriceTypeCode().equals(PriceTypeCodeEnum.D.toString())) {

			List<MetalPriceConfigDaoExt> metalConfigList = metalPriceConfigRepository
					.findByPriceTypeAndMetalCodeAndApplicableDate(PriceTypeCodeEnum.D.toString(), metalTypeCode,
							marketMateriaDto.getApplicableDate());
			if (!CollectionUtil.isEmpty(metalConfigList)) {
				throw new ServiceException(PRICE_IS_SET_FOR_DAILY_OPTION, ERR_LOC_024);
			}

			metalPriceConfig = metalPriceConfigRepository.save(metalPriceConfig);
			metalPriceConfig.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
			// Adding to syncDataList
			MetalPriceConfigSyncDtoExt metalPriceConfigSyncDto = new MetalPriceConfigSyncDtoExt(metalPriceConfig);
			eghsSyncData.add(DataSyncUtil.createSyncData(metalPriceConfigSyncDto, 0));
			locationCodeList.forEach(location -> {
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(DataSyncUtil.createSyncData(metalPriceConfigSyncDto, 0));
				locationSyncDataMap.put(location, syncDatas);
			});

			// step0
			metalPriceLocationListResponse = computedPrice(marketCodes, basePrice, metalTypeCode,
					marketMateriaDto.getApplicableDate(), pageable);

			// step1
			existingMetalPriceLocationList = getMetalPriceLocationMappingList(locationCodeList, metalTypeCode,
					marketMateriaDto.getApplicableDate());
			// step2,3
			updateMappingTable(existingMetalPriceLocationList, locationSyncDataMap);

		} else if (marketMateriaDto.getPriceTypeCode().equals(PriceTypeCodeEnum.F.toString())) {
			metalPriceConfig.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
			metalPriceConfig = metalPriceConfigRepository.save(metalPriceConfig);
			MetalPriceConfigSyncDtoExt metalPriceConfigSyncDto = new MetalPriceConfigSyncDtoExt(metalPriceConfig);
			eghsSyncData.add(DataSyncUtil.createSyncData(metalPriceConfigSyncDto, 0));
			locationCodeList.forEach(location -> {
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(DataSyncUtil.createSyncData(metalPriceConfigSyncDto, 0));
				locationSyncDataMap.put(location, syncDatas);
			});

			// do forced price all marketCodes
			if (marketMateriaDto.getMarketCodes().isEmpty()) {
				// step0
				metalPriceLocationListResponse = computedPrice(marketCodes, basePrice, metalTypeCode,
						marketMateriaDto.getApplicableDate(), pageable);

				// step1
				existingMetalPriceLocationList = getMetalPriceLocationMappingList(locationCodeList, metalTypeCode,
						marketMateriaDto.getApplicableDate());
				// step2,3
				updateMappingTable(existingMetalPriceLocationList, locationSyncDataMap);

			} else {
				// do for selected marketCodes
				// step0

				metalPriceLocationListResponse = computedPrice(marketMateriaDto.getMarketCodes(), basePrice,
						metalTypeCode, marketMateriaDto.getApplicableDate(), pageable);

				// step1
				existingMetalPriceLocationList = getMetalPriceLocationMappingList(locationCodeList, metalTypeCode,
						marketMateriaDto.getApplicableDate());

				// step2,3
				updateMappingTable(existingMetalPriceLocationList, locationSyncDataMap);
			}

		}

		Map<String, LocationDao> locationMap = new HashMap<>();
		Map<String, MarketDao> marketMap = new HashMap<>();

		for (MetalPriceMappingResponseDto metalPriceMappingResponse : metalPriceLocationListResponse) {
			LocationDao location = new LocationDao();
			MarketDao market = new MarketDao();
			location.setLocationCode(metalPriceMappingResponse.getLocationCode());
			market.setMarketCode(metalPriceMappingResponse.getMarketCode());
			locationMap.put(metalPriceMappingResponse.getLocationCode(), location);
			marketMap.put(metalPriceMappingResponse.getMarketCode(), market);

		}
		for (MetalPriceMappingResponseDto metalPriceMappingResponse : metalPriceLocationListResponse) {

			MetalPriceLocationMappingDaoExt metalPriceLocation = (MetalPriceLocationMappingDaoExt) MapperUtil
					.getObjectMapping(metalPriceMappingResponse, new MetalPriceLocationMappingDaoExt());

			metalPriceLocation.setLocation(locationMap.get(metalPriceMappingResponse.getLocationCode()));
			metalPriceLocation.setMarket(marketMap.get(metalPriceMappingResponse.getMarketCode()));
			metalPriceLocation.setMetalTypeCode(metalPriceMappingResponse.getMetalTypeCode());
			metalPriceLocation.setMetalPriceConfig(metalPriceConfig);
			metalPriceLocation.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
			// add sync time
			metalPriceLocation.setSyncTime(new Date().getTime());
			newMetalPriceLocationList.add(metalPriceLocation);
		}

		List<MetalPriceLocationHistoryDaoExt> newSavedMetalHistoryList = saveToHistoryTable(newMetalPriceLocationList);

	
		// step4
		newSavedMetalHistoryList = metalPriceLocationHistoryRepository.saveAll(newSavedMetalHistoryList);

		newSavedMetalHistoryList.forEach(metalHistory -> {
			MetalPriceLocationHistorySyncDtoExt syncDtoExt = new MetalPriceLocationHistorySyncDtoExt(metalHistory);
			locationSyncDataMap.get(metalHistory.getLocation().getLocationCode())
					.add(DataSyncUtil.createSyncData(syncDtoExt, 3));
		});

		
		List<MetalPriceLocationMappingDaoExt> newSavedMetalPriceLocationList = metalPriceLocationMappingRepository
				.saveAll(newMetalPriceLocationList);
		
		List<ServiceMetalRequestDto> serviceMetalRequestDtoList = new ArrayList<>();
		log.info("Saved into metalPriceLocationMappingRepository");
		newSavedMetalPriceLocationList.forEach(metal -> {
			MetalPriceLocationMappingSyncDtoExt syncDtoExt = new MetalPriceLocationMappingSyncDtoExt(metal);
			locationSyncDataMap.get(metal.getLocation().getLocationCode())
					.add(DataSyncUtil.createSyncData(syncDtoExt, 2));
			
			if(!syncDtoExt.getMetalTypeCode().equals(MetalTypeCodeEnum.P.name())){
				ServiceMetalRequestDto serviceMetalRequestDto = new ServiceMetalRequestDto();
				serviceMetalRequestDto.setLocation_code(syncDtoExt.getLocation());
				if(syncDtoExt.getMetalTypeCode().equals(MetalTypeCodeEnum.J.name())) {
					serviceMetalRequestDto.setMetal_type(SerivceMetalEnum.GO.name());	
					log.info("checking metal code :{}",syncDtoExt.getMetalTypeCode());	
				}else if(syncDtoExt.getMetalTypeCode().equals(MetalTypeCodeEnum.L.name())) {
					serviceMetalRequestDto.setMetal_type(SerivceMetalEnum.PT.name());	
				}
				serviceMetalRequestDto.setMetal_rate(syncDtoExt.getMetalRate());
				serviceMetalRequestDto.setPrice_type(marketMateriaDto.getPriceTypeCode());
				serviceMetalRequestDto.setUpdated_date(syncDtoExt.getLastModifiedDate().getTime());
				serviceMetalRequestDto.setUpdated_by(syncDtoExt.getLastModifiedBy());		
				serviceMetalRequestDtoList.add(serviceMetalRequestDto);
			}
		
		});
		if(!CollectionUtil.isEmpty(serviceMetalRequestDtoList)){
			log.info("checking serviceMetalDto :{}",serviceMetalRequestDtoList);
		    Object resposeObj = integrationServiceClient.updateBtqMetalRate(serviceMetalRequestDtoList);
		    log.info("checking service request list :{}",serviceMetalRequestDtoList);
		    log.info("checking gold api :{}",resposeObj);
		}

		MetalPriceLocationMappingSyncDtoExt metalPriceSyncDtoExt = new MetalPriceLocationMappingSyncDtoExt();
		eghsSyncData.add(
				DataSyncUtil.createSyncData(metalPriceSyncDtoExt.getSyncDtoList(newSavedMetalPriceLocationList), 2));
		for (Map.Entry<String, List<SyncData>> entry : locationSyncDataMap.entrySet()) {
			List<String> destinations = new ArrayList<>();
			destinations.add(entry.getKey());
			SyncStagingDto data = metalService.saveSyncStaging(entry.getValue(),
					LocationOperationCodes.METAL_PRICE_LOCATION_MAPPING, destinations, MessageType.PRIORITY.toString());
			syncDataService.publishLocationMessagesToQueue(data);
			//syncDataService.publishLocationMessagesToQueueWithToken(data);
			
		}
		List<String> eghsdestinations = new ArrayList<>();
		eghsdestinations.add("EGHS");
		SyncStagingDto eghStagingDto = metalService.saveSyncStaging(eghsSyncData,
				LocationOperationCodes.METAL_PRICE_LOCATION_MAPPING, eghsdestinations, MessageType.GENERAL.toString());
		syncDataService.publishLocationMessagesToQueue(eghStagingDto);
		//syncDataService.publishLocationMessagesToQueueWithToken(eghStagingDto);
		
		
		
//		ServiceMetalRequestDto serviceMetalRequestDto = new ServiceMetalRequestDto();
//		serviceMetalRequestDto.setLocation_code(metalPriceSyncDtoExt.getLocation());
//		serviceMetalRequestDto.setMetal_type(metalTypeCode);
//		serviceMetalRequestDto.setMetal_rate(basePrice);
//		serviceMetalRequestDto.setPrice_type(marketMateriaDto.getPriceTypeCode());
//		serviceMetalRequestDto.setUpdated_date(new Date());
//		serviceMetalRequestDto.setUpdated_by(metalPriceSyncDtoExt.getLastModifiedBy());
//		log.info("checking serviceMetalDto :{}",serviceMetalRequestDto);
//		Object resposeObj = integrationServiceClient.updateBtqMetalRate(serviceMetalRequestDto);
//		log.info("checking gold api :{}",resposeObj);
		
	}

	private List<MetalPriceLocationHistoryDaoExt> saveToHistoryTable(
			// newly added to get D,F price drop down at sales
			List<MetalPriceLocationMappingDaoExt> newMetalPriceLocationList) {
		List<MetalPriceLocationHistoryDaoExt> newSavedMetalHistoryList = new ArrayList<>();
		newMetalPriceLocationList.forEach(metalPriceLocation -> {
			MetalPriceLocationHistoryDaoExt metalPriceMappingResponseDto = (MetalPriceLocationHistoryDaoExt) MapperUtil
					.getObjectMapping(metalPriceLocation, new MetalPriceLocationHistoryDaoExt());

			newSavedMetalHistoryList.add(metalPriceMappingResponseDto);
		});
		return newSavedMetalHistoryList;
	}

	/**
	 * @param syncDataList
	 * @param operation
	 * @param locationCodeList
	 * @return SyncStaging
	 */
	public SyncStagingDto saveSyncStaging(List<SyncData> syncDataList, String operation, List<String> locationCodeList,
			String messageType) {
		MessageRequest msgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, locationCodeList,
				messageType, DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(msgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(msgRequest);
		// saving to staging table
		SyncStaging stagingMsg = new SyncStaging();
		stagingMsg.setMessage(requestBody);
		stagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stagingMsg = locationSyncStagingRepository.save(stagingMsg);
		syncStagingDto.setId(stagingMsg.getId());
		return syncStagingDto;
	}

	private List<String> getlocationCodeList(MetalPriceMappingRequestDto marketMateriaDto, Pageable pageable) {
		List<LocationMarketDto> activeLocationDetails;
		List<String> locationCodeList = new ArrayList<>();
		if (marketMateriaDto.getMarketCodes().isEmpty()) {
			Page<MarketDao> marketsPage = marketRepository.findByIsActive(true, pageable);
			List<String> activeMarkets = new ArrayList<>();
			for (MarketDao market : marketsPage) {

				activeMarkets.add(market.getMarketCode());
			}
			activeLocationDetails = locationRepository.findLocationWithFilters(activeMarkets, true);
		} else {
			activeLocationDetails = locationRepository.findLocationWithFilters(marketMateriaDto.getMarketCodes(), true);
		}

		for (LocationMarketDto locationHeaderDto : activeLocationDetails) {
			locationCodeList.add(locationHeaderDto.getLocationCode());
		}
		return locationCodeList;
	}

	// Post call to insert in historyTable
	private List<String> updateMappingTable(List<MetalPriceLocationMappingDaoExt> existingMetalPriceLocationList,
			Map<String, List<SyncData>> locationSyncDataMap) {

		List<String> deletingIds = new ArrayList<>();
		List<MetalPriceLocationMappingDaoExt> deletingList = new ArrayList<>();
		for (MetalPriceLocationMappingDaoExt metalPriceMappingResponse : existingMetalPriceLocationList) {

			MetalPriceLocationHistoryDaoExt metalPriceLocationHistory = (MetalPriceLocationHistoryDaoExt) MapperUtil
					.getObjectMapping(metalPriceMappingResponse, new MetalPriceLocationHistoryDaoExt());

			deletingIds.add(metalPriceLocationHistory.getId());
			metalPriceMappingResponse.setSyncTime(new Date().getTime());
			MetalPriceLocationMappingSyncDtoExt mplSyncDtoExt = new MetalPriceLocationMappingSyncDtoExt(
					metalPriceMappingResponse);
			locationSyncDataMap.get(metalPriceLocationHistory.getLocation().getLocationCode())
					.add(DataSyncUtil.createSyncData(mplSyncDtoExt, 1));
			deletingList.add(metalPriceMappingResponse);

		}

		deleteExistingMetalPriceLocation(deletingIds);
		return deletingIds;
	}

	private void deleteExistingMetalPriceLocation(List<String> ids) {
		if (!ids.isEmpty()) {
			metalPriceLocationMappingRepository.deleteWithIds(ids);
		}
	}

	private List<MetalPriceLocationMappingDaoExt> getMetalPriceLocationMappingList(List<String> locationcodes,
			String metalTypeCode, Date applicableDate) {

		return metalPriceLocationMappingRepository.getMetalPriceLocationMappingWithCombination(locationcodes,
				metalTypeCode, applicableDate);
	}

	@Override
	public PagedRestResponse<List<MetalPriceConfigDto>> listMetalPriceConfig(String metalTypeCode,
			MetalPriceConfigRequestDto metalPriceConfigRequestDto, String configId,Pageable pageable) {
		List<MetalPriceConfigDto> metalConfigDtoList = new ArrayList<>();
		Page<MetalPriceConfigDaoExt> metalConfigList = metalPriceConfigRepository.findByCombination(metalTypeCode,
				metalPriceConfigRequestDto.getApplicableDate(), configId,pageable);
		for (MetalPriceConfigDaoExt metalPriceConfig : metalConfigList) {
			MetalPriceConfigDto metalPriceDto = (MetalPriceConfigDto) MapperUtil.getObjectMapping(metalPriceConfig,
					new MetalPriceConfigDto());
			metalConfigDtoList.add(metalPriceDto);
		}
		return new PagedRestResponse<>(metalConfigDtoList, metalConfigList);
	}

	@Override
	public PagedRestResponse<List<MetalPriceMappingResponseDto>> listMetalPriceLocation(String metalTypeCode, String id,
			List<String> marketCodes, List<String> locationCodes, Pageable pageable) {

		Page<MetalPriceLocationMappingDaoExt> pagedMetalPriceResponse;
		Page<MetalPriceLocationHistoryDaoExt> pagedMetalPriceHistory;
		pagedMetalPriceResponse = metalPriceLocationMappingRepository.findByMetalConfig(id, metalTypeCode, marketCodes,
				locationCodes, pageable);

		if (!pagedMetalPriceResponse.getContent().isEmpty()) {
			List<MetalPriceMappingResponseDto> metalPriceMappingList = new ArrayList<>();
			pagedMetalPriceResponse.forEach(metalPriceLocaitonMaping -> {
				MetalPriceMappingResponseDto metalPriceMappingResponseDto = (MetalPriceMappingResponseDto) MapperUtil
						.getObjectMapping(metalPriceLocaitonMaping, new MetalPriceMappingResponseDto());
				metalPriceMappingResponseDto.setMarketCode(metalPriceLocaitonMaping.getMarket().getMarketCode());
				metalPriceMappingResponseDto.setLocationCode(metalPriceLocaitonMaping.getLocation().getLocationCode());
				metalPriceMappingResponseDto
						.setMarketDescription(metalPriceLocaitonMaping.getMarket().getDescription());
				metalPriceMappingResponseDto
						.setLocationDescription(metalPriceLocaitonMaping.getLocation().getDescription());
				metalPriceMappingList.add(metalPriceMappingResponseDto);
			});
			return (new PagedRestResponse<>(metalPriceMappingList, pagedMetalPriceResponse));
		} else {
			pagedMetalPriceHistory = metalPriceLocationHistoryRepository.findByMetalConfig(id, metalTypeCode,
					marketCodes, locationCodes, pageable);

			List<MetalPriceMappingResponseDto> metalPriceMappingList = new ArrayList<>();
			pagedMetalPriceHistory.forEach(metalPriceLocaitonMaping -> {
				MetalPriceMappingResponseDto metalPriceMappingResponseDto = (MetalPriceMappingResponseDto) MapperUtil
						.getObjectMapping(metalPriceLocaitonMaping, new MetalPriceMappingResponseDto());
				metalPriceMappingResponseDto.setMarketCode(metalPriceLocaitonMaping.getMarket().getMarketCode());
				metalPriceMappingResponseDto.setLocationCode(metalPriceLocaitonMaping.getLocation().getLocationCode());
				metalPriceMappingResponseDto
						.setMarketDescription(metalPriceLocaitonMaping.getMarket().getDescription());
				metalPriceMappingResponseDto
						.setLocationDescription(metalPriceLocaitonMaping.getLocation().getDescription());
				metalPriceMappingList.add(metalPriceMappingResponseDto);
			});
			return (new PagedRestResponse<>(metalPriceMappingList, pagedMetalPriceHistory));
		}
	}

	@Override
	public MetalPriceLocationResponse listMetalPriceLocationDao(@Valid MetalPriceConfigRequestDto metalPriceRequest) {

		MetalPriceLocationResponse metalPriceLocationResponse = new MetalPriceLocationResponse();
		List<MetalPriceLocationMappingDto> responseList = new ArrayList<>();

		List<MetalPriceLocationMappingDaoExt> metalList = metalPriceLocationMappingRepository
				.findByApplicableDateAndLocationCode(metalPriceRequest.getApplicableDate(),
						CommonUtil.getLocationCode());

		CommonUtil.getLocationCode();
		metalList.forEach(metalRate -> {

			MetalPriceLocationMappingDto metalPriceLocationMappingDto = (MetalPriceLocationMappingDto) MapperUtil
					.getObjectMapping(metalRate, new MetalPriceLocationMappingDto());

			metalPriceLocationMappingDto.setMetalPriceConfigId(metalRate.getMetalPriceConfig().getId());
			metalPriceLocationMappingDto.setPriceType(metalRate.getMetalPriceConfig().getPriceType());
			metalPriceLocationMappingDto.setBasePrice(metalRate.getMetalPriceConfig().getBasePrice());
			metalPriceLocationMappingDto.setRemarks(metalRate.getMetalPriceConfig().getRemarks());
			metalPriceLocationMappingDto.setMarketCode(metalRate.getMarket().getMarketCode());
			metalPriceLocationMappingDto.setLocationCode(metalRate.getLocation().getLocationCode());
			metalPriceLocationMappingDto.setPriceType(metalRate.getMetalPriceConfig().getPriceType());
			responseList.add(metalPriceLocationMappingDto);

		});
		metalPriceLocationResponse.setMetalPriceList(responseList);

		return metalPriceLocationResponse;

	}

}
