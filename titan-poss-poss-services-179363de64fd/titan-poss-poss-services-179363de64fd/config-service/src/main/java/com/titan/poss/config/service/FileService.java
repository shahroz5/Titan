package com.titan.poss.config.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.config.dto.response.FileUploadResponseDto;

@Service
public interface FileService {

	FileUploadResponseDto uploadFile(String docType, String fileType, MultipartFile file);

	ResponseEntity<Resource> getFileById(String fileId,String fileName);

}
