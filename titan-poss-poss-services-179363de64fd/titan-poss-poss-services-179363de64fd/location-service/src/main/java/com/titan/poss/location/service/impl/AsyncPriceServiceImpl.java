/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDaoExt;
import com.titan.poss.location.dao.MarketMarkupMappingStage;
import com.titan.poss.location.dao.MetalPriceConfigDaoExt;
import com.titan.poss.location.dao.MetalPriceConfigStageDao;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MarketRate;
import com.titan.poss.location.dto.request.MetalPriceMappingRequestDto;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.repository.MarketMarkupMappingRepositoryExt;
import com.titan.poss.location.repository.MarketMarkupMappingStageRepository;
import com.titan.poss.location.repository.MarketRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigStagingRepository;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.MetalService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("locationAsyncPriceServiceImpl")
public class AsyncPriceServiceImpl {

	private static final String CONFIG_REMARKS = "Update from Workflow";

	@Value("${country.code}")
	private String countryCode;

	@Autowired
	private CountryService countryService;

	@Autowired
	private MarketMarkupMappingStageRepository marketStagingRepo;

	@Autowired
	private MetalService metalService;
	

	@Autowired
	private MetalPriceConfigRepositoryExt metalPriceConfigRepository;

	@Autowired
	private MetalPriceConfigStagingRepository metalPriceConfigStageRepo;

	@Autowired
	private MarketMarkupMappingRepositoryExt marketMarkupMappingRepository;

	@Autowired
	private MarketRepositoryExt marketRepository;

	/**
	 * @param metalPriceConfigStageDao
	 */
//	@Async
	public MetalPriceConfigDaoExt insertIntoMetalConfig(MetalPriceConfigStageDao metalPriceConfigStageDao) {

		// get latest existing record..using priceType metalTypeCode applicable_date
		// [desc
		// modified
		// date]

		Pageable pageable = PageRequest.of(0, 1);
		List<MetalPriceConfigDaoExt> metalPriceConfigDaoExtList = metalPriceConfigRepository
				.findByMetalTypeCodeAndPriceTypeAndApplicableDate(metalPriceConfigStageDao.getMetalTypeCode(),
						metalPriceConfigStageDao.getPriceType(), metalPriceConfigStageDao.getApplicableDate(),
						pageable);
		if (!metalPriceConfigDaoExtList.isEmpty()) {
			MetalPriceConfigDaoExt metalPriceConfigDaoExt = metalPriceConfigDaoExtList.get(0);
			if ((metalPriceConfigDaoExt.getLastModifiedDate()
					.compareTo(metalPriceConfigStageDao.getPriceChangeTime()) > 0)) {
				throw new ServiceException("This is an Old Record", "ERR-LOC-070");
			}
		}

		// inserting to main table
		MetalPriceConfigDaoExt metalConfigDao = (MetalPriceConfigDaoExt) MapperUtil
				.getDtoMapping(metalPriceConfigStageDao, MetalPriceConfigDaoExt.class);
		metalConfigDao.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
		metalConfigDao.setId(UUID.randomUUID().toString());
		metalConfigDao.setRemarks(CONFIG_REMARKS);
		metalConfigDao = metalPriceConfigRepository.saveAndFlush(metalConfigDao);

		// delete from staging table
		metalPriceConfigStageRepo.deleteByCorrelationId(metalPriceConfigStageDao.getCorrelationId());
		return metalConfigDao;

	}

	/**
	 * @param marketMarkupMappingStageList
	 * @param marketMetalDto
	 * @param basePrice
	 */
	// @Async
	public void insertIntoMarketMarkupMapping(List<MarketMarkupMappingStage> marketMarkupMappingStageList,
			MetalPriceStagingRequestDto marketMetalDto, Integer basePrice) {
		List<String> marketCodeList = new ArrayList<>();
		insertIntoMarketMetalMapping(marketMarkupMappingStageList, marketCodeList, marketMetalDto);
		MetalPriceMappingRequestDto reqst = new MetalPriceMappingRequestDto();
		reqst.setRemarks("Setting forced price for a boutique from Workflow");
		reqst.setMarketCodes(marketCodeList);
		reqst.setApplicableDate(marketMetalDto.getApplicableDate());
		reqst.setPriceTypeCode(PriceTypeCodeEnum.F.toString());
		reqst.setBasePrice(basePrice);
		metalService.confirmMetalPriceLocationMapping(marketMetalDto.getMetalTypeCode(), reqst);

		// delete from staging table
		marketStagingRepo.deleteByCorrelationId(marketMarkupMappingStageList.get(0).getCorrelationId());
	}

	/**
	 * @param marketMarkupMappingStageList
	 * @param marketCodeList
	 */
	public void insertIntoMarketMetalMapping(List<MarketMarkupMappingStage> marketMarkupMappingStageList,
			List<String> marketCodeList, MetalPriceStagingRequestDto marketMetalDto) {

		Map<String, Date> marketPriceChangeMap = new HashMap<>();
		Map<String, MarketDao> marketMap = new HashMap<>();
		List<MarketMarkupMappingDaoExt> marketMetalDaoList = new ArrayList<>();
		marketMarkupMappingStageList.forEach(market -> marketCodeList.add(market.getMarketCode()));
		List<MarketDao> markets = marketRepository.getMarkets(marketCodeList, true);
		markets.forEach(market -> marketMap.put(market.getMarketCode(), market));
		if (markets.size() != marketMarkupMappingStageList.size()) {
			throw new ServiceException("Request Contains Inactive/Improper markets", "ERR-LOC-071");
		}

		marketMarkupMappingStageList.forEach(market -> {
			MarketMarkupMappingDaoExt marketMetalMappingDao = (MarketMarkupMappingDaoExt) MapperUtil
					.getDtoMapping(market, MarketMarkupMappingDaoExt.class);
			marketMetalMappingDao.setId(UUID.randomUUID().toString());
			// check for pricigmarket.get
//			marketMetalMappingDao.setMarkupFactor(BigDecimal.ONE);
			MarketMarkupMappingDaoExt marketFactorDetails = marketMarkupMappingRepository
					.findByMarketCodeAndMetalTypeCode(market.getMarketCode(), market.getMetalTypeCode());
			if (marketFactorDetails != null) {
				marketMetalMappingDao.setMarkupFactor(marketFactorDetails.getMarkupFactor());
			} else {
				marketMetalMappingDao.setMarkupFactor(BigDecimal.ONE);
			}
			marketMetalMappingDao.setMarket(marketMap.get(market.getMarketCode()));
			marketMetalMappingDao.setMetalTypeCode(market.getMetalTypeCode());
			marketMetalMappingDao.setCurrencyCode(countryService.getCountry(countryCode).getCurrencyCode());
			marketPriceChangeMap.put(market.getMarketCode(), market.getPriceChangeTime());
			marketMetalDaoList.add(marketMetalMappingDao);

		});

		List<MarketMarkupMappingDaoExt> deleteMarketingList = marketMarkupMappingRepository
				.findByCombination(marketCodeList, marketMetalDto.getMetalTypeCode());

		List<String> deleteIds = new ArrayList<>();
		deleteMarketingList.forEach(market -> {
			deleteIds.add(market.getId());
			if ((market.getLastModifiedDate()
					.compareTo(marketPriceChangeMap.get(market.getMarket().getMarketCode())) > 0)) {
				throw new ServiceException("This is an Old Record", "ERR-LOC-070");
			}

		});

		marketMarkupMappingRepository.deleteByIdIn(deleteIds);
		
		// save the new records
		marketMarkupMappingRepository.saveAll(marketMetalDaoList);
	}

}
