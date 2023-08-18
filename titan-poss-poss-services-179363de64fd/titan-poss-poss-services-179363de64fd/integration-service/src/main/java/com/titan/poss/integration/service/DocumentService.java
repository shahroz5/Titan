/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import java.io.File;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.integration.dto.FileUploadResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface DocumentService {

	void uploadFileByPath(String filePath);

	PresignedUrlDto getPresignedUrlOfObjects(Set<String> objectKeys, String documentTypeStr);

	FileUploadResponseDto uploadMultipartFiles(MultipartFile file, String documentTypeStr, String id);

	void updateTempFile(String oldDocumentPath, String newDocumentPath, String documentTypeStr);

	byte[] getFileByPath(String filePath, HttpServletResponse response);

	void deleteFileByPath(String filePath);
	
//	public String uploadMultipartBackupFile(MultipartFile file);
	
	public String uploadBackupFile(File file);
	
	public String uploadBackupFile();
}
