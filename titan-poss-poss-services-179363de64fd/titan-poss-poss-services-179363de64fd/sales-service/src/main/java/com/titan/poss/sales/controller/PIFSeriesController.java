/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.PIFSeriesUpdateRequestDto;
import com.titan.poss.sales.dto.response.PIFSeriesDto;
import com.titan.poss.sales.service.PIFSeriesService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("PIFSeriesController")
@RequestMapping(value = "sales/v2/pif-series")
public class PIFSeriesController {

	@Autowired
	PIFSeriesService pifSeriesService;

	private static final String PIF_SERIES_VIEW_PERMISSION = START + SalesAccessControls.PIF_SERIES_VIEW + END;
	private static final String PIF_SERIES_ADD_EDIT_PERMISSION = START + SalesAccessControls.PIF_SERIES_ADD_EDIT + END;

	/**
	 * This Method will return the list of of PIF series
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<PIFSeriesDto>>
	 */
	@ApiOperation(value = "View the list of PIF Series Master", notes = "This API returns the list of PIF Series Master")
	@ApiPageable
	@GetMapping
	@PreAuthorize(PIF_SERIES_VIEW_PERMISSION)
	public PagedRestResponse<List<PIFSeriesDto>> listPifSeries(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {

		return pifSeriesService.listPifSeries(isActive, pageable);
	}

	/**
	 * This method will update the PIF series fromNo and toNo
	 * 
	 * @param pIFSeriesRequestDto
	 * @return List<PIFSeriesDto>
	 */
	@ApiOperation(value = "This API will update the fromNo and toNo in pifSeries master", notes = "This API will update the fromNo and toNo in pifSeries master")
	@PatchMapping
	@PreAuthorize(PIF_SERIES_ADD_EDIT_PERMISSION)
	public ListResponse<PIFSeriesDto> updatePifSeries(
			@RequestBody @Valid PIFSeriesUpdateRequestDto pIFSeriesRequestDto) {

		return pifSeriesService.updatePifSeries(pIFSeriesRequestDto);

	}

}
