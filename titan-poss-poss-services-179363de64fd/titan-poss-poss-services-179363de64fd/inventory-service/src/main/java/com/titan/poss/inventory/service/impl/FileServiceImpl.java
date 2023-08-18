/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.service.clients.FileServiceClient;
import com.titan.poss.inventory.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class FileServiceImpl implements FileService {

	@Autowired
	private FileServiceClient fileServiceClient;

	@Async
	@Override
	public void runReturnInvoiceJob(Integer stockInvoiceId, String token, String cookie) {

		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileIntegrationConstants.RETURN_INVOICE_JOB);
		Map<String, String> jobParams = new HashMap<>();
		jobParams.put("stockInvoiceId", stockInvoiceId.toString());
		jobRequest.setJobParams(jobParams);
		fileServiceClient.runAJob(token, cookie, jobRequest);
	}

	@Async
	@Override
	public void runIbtStnJob(Integer stockTransferId, String token, String cookie) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileIntegrationConstants.IBT_STN_JOB);
		Map<String, String> jobParams = new HashMap<>();
		jobParams.put("stockTransferId", stockTransferId.toString());
		jobRequest.setJobParams(jobParams);
		fileServiceClient.runAJob(token, cookie, jobRequest);
	}

}
