/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.MarketMarkupMappingStage;
import com.titan.poss.location.dao.MetalPriceConfigStageDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MarketRate;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.dto.response.LocationPriceResponse;
import com.titan.poss.location.repository.CountryRepository;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.MarketMarkupMappingStageRepository;
import com.titan.poss.location.repository.MetalPriceConfigStagingRepository;
import com.titan.poss.location.service.LocationJobService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("locationSchedulerPublishToDataSyncService")
public class LocationJobServiceImpl implements LocationJobService {

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private MetalPriceConfigStagingRepository metalPriceConfigStageRepo;

	@Autowired
	private MarketMarkupMappingStageRepository marketMarkupStagingRepo;

	@Autowired
	private AsyncPriceServiceImpl asyncServiceImpl;

	private String authorizationToken;

	private static final String ERR_CORE_044 = "ERR-CORE-044";

	@Autowired
	private CountryRepository countryRepository;
	
	@Autowired
	private EngineServiceClient engineService;

	@Override
	public SchedulerResponseDto publishToDataSync() {
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
			List<SyncStaging> syncStagingList = new ArrayList<>();
			int i = -1;
			do {
				Pageable pageable = PageRequest.of(++i, 100, Sort.by("createdDate"));
				syncStagingList.clear();
				syncStagingList = locationSyncStagingRepository.findSyncStagingDetails(pageable);
				if (!syncStagingList.isEmpty()) {
					List<String> syncIdList = new ArrayList<>();
					syncStagingList.forEach(syncStaging -> {
						Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
								MapperUtil.getObjectMapperInstance().convertValue(
										MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
						if (response.status() == 200) {
							syncIdList.add(syncStaging.getId());
						}
					});
					if (!syncIdList.isEmpty())
						locationSyncStagingRepository.updateSyncStatus(syncIdList);
				}
			} while (!syncStagingList.isEmpty());
			locationSyncStagingRepository.deletePublishedMessage();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.LOCATION_DATA_SYNC.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	public String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}

	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil
				.verifyDetails(MapperUtil.getJsonString(vendorDto.getVendorDetails()));
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			Object obj = MapperUtil.getJsonFromString(MapperUtil.getJsonString(vendorDto.getVendorDetails().getData()));
			@SuppressWarnings("unchecked")
			Map<String, String> vendorDetailsMap = (Map<String, String>) obj;
			vendorDetailsMap.put("token", token);
			vendorDetailsMap.put("exp", exp);
			Map<String, Object> vendorMap = new LinkedHashMap<>();
			vendorMap.put("type", "TOKEN");
			vendorMap.put("data", vendorDetailsMap);
			VendorUpdateDto vendorUpdateDto = (VendorUpdateDto) MapperUtil.getObjectMapping(vendorDto,
					new VendorUpdateDto());
			vendorUpdateDto.setVendorDetails(
					MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	@Override
	@Transactional
	public SchedulerResponseDto triggerUpdateMaterialRate() {

		String metalPriceType = PriceTypeCodeEnum.F.toString();
		Date applicableDate = new Date();

		List<MetalPriceConfigStageDao> metalPriceConfigStageDaoList = insertToMaterialConfig(metalPriceType,
				applicableDate);

		insertToMetalRateLocationMapping(applicableDate, metalPriceConfigStageDaoList);
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.LOCATION_METAL_RATE_UPDATE.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;

	}

	private List<MetalPriceConfigStageDao> insertToMaterialConfig(String metalPriceType, Date applicableDate) {
		List<MetalPriceConfigStageDao> metalPriceConfigStageList = metalPriceConfigStageRepo
				.findByMetalTypeAndAppDateAndPriceType(applicableDate, metalPriceType);

		if (metalPriceConfigStageList.isEmpty()) {
			throw new ServiceException("No data in staging table [metal_config] to trigger a scheduler job",
					"ERR-CORE-036");
		}

		metalPriceConfigStageList
				.forEach(metalPriceConfigStageDao -> asyncServiceImpl.insertIntoMetalConfig(metalPriceConfigStageDao));
		return metalPriceConfigStageList;
	}

	/**
	 * @param materialTypeCode
	 * @param materialPriceType
	 * @param applicableDate
	 * @param materialPriceConfigStageDao
	 */
	private void insertToMetalRateLocationMapping(Date applicableDate,
			List<MetalPriceConfigStageDao> materialPriceConfigStageDaoList) {

		LocationPriceResponse locationPrice = new LocationPriceResponse();

		materialPriceConfigStageDaoList.forEach(materialPriceConfigStageDao -> {

			// fetch from market_code_mapping_staging

			// create request for API,
			// insert into main table
			List<MarketMarkupMappingStage> marketstagingList = marketMarkupStagingRepo
					.findByApplicableDateAndMetalTypeCode(applicableDate,
							materialPriceConfigStageDao.getMetalTypeCode());

			if (marketstagingList.isEmpty()) {
				throw new ServiceException("No data in staging table [market_mapping] to trigger a scheduler job",
						"ERR-CORE-036");
			}

			MetalPriceStagingRequestDto marketMaterialDto = new MetalPriceStagingRequestDto();

			List<MarketRate> marketRates = new ArrayList<>();
			marketstagingList.forEach(marketMaterialStaging -> {
				MarketRate marketRate = (MarketRate) MapperUtil.getDtoMapping(marketMaterialStaging, MarketRate.class);
				locationPrice.setReferenceId(marketMaterialStaging.getCorrelationId());
				marketRates.add(marketRate);
			});

			marketMaterialDto.setApplicableDate(applicableDate);
			marketMaterialDto.setApprovalId("SchedulerJOB");
			marketMaterialDto.setMarketRates(marketRates);
			marketMaterialDto.setMetalTypeCode(materialPriceConfigStageDao.getMetalTypeCode());
			asyncServiceImpl.insertIntoMarketMarkupMapping(marketstagingList, marketMaterialDto,
					materialPriceConfigStageDao.getBasePrice().intValue());
		});

	}
	@Override
	public SchedulerResponseDto updateFiscalYear() {
		List<String> locations = engineService.getAppBasedLocations();
		CountryDao countryDao = countryRepository.getCountryDetails(locations.get(0));
		if (countryDao.getFiscalYearStart() != null
				&& countryDao.getFiscalYearStart().equalsIgnoreCase(CalendarUtils.getCurrentDayFiscalYearMonth())) {
			Integer currentFiscalYear = CalendarUtils.getCurrentYear();
			if (!currentFiscalYear.equals(countryDao.getFiscalYear())) {
				countryDao.setFiscalYear(currentFiscalYear);
				countryRepository.save(countryDao);
			}
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.LOCATION_FISCAL_YEAR_UPDATE.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;

	}
}
