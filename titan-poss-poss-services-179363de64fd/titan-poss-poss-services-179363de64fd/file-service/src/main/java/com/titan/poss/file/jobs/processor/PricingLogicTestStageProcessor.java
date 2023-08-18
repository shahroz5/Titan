/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.PricingLogicTestDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PricingLogicTestStageProcessor
		implements ItemProcessor<PricingLogicTestDto, PricingLogicTestDto>, StepExecutionListener {

	@Autowired
	private EngineServiceClient engineServiceClient;

	private String authorizationToken;

	@Override
	public PricingLogicTestDto process(PricingLogicTestDto item) throws Exception {
		try {
			if (!StringUtils.isEmpty(item.getLocationCode())) {
				PriceResponseDto priceDetails = engineServiceClient.getPriceDetailsWithHeader(authorizationToken,
						getOrderRequest(item), item.getLocationCode());
				if (priceDetails != null) {
					item.setCalculatedMakingCharge(
							priceDetails.getPriceDetails().getMakingChargeDetails().getPreDiscountValue());
					item.setCalculatedMetalPrice(
							priceDetails.getPriceDetails().getMetalPriceDetails().getPreDiscountValue());
					item.setCalculatedStoneValue(
							priceDetails.getPriceDetails().getStonePriceDetails().getPreDiscountValue());
					item.setCfaProductCode(priceDetails.getProductGroupCode());
					item.setComplexityCode(priceDetails.getComplexityCode());
					item.setMakingChargePercentage(
							priceDetails.getPriceDetails().getMakingChargeDetails().getMakingChargePercentage());
				}
				item.setResult(comparePrices(item));
			} else {
				item.setRemarks("Location code is required");
			}
		} catch (Exception e) {
			item.setRemarks(e.getMessage());
		}
		return item;
	}

	private boolean comparePrices(PricingLogicTestDto item) {
		return item.getMetalPrice().compareTo(item.getCalculatedMetalPrice()) == 0
				&& item.getStoneValue().compareTo(item.getCalculatedStoneValue()) == 0;
	}

	/**
	 * @param item
	 * @return
	 */
	private OrdersPriceRequest getOrderRequest(PricingLogicTestDto item) {
		OrdersPriceRequest orderPrice = new OrdersPriceRequest();
		orderPrice.setItemCode(item.getItemCode());
		orderPrice.setLotNumber(item.getLotNumber());
		Map<String, StandardPriceResponseDto> standardPriceMap = new HashMap<>();
		if (item.getGoldRate() != null && item.getGoldRate().compareTo(BigDecimal.valueOf(0)) != 0) {
			StandardPriceResponseDto standardPriceResponseDto = new StandardPriceResponseDto();
			standardPriceResponseDto.setApplicableDate(CalendarUtils.getCurrentDate());
			standardPriceResponseDto.setCurrency("INR");
			standardPriceResponseDto.setKarat(BigDecimal.valueOf(22));
			standardPriceResponseDto.setMetalTypeCode("J");
			standardPriceResponseDto.setPurity(BigDecimal.valueOf(91.6));
			standardPriceResponseDto.setRatePerUnit(item.getGoldRate());
			standardPriceMap.put("J", standardPriceResponseDto);
		}
		if (item.getSilverRate() != null && item.getSilverRate().compareTo(BigDecimal.valueOf(0)) != 0) {
			StandardPriceResponseDto standardPriceResponseDto = new StandardPriceResponseDto();
			standardPriceResponseDto.setApplicableDate(CalendarUtils.getCurrentDate());
			standardPriceResponseDto.setCurrency("INR");
			standardPriceResponseDto.setMetalTypeCode("P");
			standardPriceResponseDto.setPurity(BigDecimal.valueOf(95));
			standardPriceResponseDto.setRatePerUnit(item.getSilverRate());
			standardPriceMap.put("P", standardPriceResponseDto);
		}
		if (item.getPlatinumRate() != null && item.getPlatinumRate().compareTo(BigDecimal.valueOf(0)) != 0) {
			StandardPriceResponseDto standardPriceResponseDto = new StandardPriceResponseDto();
			standardPriceResponseDto.setApplicableDate(CalendarUtils.getCurrentDate());
			standardPriceResponseDto.setCurrency("INR");
			standardPriceResponseDto.setMetalTypeCode("L");
			standardPriceResponseDto.setPurity(BigDecimal.valueOf(95));
			standardPriceResponseDto.setRatePerUnit(item.getPlatinumRate());
			standardPriceMap.put("L", standardPriceResponseDto);
		}
		orderPrice.setStandardPrice(standardPriceMap);
		orderPrice.setMeasuredWeight(item.getMeasuredWeight());
		// setting default quantity 1
		orderPrice.setMeasuredQuantity((short) 1);
		return orderPrice;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		authorizationToken = stepExecution.getJobExecution().getJobParameters().getString(CommonConstants.AUTH_HEADER);
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
