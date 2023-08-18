package com.titan.poss.config.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.config.dto.response.FileUploadResponseDto;
import com.titan.poss.config.service.FileService;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Validated
@RestController("configFileController")
@RequestMapping(value = "config/v2/files")
public class FileController {

	@Autowired
	FileService fileService;
	
	@ApiOperation(value = "API to upload docs", notes = "API to upload docs.<br/>")
	@PostMapping("/upload")
	public FileUploadResponseDto uploadFile(
			@RequestParam(required = true) @ApiParam(value = "provide Document Type", allowableValues = "DISCOUNT_WORKFLOW", required = true) String docType,
			@RequestParam(required = true) @ApiParam(value = "provide File Type", allowableValues = "OTHERS", required = true)  String fileType,
			@RequestParam(required = true, value = "file") MultipartFile file) {

		return fileService.uploadFile(docType, fileType, file);
	}
	
	@ApiOperation(value = "API to get docs", notes = " API takes input & provide the document in file in return")
	@GetMapping("/{fileId}/download")
	public ResponseEntity<Resource> getFile(
			@PathVariable("fileId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String fileId,
			@RequestParam(required = true) String fileName) {

		return fileService.getFileById(fileId, fileName);
	}

}
