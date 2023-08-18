/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.file.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.FileAccessControls;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.dto.FileUploadResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileUploadService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "file/v2")
public class FileController {

	@Autowired
	private FileUploadService fileUploadService;

	@Autowired
	private FileAuditService fileAuditServcie;

	@Autowired
	private Environment env;

	private static final String FILE_GROUP_ADD_EDIT_PERMISSION = "hasPermission(#fileGroup,'AIRPAY_CONFIG')" + AND
			+ START + FileAccessControls.AIRPAY_CONFIG_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'CARD_DETAILS')"
			+ AND + START + FileAccessControls.CARD_DETAILS_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'PAYER_BANK')" + AND + START + FileAccessControls.PAYER_BANK_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'PAYMENT_HOSTNAME_MAPPING')" + AND + START
			+ FileAccessControls.PAYMENT_HOSTNAME_MAPPING_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'GV_STATUS_UPDATE')" + AND + START
			+ FileAccessControls.GV_STATUS_UPDATE_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'GV_VALIDITY_EXTEND')"
			+ AND + START + FileAccessControls.GV_VALIDITY_EXTEND_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'GEP_CONFIG_EXCLUDE_MAPPING')" + AND + START
			+ FileAccessControls.GEP_CONFIG_EXCLUDE_MAPPING_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'TAX_CONFIG')" + AND + START + FileAccessControls.TAX_CONFIG_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'PRODUCT_PRICE_MAPPING')" + AND + START
			+ FileAccessControls.PRODUCT_PRICE_MAPPING_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'FIR')" + AND
			+ START + FileAccessControls.FIR_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'MER')" + AND + START
			+ FileAccessControls.MER_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'QCGC_CONFIG')" + AND + START
			+ FileAccessControls.QCGC_CONFIG_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'BEST_DEAL_DISCOUNT')"
			+ AND + START + FileAccessControls.BEST_DEAL_DISCOUNT_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'ITEM_GROUP_LEVEL_DISCOUNT')" + AND + START
			+ FileAccessControls.ITEM_GROUP_LEVEL_DISCOUNT_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'DISCOUNT_EXCLUDE_ITEM_MAPPING')" + AND + START
			+ FileAccessControls.DISCOUNT_EXCLUDE_ITEM_MAPPING + END + OR + "hasPermission(#fileGroup,'ORACLE')" + AND
			+ START + FileAccessControls.ORACLE_ADD_EDIT + END + OR + "hasPermission(#fileGroup,'PRICE_LOGIC_TEST')"
			+ AND + START + FileAccessControls.PRICE_LOGIC_TEST_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'RAZORPAY_CONFIG')" + AND + START + FileAccessControls.RAZORPAY_CONFIG_ADD_EDIT + END + OR
			+ "hasPermission(#fileGroup,'EMPLOYEE_LOAN_CONFIG')" + AND + START + FileAccessControls.EMPLOYEE_LOAN_CONFIG_ADD_EDIT + END +OR 
			+ "hasPermission(#fileGroup,'COMPLEXITY_PRICE_GROUP_DETAILS')" + AND + START + FileAccessControls.DISCOUNT_EXCLUDE_ITEM_MAPPING
			+ END;

	private static final String FILE_GROUP_VIEW_PERMISSION = START + FileAccessControls.AIRPAY_CONFIG_ADD_EDIT + END
			+ OR + START + FileAccessControls.CARD_DETAILS_ADD_EDIT + END + OR + START
			+ FileAccessControls.PAYER_BANK_ADD_EDIT + END + OR + START
			+ FileAccessControls.PAYMENT_HOSTNAME_MAPPING_ADD_EDIT + END + OR + START
			+ FileAccessControls.GV_STATUS_UPDATE_ADD_EDIT + END + OR + START
			+ FileAccessControls.GV_VALIDITY_EXTEND_ADD_EDIT + END + OR + START
			+ FileAccessControls.GEP_CONFIG_EXCLUDE_MAPPING_ADD_EDIT + END + OR + START
			+ FileAccessControls.TAX_CONFIG_ADD_EDIT + END + OR + START + FileAccessControls.FIR_ADD_EDIT + END + OR
			+ START + FileAccessControls.PRODUCT_PRICE_MAPPING_ADD_EDIT + END + OR + START
			+ FileAccessControls.MER_ADD_EDIT + END + OR + START + FileAccessControls.QCGC_CONFIG_ADD_EDIT + END + OR
			+ START + FileAccessControls.ORACLE_ADD_EDIT + END + OR + START
			+ FileAccessControls.PRICE_LOGIC_TEST_ADD_EDIT + END + OR + START
			+ FileAccessControls.ITEM_GROUP_LEVEL_DISCOUNT_ADD_EDIT + END + OR + START
			+ FileAccessControls.BEST_DEAL_DISCOUNT_ADD_EDIT + END + OR + START
			+ FileAccessControls.DISCOUNT_EXCLUDE_ITEM_MAPPING + END + OR + START
			+ FileAccessControls.RAZORPAY_CONFIG_ADD_EDIT + END + OR + START+
			FileAccessControls.EMPLOYEE_LOAN_CONFIG_ADD_EDIT + END;

	private static final String ERR_LOG_FILE_FOLDER = "errorLog.file.folder";

	private static final String FILE_BASE_FOLDER = "files.baseFolder";

	@PostMapping("/file-upload")
	@PreAuthorize(FILE_GROUP_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Process the file", notes = "This API will process the data from the uploaded file. " + "<br>"
			+ "If the file job is asynchronous, then only the file id will be returned.")
	public FileUploadResponseDto processFile(
			@ApiParam(name = "fileGroup", value = "File group", required = true) @RequestParam(name = "fileGroup", required = true) FileGroupEnum fileGroup,
			@RequestParam(required = true) MultipartFile reqFile, @RequestParam(required = false) String param) {

		return fileUploadService.processDataFromFile(fileGroup.name(), reqFile, param);
	}

	@GetMapping(value = "/error-log")
	@PreAuthorize(FILE_GROUP_ADD_EDIT_PERMISSION)
	@ApiOperation(value = " Download log file", notes = "This API will is used to download the log file based on the file group")
	public ResponseEntity<Resource> downloadErrorLogFile(
			@ApiParam(name = "fileGroup", value = "File group", required = true) @RequestParam(name = "fileGroup", required = true) FileGroupEnum fileGroup,
			@ApiParam(name = "fileId", value = "file id", required = true) @RequestParam(name = "fileId", required = true) String fileId) {

		String ext = fileGroup.name().equalsIgnoreCase(FileGroupEnum.PRICE_LOGIC_TEST.toString())
				? FileExtensionEnum.TXT.getValue()
				: FileExtensionEnum.CSV.getValue();
		Resource resource = new FileSystemResource(env.getProperty(FILE_BASE_FOLDER)
				+ env.getProperty(ERR_LOG_FILE_FOLDER) + fileGroup + "/" + fileId + "." + ext);
		if (resource.exists()) {
			HttpHeaders header = new HttpHeaders();
			header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
			header.add("Cache-Control", "no-cache, no-store, must-revalidate");
			header.add("Expires", "0");

			return ResponseEntity.ok().headers(header).contentType(MediaType.parseMediaType("application/octet-stream"))
					.body(resource);
		} else {
			throw new ServiceException("Log file not found", "ERR-FILE-005",
					"Log file not found for the file group: " + fileGroup);
		}
	}

	@ApiPageable
	@GetMapping(value = "/file-status")
	@PreAuthorize(FILE_GROUP_VIEW_PERMISSION)
	@ApiOperation(value = " Get all the file status started by the logged in user", notes = "This API will get the status of previous file processed jobs")
	public PagedRestResponse<List<FileAuditDto>> getFileStatus(@ApiIgnore Pageable pageable) {

		return fileAuditServcie.getFileAuditDtos(pageable);
	}

	
}
