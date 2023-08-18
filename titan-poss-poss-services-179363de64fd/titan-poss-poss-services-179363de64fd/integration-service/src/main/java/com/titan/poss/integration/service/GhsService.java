/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.Date;

import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsCreditNoteUpdateResponseDto;
import com.titan.poss.core.dto.GhsDocsResponseDto;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.GhsRedeemAccountResponseDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;
import com.titan.poss.integration.eghs.generated.POSSBTQGoldPriceMasterDO;
import com.titan.poss.integration.dto.response.GhsCreditNoteDto;
import com.titan.poss.integration.dto.response.GhsTodayRevenueDto;

/**
 * Ghs Interface GhsService
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface GhsService {

	public GhsCreditNoteTransferDto transferCreditNotesToGhs(String vendorCode,
			GhsCreditNoteTransferDto ghsCreditNoteTransferDto);

	public ListResponse<GhsCreditNoteDto> getCreditNotesFromGhs(String vendorCode);

	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtGhs(int ghsDocNo, int fiscalYear, String vendorCode);

	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenue(BusinessDateDto businessDate, String vendorCode);

	public GhsDiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, int discountVoucherNo,
			int accountNo);

	public GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(String vendorCode, String discountVoucherNo,
			int accountNo, String transactionId);

	public BusinessDayActivityDto bodAtGhs(String vendorCode, BusinessDateDto businessDateDto);

	public BusinessDayActivityDto eodAtGhs(String vendorCode, BusinessDateDto businessDateDto);

	public GhsAccountDetailsResponseDto getGhsAccountDetails(String vendorCode, int accountNo);

	public GhsCashResponseDto getCashCollectedAtGHS(String vendorCode, String ulpId, String mobileNo,
			String businessDate);

	public ListResponse<GhsDocsResponseDto> getGhsDocs(int customerId, int accountNo, String vendorCode);

	public PossCashPaidDetailsDto getCashCollectedAtPOSS(String searchType, String searchValue, String businessDate,
			String locationCode);

	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueForEod(BusinessDateDto businessDateDto,
			String vendorCode);

	public void updateDiscountVoucher(String vendorCode, String discountVoucherNo, int accountNo, String transactionId,
			String status);

	public GhsRedeemAccountResponseDto redemptionGhsAccount(String vendorCode, GhsRedeemAccountDto ghsRedeemAccountDto);

	public GhsAccountMasterUpdateDto updateGhsAccountMaster(String vendorCode,
			GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto);

	public BooleanResponse updateGhsAccountMasterStatus(String vendorCode, Integer accountNo, String status);

	public StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode);
	
	public BooleanResponse checkBODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode);
	
	public BooleanResponse checkEODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode);

	public BoutiqueGoldPriceMasterDto updateGR(String vendorCode,BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto);
	
	
	
}
