/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.FileUploadResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileUploadService {

	FileUploadResponseDto processDataFromFile(String fileGroup, MultipartFile file, String param);

}
