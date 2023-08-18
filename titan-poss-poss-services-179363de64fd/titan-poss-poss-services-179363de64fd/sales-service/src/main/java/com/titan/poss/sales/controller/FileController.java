/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PresignedDto;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileTypeEnum;
import com.titan.poss.sales.dto.response.FileDetailsDto;
import com.titan.poss.sales.service.FileService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesFileController")
@RequestMapping(value = "sales/v2/files")
public class FileController {

	@Autowired
	FileService fileService;

	@ApiOperation(value = "API to upload docs", notes = " API takes file input for certain transaction.<br/>"
			+ "For permanent files id fields are mandatory.<br/>"
			+ "Temporary file means where transaction id is not there while uploading file, there file is uploaded by providing docType, fileType, "
			+ "later in specific module the temp file ids are taken in input to change it to permanent file like in case of Merge GRF, GRN, CN_WORKFLOW<br/>"
			+ "Customer id should be provided only in customer file upload scenario.")
	@PostMapping("/upload")
	@PreAuthorize(IS_STORE_USER)
	public String uploadFile(
			@RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "customerId", value = "provide customerId ", required = false) @RequestParam(name = "customerId", required = false) @Min(1) Integer customerId,
			@RequestParam(required = true) @ApiParam(value = "provide Document Type", allowableValues = "CM, GEP, CUSTOMER_WORKFLOW, GRN, MERGE_GRF, AB, ADV, GRF, TEP, CN_WORKFLOW,CN_REDEMPTION, GHS_REDEMPTION", required = true) @ValueOfEnum(enumClass = UploadFileDocTypeEnum.class) String docType,
			@RequestParam(required = true) @ApiParam(value = "provide File Type", allowableValues = "PAN_CARD, OTHERS", required = true) @ValueOfEnum(enumClass = UploadFileTypeEnum.class) String fileType,
			@RequestParam(required = true, value = "file") MultipartFile file) {

		return fileService.uploadFile(id, customerId, docType, fileType, file);
	}

	@ApiOperation(value = "API to get docs", notes = " API takes input & provide the document in file in return")
	@GetMapping("/{id}/download")
	// @PreAuthorize(IS_STORE_USER)
	public ResponseEntity<Resource> getFile(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam(required = false) String locationCode) {

		return fileService.getFileById(id, locationCode);
	}

	@ApiOperation(value = "API to get temporary acecssible file URL", notes = " API takes input & provide the a URL which on click can be accessed the file for a limited period of time")
	@GetMapping("/{id}/presigned-url")
	public PresignedDto getPresignedUrl(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam(required = false) String locationCode) {

		return fileService.getPresignedUrlById(id, locationCode);
	}

	@ApiOperation(value = "API to delete file by id", notes = " API takes id to find the file & delete it from local server & online storage")
	@DeleteMapping("/{id}")
	@PreAuthorize(IS_STORE_USER)
	public void deleteFile(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id) {

		fileService.deleteFileById(id);
	}

	@ApiOperation(value = "API to list all file uploaded under input types", notes = " API takes file list related input & provide list of files which are under provided input category.<br/>"
			+ "Customer id should be provided only in customer file upload scenario.")
	@GetMapping("list")
	public ListResponse<FileDetailsDto> listFileIds(
			@RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "customerId", value = "provide customerId ", required = false) @RequestParam(name = "customerId", required = false) @Min(1) Integer customerId,
			@RequestParam(required = true) @ApiParam(value = "provide Transaction Type", allowableValues = "CM, GEP, CUSTOMER, GRN, MERGE_GRF, AB, ADV, GRF, TEP, CN_WORKFLOW,CN_REDEMPTION, GHS_REDEMPTION,CO", required = true) @ValueOfEnum(enumClass = UploadFileDocTypeEnum.class) String documentType,
			@RequestParam(required = true) @ApiParam(value = "provide File Type", allowableValues = "PAN_CARD, OTHERS", required = true) @ValueOfEnum(enumClass = UploadFileTypeEnum.class) String fileType,
			@RequestParam(required = false) String locationCode) {
		return fileService.listFileIds(id, customerId, documentType, fileType, locationCode);
	}

	@ApiOperation(value = "API to update the status of uploaded customer document", notes = "API to update the status of uploaded customer document based on processId")
	@PatchMapping("/approval")
	public void updateCustomerDocumentStatus(
			@RequestParam(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		fileService.updateCustomerDocumentStatus(id);
	}

	@ApiOperation(value = "API to get document details", notes = " API takes input  as id & provide the document details")
	@GetMapping("/{id}/document-detail")
	public CustomerDocumentDto getCustomerDocDtoByI(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam(required = false) String locationCode) {

		return fileService.getCustomerDocDtoByIdAndLocationCode(id, locationCode);
	}

	@ApiOperation(value = "API to get docs", notes = " API takes input & provide the document in file in return")
	@GetMapping("/{id}/downloadFileEposs")
	public ResponseEntity<Resource> getFileInEposs(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam(required = false) String locationCode) {

		return fileService.getFileById(id, locationCode);
	}
}
