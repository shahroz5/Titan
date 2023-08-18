/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DocumentTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.store.dto.request.CreatePrinterConfigDto;
import com.titan.poss.store.dto.request.UpdatePrinterConfigDto;
import com.titan.poss.store.dto.respond.PrinterConfigDto;
import com.titan.poss.store.service.PrinterService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("storePrinterController")
@RequestMapping("store/v2/printer-configs")
public class PrinterController {

	private static final String PRINTER_CONFIGURATION_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.PRINTER_CONFIGURATION_VIEW + PreAuthorizeDetails.END;
	private static final String PRINTER_CONFIGURATION_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.PRINTER_CONFIGURATION_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private PrinterService printerService;

	@ApiOperation(value = "View the list of Printer Configs", notes = "This API returns the list of Pinter Configs based on **documentType** && **isActive**")
	@GetMapping
	@PreAuthorize(PRINTER_CONFIGURATION_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<PrinterConfigDto>> listPrinterConfig(
			@RequestParam(required = false) @ApiParam(required = false, value = "Document Type", allowableValues = "GUARANTEE_CARD,CUSTOMER_PRINT") @ValueOfEnum(enumClass = DocumentTypeEnum.class) String documentType,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {
		return printerService.listPrinterConfigService(documentType, pageable, isActive);
	}

	@ApiOperation(value = "Get a Printer Configs", notes = "This API returns an active Pinter Configs based on **Id**")
	@GetMapping("/{id}")
	@PreAuthorize(PRINTER_CONFIGURATION_VIEW_PERMISSION)
	public PrinterConfigDto getPrinterConfig(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) @NotNull(message = "Id is mandatory") String id) {
		return printerService.getPrinterConfigService(id);
	}

	@ApiOperation(value = "Create a Printer Configs", notes = "This API reaturns a newly created active Pinter Configs")
	@PostMapping
	@PreAuthorize(PRINTER_CONFIGURATION_ADD_EDIT_PERMISSION)
	public PrinterConfigDto createPrinterConfig(
			@RequestBody @Valid @ApiParam(name = "body", value = "Printer Config that needs to be created", required = true) CreatePrinterConfigDto createDto) {
		return printerService.createPrinterConfigService(createDto);
	}

	@ApiOperation(value = "Update a Printer Configs", notes = "This API updates a existing Pinter Configs")
	@PatchMapping
	@PreAuthorize(PRINTER_CONFIGURATION_ADD_EDIT_PERMISSION)
	public PrinterConfigDto updatePrinterConfig(
			@RequestBody @Valid @ApiParam(name = "body", value = "Printer Config that needs to be updated", required = true) UpdatePrinterConfigDto updateDto) {
		return printerService.updatePrinterConfigService(updateDto);
	}

}
