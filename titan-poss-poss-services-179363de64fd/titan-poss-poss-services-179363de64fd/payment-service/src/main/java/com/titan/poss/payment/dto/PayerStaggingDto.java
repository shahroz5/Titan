/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.List;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.payment.dao.PayerDetailsDaoExt;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PayerStaggingDto {
	
	private SyncStagingDto syncStagging;
	private List<PayerDetailsDaoExt> payerDetails;

}
