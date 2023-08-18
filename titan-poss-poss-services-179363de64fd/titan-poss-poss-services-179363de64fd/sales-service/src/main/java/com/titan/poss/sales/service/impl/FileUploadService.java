/*  
* Copyright 2019. Titan Company Limited
* All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import org.springframework.beans.factory.annotation.Value;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class FileUploadService {
	
	@Value("${docs.file.source.path}")
	private String fileBasePath;

	public static String generateFilePath() {
		
		return null;
	}
	
	


}
