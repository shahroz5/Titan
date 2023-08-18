/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.List;
import java.util.Map;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServiceMetalRequestDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
/**
 * Ghs Interface GhsService
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ServicePOSS {

//	public GhsCreditNoteTransferDto transferCreditNotesToServicePoss(String vendorCode,
//			GhsCreditNoteTransferDto ghsCreditNoteTransferDto);
//
//	public ListResponse<GhsCreditNoteDto> getCreditNotesFromServicePoss(String vendorCode);
//
//	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtServicePoss(int ghsDocNo, int fiscalYear, String vendorCode);
//
	public Map<String, List<ServicePossRevenueDto>> getServicePossTodayRevenue(ServicePossRequestDto servicePossRequestDto);


	public ServiceCashCollectedDto getCashCollectedAtServicePoss(String mobileNo,String locationCode,
			String businessDate);
	
	public Map<String, List<ServicePossRevenueDto>> getServicePossTodayRevenueForEod(ServicePossRequestDto servicePossRequestDto);
	
	public Object updateBtqMetalRate(List<ServiceMetalRequestDto> serviceMetalRequestDtoList);
	
//	public StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode);

	
	
}
