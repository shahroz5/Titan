package com.titan.poss.config.service;

import feign.Response;

public interface IntegrationService {

	/**
	 * 
	 * @param filePath
	 * @return BooleanResponse
	 */
	void uploadFileToOnlineBucket(String filePath);

	Response getFileInByteArrayResponse(String path);
}
