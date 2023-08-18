/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.GIFT_VOUCHER_CONTROLLER;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftStatusResponseDto;
import com.titan.poss.core.dto.GiftValidityRequestDto;
import com.titan.poss.core.dto.GiftValidityResponseDto;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.service.GiftVoucherService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(GIFT_VOUCHER_CONTROLLER)
@RequestMapping("payment/v2/gift-vouchers")
public class GiftVoucherController {

	@Autowired
	private GiftVoucherService giftVoucherService;

	private static final String GIFT_VOUCHER_VIEW_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.GIFT_VOUCHER_VIEW + "' )";

	private static final String GIFT_VOUCHER_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.GIFT_VOUCHER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of all gift voucher details or based on the
	 * serialNumber, seriesOfSerialNumber or listOfStatus
	 * 
	 * @param serialNo
	 * @param giftVoucherStatus
	 * @param pageable
	 * @return PagedRestResponse<List<GiftDetailsResponseDto>>
	 */
	@ApiOperation(value = "View the list of Gift Voucher Details", notes = "This API returns the list of all the Gift Voucher Details or based on **serialNo** and **seriesOfSerialNo** and **listOfStatus**"
			+ "</br></br>::::In this Api user will be able to filter based on serialNo for EX:- 765432 or seriesOfSerialNo for EX:- 765432-82 **NOTE** :- **The Difference Should be 50 ** OR 1001,1002,1003,1004,1005,1006 and listOfStatus::::</br>")
	@GetMapping
	@ApiPageable
	@PreAuthorize(GIFT_VOUCHER_VIEW_PERMISSION + " OR " + "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public PagedRestResponse<List<GiftDetailsResponseDto>> listGiftDetails(
			@RequestParam(required = false) String serialNo,
			@RequestParam(required = false) @ApiParam(required = false, value = "Gift voucher status", allowableValues = "ISSUEDTORO, FOR_INWARDING, REDEEMABLE, BLOCKED, REDEEMED, CANCELLED, FORCECLOSED, INACTIVE, EXPIRED, AUTO_CANCELLATION") List<@ValueOfEnum(message = PaymentConstants.INVALID_GIFT_VOUCHER_STATUS, enumClass = GiftVoucherStatusEnum.class) String> giftVoucherStatus,
			@ApiIgnore Pageable pageable) {

		return giftVoucherService.listGiftDetails(serialNo, giftVoucherStatus, pageable);
	}

	/**
	 * This method will extend the validity
	 * 
	 * @param giftValidity
	 * @return List<ExtendValidityResponseDto>
	 */
	@ApiOperation(value = "Extend the validity by taking the validity date ", notes = "This method will extend the validity based on **serialNo** and status should be Redemable."
			+ "if status is not redemable he can not extend the validity. and max we can update validity upto 90 days and according to brand level </br>,/br>"
			+ "configuration there will be one offset till when we can increase the date")
	@PatchMapping(value = "/validity")
	@PreAuthorize(GIFT_VOUCHER_ADD_EDIT_PERMISSION)
	public ListResponse<GiftValidityResponseDto> extendGiftValidity(
			@RequestBody @Valid GiftValidityRequestDto giftValidity) {

		return giftVoucherService.updateGiftValidity(giftValidity);
	}

	/**
	 * This method will update the status of the gift voucher
	 * 
	 * @param giftStatus
	 * @return UpdateStatusResponseDto
	 */
	@ApiOperation(value = "This method will update the status of the gift voucher ", notes = " This method will update the status of the gift voucher based on **serialNo**"
			+ "if store user then it will make redemable to redemed </br></br>" + "if commercial user then :-"
			+ "            a. ")
	@PutMapping(value = "/status")
	@PreAuthorize(GIFT_VOUCHER_ADD_EDIT_PERMISSION + " OR " + "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public ListResponse<GiftStatusResponseDto> updateGiftStatus(@RequestBody @Valid GiftStatusRequestDto giftStatus) {
		return giftVoucherService.updateGiftStatus(giftStatus);
	}

}
