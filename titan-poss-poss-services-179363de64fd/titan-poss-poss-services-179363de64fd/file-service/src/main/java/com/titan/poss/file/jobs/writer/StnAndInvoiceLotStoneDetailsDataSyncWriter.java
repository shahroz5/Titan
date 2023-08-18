/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.List;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.product.dao.LotDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StnAndInvoiceLotStoneDetailsDataSyncWriter implements ItemWriter<LotDetailsDao>, StepExecutionListener {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	private String locationCode;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends LotDetailsDao> lotStones) throws Exception {

		SyncStagingDto data = stnAndInvoiceService.getLotStoneStagingDto((List<LotDetailsDao>) lotStones, locationCode);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		locationCode = stepExecution.getJobExecution().getExecutionContext().getString("locationCode");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
