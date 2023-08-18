/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.DayWiseRevenueDto;
import com.titan.poss.sales.dto.response.TodayRevenueDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("RevenueService")
public interface RevenueService {

	/**
	 * @param revenueDateDto
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<DayWiseRevenueDto>> getDayWiseRevenue(RevenueDateDto revenueDateDto, Pageable pageable);
	
	/**
	 * API to get today's revenue collected in BTQ & EGHS
	 * 
	 * @param locationCode
	 * @return ListResponse<TodayRevenueDto>
	 * @throws ParseException
	 */
	ListResponse<TodayRevenueDto> getTodayRevenues(String locationCode);

	
	ListResponse<GhsTodayRevenueDto> getGhsRevenue( String locationCode);
	
    Map<String, List<ServicePossRevenueDto>> getServiceRevenue( String locationCode);
}
