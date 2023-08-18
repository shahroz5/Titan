/*  
l * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service.impl;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketMarkupMappingStage;
import com.titan.poss.location.dao.MetalPriceConfigDaoExt;
import com.titan.poss.location.dao.MetalPriceConfigStageDao;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MarketRate;
import com.titan.poss.location.dto.request.MetalPriceConfigRequest;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.dto.response.LocationPriceResponse;
import com.titan.poss.location.repository.MarketMarkupMappingStageRepository;
import com.titan.poss.location.repository.MarketRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigStagingRepository;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.PriceService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("locationPriceServiceImpl")
@Slf4j
public class PriceServiceImpl implements PriceService {

	@Value("${country.code}")
	private String countryCode;

	@Autowired
	private CountryService countryService;

	@Autowired
	private MarketMarkupMappingStageRepository marketStagingRepo;

	@Autowired
	private MetalPriceConfigStagingRepository metalPriceConfigStageRepo;

	@Autowired
	private AsyncPriceServiceImpl asyncServiceImpl;

	@Autowired
	private AsyncMetalPriceConfigImpl asyncMetalPriceConfigImpl;
	
	@Autowired
	private MetalPriceConfigRepositoryExt metalPriceConfigRepository;

	@Autowired
	private MarketRepositoryExt marketRepository;

	
	@Override
	public LocationPriceResponse updateMetalConfig(@Valid MetalPriceConfigRequest metalPriceRequestBase) {
		// insert into staging table
		// run rest in async process

		MetalPriceConfigRequest metalPriceRequest = (MetalPriceConfigRequest) MapperUtil
				.getDtoMapping(metalPriceRequestBase, MetalPriceConfigRequest.class);
		if (!metalPriceRequest.getPriceType().equals(PriceTypeCodeEnum.F.toString())) {
			throw new ServiceException("API is only applicable for F-forced price", "ERR-LOC-033");
		}
		validateRequest(metalPriceRequest.getApplicableDate(), metalPriceRequest.getMetalTypeCode());
		// check in DB if daily price is set or not.
		MetalPriceConfigDaoExt metalPriceConfig = metalPriceConfigRepository
				.findByApplicableDateAndMetalTypeCodeAndPriceType(metalPriceRequest.getApplicableDate(),
						metalPriceRequest.getMetalTypeCode(), PriceTypeCodeEnum.D.toString());

		if (metalPriceConfig == null) {
			throw new ServiceException("Daily price for applicable Date is not set", "ERR-LOC-045");
		}

		LocationPriceResponse locationPrice = new LocationPriceResponse();
		MetalPriceConfigStageDao metalPriceConfigStageDao = insertToMetalConfigStaging(metalPriceRequest);
		locationPrice.setReferenceId(metalPriceConfigStageDao.getCorrelationId());

		asyncServiceImpl.insertIntoMetalConfig(metalPriceConfigStageDao);
		asyncMetalPriceConfigImpl.validateMetalPriceConfig(metalPriceRequest.getApplicableDate(), metalPriceRequest.getMetalTypeCode());

		return locationPrice;
	}



	/**
	 * @param applicableDate
	 * @param metalTypeCode
	 */
	private void validateRequest(Date applicableDate, String metalTypeCode) {

		// check for applicable date is today's date
		String requestDate = CalendarUtils.formatDateToString(applicableDate, "YYYY-MM-DD");
		String currentDate = CalendarUtils.formatDateToString(new Date(), "YYYY-MM-DD");

		if (!requestDate.equals(currentDate)) {
			throw new ServiceException("Applicable date should be today's date", "ERR-LOC-065");
		}

		if (!MetalTypeCodeEnum.getUniqueMetals().contains(metalTypeCode)) {
			throw new ServiceException("Invalid metal type", "ERR-LOC-068");
		}

	}

	/**
	 * @param metalPriceRequest
	 * @return
	 */
	MetalPriceConfigStageDao insertToMetalConfigStaging(MetalPriceConfigRequest metalPriceRequest) {
		// inserting to staging
		String referenceId = UUID.randomUUID().toString();
		MetalPriceConfigStageDao metalConfigStageDao = (MetalPriceConfigStageDao) MapperUtil
				.getDtoMapping(metalPriceRequest, MetalPriceConfigStageDao.class);
		metalConfigStageDao.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
		metalConfigStageDao.setId(UUID.randomUUID().toString());
		metalConfigStageDao.setCorrelationId(referenceId);
		metalConfigStageDao.setPriceChangeTime(new Date());
		metalConfigStageDao = metalPriceConfigStageRepo.save(metalConfigStageDao);

		return metalConfigStageDao;
	}

	@Override
	public LocationPriceResponse updateMetalPriceMapping(MetalPriceStagingRequestDto marketMetalDto) {
		// @formatter:off
		// insert into staging table
		
		// run following in async process
		//call service api of confirm price.
		
			// insert into market_metal_mapping
			// insert into metal_price_location_mapping
			// insert into metal_price_location_history 

		// @formatter:on
		// get base price from the top value of config table.

		validateRequest(marketMetalDto.getApplicableDate(), marketMetalDto.getMetalTypeCode());

		Pageable pageable = PageRequest.of(0, 1);
		List<MetalPriceConfigDaoExt> metalConfigDaoList = metalPriceConfigRepository
				.findByMetalTypeAndAppDateAndPriceType(marketMetalDto.getMetalTypeCode(),
						marketMetalDto.getApplicableDate(), PriceTypeCodeEnum.F.toString(), pageable);

		if (metalConfigDaoList.isEmpty()) {
			throw new ServiceException(
					"Please insert base price configuration, as there is no base price set for today for specific metal type",
					"ERR-CORE-034");

		}

		LocationPriceResponse locationPrice = new LocationPriceResponse();
		List<MarketMarkupMappingStage> marketMarkupMappingStageList = insertIntoMarketMasterStagging(marketMetalDto);
		locationPrice.setReferenceId(marketMarkupMappingStageList.get(0).getCorrelationId());

		asyncServiceImpl.insertIntoMarketMarkupMapping(marketMarkupMappingStageList, marketMetalDto,
				metalConfigDaoList.get(0).getBasePrice().intValue());

		// scheduler call
		return locationPrice;
	}

	/**
	 * @param metalType
	 * @param marketMateriaDto
	 */
	private List<MarketMarkupMappingStage> insertIntoMarketMasterStagging(
			MetalPriceStagingRequestDto marketMateriaDto) {
		List<MarketMarkupMappingStage> marketMasterList = new ArrayList<>();
		String correlationId = UUID.randomUUID().toString();
		for (MarketRate marketRateStaging : marketMateriaDto.getMarketRates()) {

			MarketMarkupMappingStage marketMasterStaging = (MarketMarkupMappingStage) MapperUtil
					.getObjectMapping(marketRateStaging, new MarketMarkupMappingStage());

			marketMasterStaging.setId(UUID.randomUUID().toString());
			marketMasterStaging.setApprovalId(marketMateriaDto.getApprovalId());
			marketMasterStaging.setApplicableDate(marketMateriaDto.getApplicableDate());
			marketMasterStaging.setCorrelationId(correlationId);
			marketMasterStaging.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
			marketMasterStaging.setMetalTypeCode(marketMateriaDto.getMetalTypeCode());
			marketMasterStaging.setMarketCode(marketRateStaging.getMarketCode());
			marketMasterStaging.setPriceChangeTime(new Date());
			marketMasterList.add(marketMasterStaging);
		}
		return marketStagingRepo.saveAll(marketMasterList);

	}

}
