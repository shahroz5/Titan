package com.titan.poss.config.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.config.service.IntegrationService;
import com.titan.poss.core.service.clients.IntegrationServiceClient;

import feign.Response;

@Service
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;
	
	@Override
	public void uploadFileToOnlineBucket(String filePath) {

		integrationServiceClient.uploadFileToOnlineBucket(filePath);
	}

	@Override
	public Response getFileInByteArrayResponse(String path) {
		return integrationServiceClient.getFileInByteArrayResponse(path);
	}
}
