/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftStatusResponseDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "paymentContextId", name = "payment-service", configuration = FeignClientInterceptor.class)
public interface PaymentServiceClient {

	@GetMapping(value = "payment/v2/gift-vouchers")
	public PagedRestResponse<List<GiftDetailsResponseDto>> listGiftDetails(
			@RequestParam(name = "serialNo", required = false) String serialNo,
			@RequestParam(name = "giftVoucherStatus", required = false) List<@ValueOfEnum(message = "Invalid gift voucher", enumClass = GiftVoucherStatusEnum.class) String> giftVoucherStatus);

	@PutMapping(value = "payment/v2/gift-vouchers/status")
	public ListResponse<GiftStatusResponseDto> updateGiftStatus(@RequestBody @Valid GiftStatusRequestDto giftStatus);
	
	@GetMapping(value = "payment/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader);

	@PostMapping(value = "payment/v2/employee-loan/fetch-config-details")
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(@RequestParam(required = true, value = "employeeCode") String employeeCode,
			@RequestParam(required = true, value = "buissnessDate") Date buissnessDate,
			@RequestParam(required = true, value = "locationCode") String locationCode);
			
	
}
