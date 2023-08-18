/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PresignedDto;
import com.titan.poss.sales.dto.response.FileDetailsDto;
import com.titan.poss.sales.dto.response.PublishResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface FileService {

	public String uploadFile(String id, Integer customerId, String documentType, String fileType, MultipartFile file);

	public String updateTempFile(String id, Integer customerId, String documentType, String fileType, String tempId);

	public PublishResponse uploadFileTransactional(String id, Integer customerId, String documentType, String fileType,
			MultipartFile file);

	public void updateCustomerDocumentStatus(String id);

	public ListResponse<FileDetailsDto> listFileIds(String id, Integer customerId, String documentType, String fileType,
			String locationCode);

	public boolean isAnyFileUploaded(String id, Integer customerId, String documentType, String fileType);

	public PresignedDto getPresignedUrlById(String id, String locationCode);

	public ResponseEntity<Resource> getFileById(String id, String locationCode);

	public void deleteFileById(String id);

	public PublishResponse updateTempFileTransactional(String id, Integer customerId, String documentType,
			String fileType, String tempId);

	CustomerDocumentDto getCustomerDocDtoByIdAndLocationCode(String id, String locationCode);

}
