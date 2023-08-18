/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.controller;

import java.io.File;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.net.MediaType;
import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.integration.dto.FileUploadResponseDto;
import com.titan.poss.integration.service.DocumentService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("integrationS3IngestionController")
@RequestMapping("integration/v2/document")
public class DocumentController {

	@Autowired
	DocumentService documentService;

	@ApiOperation(value = "This method will upload the existing file into S3", notes = "Provide file path of existing file in server.<br/>"
			+ "And, it will check if the file exist in server, it will upload.")
	@PostMapping("/upload/file-path")
	public void uploadFileByPath(@RequestParam(value = "path") String filePath) {
		documentService.uploadFileByPath(filePath);
	}

	@ApiOperation(value = "This method will upload the file into S3", notes = "This method will upload the file into S3.")
	@PostMapping("/upload/file")
	public FileUploadResponseDto uploadMultipartFileToS3(@RequestParam(value = "file") MultipartFile file,
			@RequestParam @ValueOfEnum(enumClass = DocumentBucketEnum.class) String documentType,
			@ApiParam(value = "Provide permanent Id if available.") @RequestParam(required = false) String id) {
		return documentService.uploadMultipartFiles(file, id, documentType);
	}

	@ApiOperation(value = "This method will upload the file in local system to S3", notes = "This method will upload the file into S3.")
	@PostMapping("/upload/back-up/file")
	public String uploadDbBackupFileToS3(@RequestParam(value = "file") File file) {
		return documentService.uploadBackupFile(file);
	}
	
	@ApiOperation(value = "This method will update temp file to permanent file", notes = "This method will be required when permanent id is not there & file uploaded with temp key.</br>"
			+ "This will update old key to new key using permanent Id")
	@PostMapping("/update")
	public void updateTempFile(@RequestParam @ValueOfEnum(enumClass = DocumentBucketEnum.class) String documentType,
			@RequestParam String oldDocumentPath, @RequestParam String newDocumentPath) {

		documentService.updateTempFile(oldDocumentPath, newDocumentPath, documentType);
	}

	// PENDING use same request of file controller
	@ApiOperation(value = "This method will return Presigned URL for object keys", notes = "This method will provide temporary access to files.</br>"
			+ "'Object' variable in response will list all objectKey as key & corresponding presigned URL as value in the map")
	@GetMapping("/presigned-urls")
	public PresignedUrlDto getPresignedUrlOfObjects(
			@RequestParam @NotNull @Size(min = 1, max = 10) Set<@NotBlank String> objectKeys,
			@RequestParam @ValueOfEnum(enumClass = DocumentBucketEnum.class) String documentType) {
		return documentService.getPresignedUrlOfObjects(objectKeys, documentType);
	}

	@GetMapping("/download/file-path")
	public byte[] getFileByPath(@RequestParam(value = "path") String filePath, HttpServletResponse response) {
		return documentService.getFileByPath(filePath, response);
	}
	
	@GetMapping("/download/file-path1")
	public ResponseEntity<Resource> getFileByPath1(@RequestParam(value = "path") String filePath, HttpServletResponse response) {
		byte[] byteArray = documentService.getFileByPath(filePath, response);
		HttpHeaders header = new HttpHeaders();
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		Resource resource = new ByteArrayResource(byteArray);
		return ResponseEntity.ok().headers(header).contentLength(byteArray.length)
				.contentType(org.springframework.http.MediaType.APPLICATION_PDF).body(resource);
	}

	@DeleteMapping("file-path")
	public void deleteFileByPath(@RequestParam(value = "path") String filePath) {
		documentService.deleteFileByPath(filePath);
	}
}
