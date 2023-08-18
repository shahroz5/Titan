/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.List;
import java.util.Map;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.payment.dao.PayerLocationMappingDaoExt;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class PayerBankConfigLocationRespondDto {
	Map<String, SyncStagingDto> stagingResponse;
	List<PayerLocationMappingDaoExt> addPayerlocationDaoList;
	
	public PayerBankConfigLocationRespondDto(Map<String, SyncStagingDto> stagingResponse,
			List<PayerLocationMappingDaoExt> addPayerlocationDaoList) {
		this.stagingResponse = stagingResponse;
		this.addPayerlocationDaoList=addPayerlocationDaoList;
	}
	
	public List<PayerLocationMappingDaoExt> getAddedPayerLocation() {
		return addPayerlocationDaoList;
	}
	
	public Map<String, SyncStagingDto> getStagingResponse() {
		return stagingResponse;
	}
}
