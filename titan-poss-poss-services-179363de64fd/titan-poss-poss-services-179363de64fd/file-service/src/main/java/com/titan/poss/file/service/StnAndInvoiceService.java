/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.util.List;

import com.titan.poss.core.dto.InvoiceResponseDto;
import com.titan.poss.core.dto.StnResponseDto;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface StnAndInvoiceService {

	void runStnJob(StnResponseDto stnResponse);

	void runInvoiceJob(InvoiceResponseDto invoiceResponse);

	public SyncStagingDto getLotStoneStagingDto(List<LotDetailsDao> lotStoneList, String locationCode);

	public SyncStagingDto getLotMaterialsStagingDto(List<LotMaterialDetailsDao> lotMaterialList, String locationCode);

	public String setItemDetails(String actualF1Value, String isHallMarking, String hallMarkingCode,
			String hallMarkingCentreName, String hallMarkedDate, String hallMarkRemarks, String hallMarkRemarks1);
}
