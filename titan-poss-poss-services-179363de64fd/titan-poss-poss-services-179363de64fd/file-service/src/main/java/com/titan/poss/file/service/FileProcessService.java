/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.core.dto.FileUploadResponseData;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileProcessService {

	FileUploadResponseData processDataFromFile(String filePath, String fileName, String fileId, String id);
}
