/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.config.dto.request.StandardMetalRateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PriceService {

	/**
	 * @param gepPriceRequest
	 * @return
	 */
	public GepPriceResponseDto getGepPriceDetails(GepPriceRequest gepPriceRequest);

	/**
	 * @param offset
	 * @param materialType
	 * @param applicableDate
	 * @return
	 */
	Map<String, StandardPriceResponseDto> getStandardMetalRate(String locationCode);

	/**
	 * @return
	 */
	ListResponse<MetalRateDto> getMetalRate(Date businessDate);

	/**
	 * @param orderPriceRequest
	 * @return
	 */
	PriceResponseDto getPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode);
	
	

	/**
	 * @param metalPriceRequest
	 * @return ListResponse<HistoryPriceResponse>
	 */
	public ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest);

	/**
	 * @param metalRateDto
	 * @return
	 */
	public Map<String, StandardPriceResponseDto> getAvailableMetalRate(StandardMetalRateDto metalRateDto);

	/**
	 * @param tepPriceRequest
	 * @return
	 */
	public TepPriceResponseDto getTepPriceDetails(TepPriceRequest tepPriceRequest);
	
	
	public CutPieceTepPriceResponseDto getCutPieceTepPriceDetails(TepPriceRequest tepPriceRequest);

	/**
	 * @param orderPriceRequest
	 * @return
	 */
	PriceResponseDto getCOPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode);
	
	/**
	 * 
	 * @param orderPriceRequest
	 * @param locationCode
	 * @return
	 */
	public PriceResponseDto findPrice(OrdersPriceRequest orderPriceRequest, String locationCode);

	public ListResponse<MetalRateDto> getMetalPriceDetails(Date businessDate);

	List<PriceResponseDto> getConversionPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode);
}
