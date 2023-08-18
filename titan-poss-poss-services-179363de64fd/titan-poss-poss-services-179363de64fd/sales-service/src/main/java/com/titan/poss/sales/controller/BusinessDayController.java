/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.GhsOfflineEODRequestDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.sales.dto.response.DayMasterDto;
import com.titan.poss.sales.service.BusinessDayService;

import io.swagger.annotations.ApiParam;

/**
 * Controller class for Day Activity.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesDayController")
@RequestMapping("sales/v2/business-days")
public class BusinessDayController {

	@Autowired
	private BusinessDayService businessDayService;

	private static final String EOD_PERMISSION = START + SalesAccessControls.EOD + END;
	private static final String BOD_PERMISSION = START + SalesAccessControls.EOD + END;

	// banking+revenue+walkins(view)
	//@formatter:off
	private static final String EOD_DATE_VIEW_PERMISSION = START + SalesAccessControls.EOD + END + OR
			+ START + SalesAccessControls.BANK_DEPOSITE_VIEW + END + OR
			+ START + SalesAccessControls.TODAYS_REVENUE_VIEW + END + OR
			+ START + SalesAccessControls.WALK_INS_DETAILS_VIEW + END ;
	//@formatter:on

	/**
	 * This method will be called to get the business day.
	 */
	@GetMapping
	@PreAuthorize(EOD_PERMISSION + PreAuthorizeDetails.OR + BOD_PERMISSION)
	@ApiParam(name = "This method will be called to get the business day", value = "This method will be called to get the business day")
	public BusinessDayDto getBusinessDay() {

		return businessDayService.getBusinessDay();
	}

	/**
	 * This method will be called to get the business day for which BOD needs to be
	 * done. If there are any pending EOD in the System this API will throw error.
	 * 
	 */
	@GetMapping("bod")
	@PreAuthorize(BOD_PERMISSION)
	@ApiParam(name = "This method will be called to get the business day for which BOD needs to be done. If there are any pending EOD in the System this API will throw error. ", value = "This method will be called to get the business day for which BOD needs to be done. If there are any pending EOD in the System this API will throw error. ")
	public DayMasterDto getBodBusinessDay() {

		return businessDayService.getBodBusinessDay();
	}

	/**
	 * This method will be called while starting the EOD process . If there are any
	 * pending EOD in the System this API will throw error.
	 * 
	 */

	@PutMapping("bod")
	@PreAuthorize(BOD_PERMISSION)
	@ApiParam(name = "This method will be called to start the BOD activity for the business day. If there are any pending EOD in the System this API will throw error. ", value = "This method will be called to get the business day for which BOD needs to be done. If there are any pending EOD in the System this API will throw error. ")
	public DayMasterDto startBodActivity() {

		return businessDayService.startBodActivity();
	}

	/**
	 * This method will perform the BOD (Beginning of the day) activity.
	 * 
	 * @param businessDateDto
	 */
	@PostMapping(value = "/bod")
	@PreAuthorize(BOD_PERMISSION)
	@ApiParam(name = "This method will perform the BOD (Beginning of the day) activity", value = "This method will perform the BOD (Beginning of the day) activity")
	public DayMasterDto performBODActivity(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto) {

		return businessDayService.performBODActivity(businessDateDto);
	}

	/**
	 * This method will perform the BOD (Beginning of the day) activity for GHS.
	 * 
	 * @param businessDateDto
	 */
	@PostMapping(value = "/bod/ghs")
	@PreAuthorize(BOD_PERMISSION)
	@ApiParam(name = "This method will perform the BOD (Beginning of the day) activity for GHS", value = "This method will perform the BOD (Beginning of the day) activity for GHS")
	public DayMasterDto performGHSBODActivity(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto) {

		return businessDayService.performGHSBODActivity(businessDateDto);
	}

	/**
	 * This method will be called to get the business day for which EOD needs to be
	 * done. If there are any pending BOD in the System this API will throw error.
	 * This API will start the EOD process. No Customer transaction will be allowed
	 * in Boutique.
	 */
	@GetMapping("eod")
	@PreAuthorize(EOD_DATE_VIEW_PERMISSION)
	@ApiParam(name = "This method will be called to get the business day for which EOD needs to be done. If there are any pending BOD in the System this API will throw error.", value = "This method will be called to get the business day for which EOD needs to be done. If there are any pending BOD in the System this API will throw error.")
	public DayMasterDto getEodBusinessDay() {

		return businessDayService.getEodBusinessDay();
	}

	@PutMapping("eod")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will be called to start the EOD process for the business day", value = "This method will be called to start the EOD process for the business day. If there are any pending BOD in the System this API will throw error.")
	public DayMasterDto startEodActivity() {

		return businessDayService.startEodActivity();
	}

	/**
	 * This method will perform the EOD (End of the day) activity.
	 * 
	 * @param eodRequest
	 */
	@PostMapping(value = "/eod")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will perform the EOD (End of the day) activity", value = "This method will perform the EOD (End of the day) activity")
	public DayMasterDto performEODActivity(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDate) {

		return businessDayService.performEODActivity(businessDate);
	}

	/**
	 * This method will perform the EOD (End of the day) activity GHS.
	 * 
	 * @param eodRequest
	 */
	@PostMapping(value = "/eod/ghs")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will perform the EOD (End of the day) activity", value = "This method will perform the EOD (End of the day) activity")
	public DayMasterDto performGHSEODActivity(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDate) {

		return businessDayService.performGHSEODActivity(businessDate);
	}

	/**
	 * This method will perform the revenue consolidation in boutique.
	 * 
	 * @param businessDate
	 */
	@PostMapping(value = "/eod/revenue")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will perform the revenue consolidation in boutique", value = "This method will perform revenue consolidation in boutique")
	public BooleanResponse performRevenueCollection(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDate) {

		return businessDayService.performRevenueCollection(businessDate);
	}

	/**
	 * This method will perform the revenue consolidation in GHS.
	 * 
	 * @param businessDate
	 */
	@PostMapping(value = "/eod/ghs/revenue")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will perform the revenue consolidation in GHS", value = "This method will perform revenue consolidation in GHS")
	public BooleanResponse performGHSRevenueCollection(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDate) {

		return businessDayService.performGHSRevenueCollection(businessDate);
	}

	/**
	 * This method will save the revenue details of offline GHS.
	 * 
	 * @param businessDate
	 */
	@PostMapping(value = "/eod/ghs/offline/revenue")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will save the revenue details of offline GHS.", value = "This method will save the revenue details of offline GHS.")
	public BooleanResponse performOfflineGHSRevenueCollection(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) GhsOfflineEODRequestDto ghsOfflineEOD) {

		return businessDayService.performOfflineGHSRevenueCollection(ghsOfflineEOD);
	}
	
	/**
	 * This method will perform the revenue consolidation in SERVICE.
	 * 
	 * @param businessDate
	 */
	@PostMapping(value = "/eod/service/revenue")
	@PreAuthorize(EOD_PERMISSION)
	@ApiParam(name = "This method will perform the revenue consolidation in GHS", value = "This method will perform revenue consolidation in GHS")
	public BooleanResponse performServiceRevenueCollection(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDate) {

		return businessDayService.performServiceRevenueCollection(businessDate);
	}

}
