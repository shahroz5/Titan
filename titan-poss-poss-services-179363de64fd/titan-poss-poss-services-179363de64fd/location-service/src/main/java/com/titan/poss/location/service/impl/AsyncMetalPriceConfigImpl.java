package com.titan.poss.location.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MetalPriceConfigDaoExt;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MarketRate;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.repository.MarketRepositoryExt;
import com.titan.poss.location.repository.MetalPriceConfigRepositoryExt;

import lombok.extern.slf4j.Slf4j;

@Service("locationAsyncMetalPriceConfigImpl")
@Slf4j
public class AsyncMetalPriceConfigImpl {

	@Autowired
	private PriceServiceImpl priceService;

	@Autowired
	private MarketRepositoryExt marketRepository;

	@Autowired
	private MetalPriceConfigRepositoryExt metalPriceConfigRepository;
	
	@Async
	public void validateMetalPriceConfig( Date applicableDate,String metalTypeCode) {

		log.info("In Async Validate Metal ");
		
		List<MetalPriceConfigDaoExt> metalPriceConfigs = metalPriceConfigRepository
				.findByPriceTypeAndMetalCodeAndApplicableDate(PriceTypeCodeEnum.F.toString(),metalTypeCode,applicableDate);
		
		if(!metalPriceConfigs.isEmpty() && metalPriceConfigs!=null && metalPriceConfigs.size()==1)
		{
			
			MetalPriceStagingRequestDto marketMateriaDto=new MetalPriceStagingRequestDto();
			List< MarketRate> marketRates=new ArrayList<MarketRate>();
			Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
			Page<MarketDao> marketsPage = marketRepository.findByIsActive(true, pageable);
			BigDecimal addAmount=BigDecimal.ZERO;
			BigDecimal deductAmount=BigDecimal.ZERO;
			//List<String> activeMarkets = new ArrayList<>();
			for (MarketDao market : marketsPage) {
				MarketRate marketRate=new MarketRate();
				marketRate.setMarketCode(market.getMarketCode());
				marketRate.setAddAmount(addAmount);
				marketRate.setDeductAmount(deductAmount);
				marketRates.add(marketRate);
			}
			marketMateriaDto.setApplicableDate(applicableDate);
			marketMateriaDto.setApprovalId("System");
			marketMateriaDto.setMarketRates(marketRates);
			marketMateriaDto.setMetalTypeCode(metalTypeCode);
			//log.info((new Timestamp(System.currentTimeMillis())).toString());
			priceService.updateMetalPriceMapping(marketMateriaDto);
		}	
	}
}
