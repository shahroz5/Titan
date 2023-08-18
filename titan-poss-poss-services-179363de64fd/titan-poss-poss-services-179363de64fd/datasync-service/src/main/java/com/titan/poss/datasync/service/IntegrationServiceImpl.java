/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsDocsResponseDto;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.GhsRedeemAccountResponseDto;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.CashMemoEntities;

import feign.Response;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("ApplicationVersionService")
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;


	@Override
	public ApiResponseDto callEpossAPI(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);
		log.trace("reqBody :- {}", MapperUtil.getJsonString(reqBody));
		return integrationServiceClient.callEpossAPI(epossApiReqDto);
	}

	@Override
	public Response callEpossAPIWoError(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);

		return integrationServiceClient.callEpossAPIWoError(epossApiReqDto);

	}

	@Override
	public Response runThirdPartyAPI(HttpMethod httpMethod, String url, Map<String, String> requestParams,
			Object reqBody) {

		ThirdPartyApiReqDto thirdPartyApiReqDto = new ThirdPartyApiReqDto();
		thirdPartyApiReqDto.setHttpMethod(httpMethod);
		thirdPartyApiReqDto.setUrl(url);
		thirdPartyApiReqDto.setRequestParams(requestParams);
		thirdPartyApiReqDto.setReqBody(reqBody);

		return integrationServiceClient.runThirdPartyAPI(thirdPartyApiReqDto);

	}

}
