/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.io.File;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.integration.dto.FileUploadResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface StorageService {

	public PutObjectResult uploadFile(String bucketName, String key, File file);

	public PresignedUrlDto getUrlForListOfObject(Set<String> objectKeys, String bucketName);

	public FileUploadResponseDto uploadFile(String bucketName, String commonKey, MultipartFile multipartFile,
			String fileName);

	public byte[] getFile(String bucketName, String key);

	public void updateKey(String oldDocumentPath, String newDocumentPath, String bucketName);

	void deleteFile(String bucketName, String key);

}
