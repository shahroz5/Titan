/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import java.util.List;

import javax.validation.Valid;

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
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.CustomerTaxTypeEnum;
import com.titan.poss.core.enums.DestLocationTaxTypeEnum;
import com.titan.poss.core.enums.SrcLocationTaxTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.TaxConfigsCreateDto;
import com.titan.poss.location.dto.request.TaxConfigsUpdateDto;
import com.titan.poss.location.dto.response.TaxConfigsDto;
import com.titan.poss.location.service.TaxConfigsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping("location/v2/tax-configs")
@Validated
public class TaxConfigsController {

	@Autowired
	private TaxConfigsService taxConfigsService;

	private static final String TAX_CONFIG_VIEW_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.TAX_TAX_CONFIG_VIEW + "' )";

	private static final String TAX_CONFIG_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.TAX_TAX_CONFIG_ADD_EDIT + "' )";

	@ApiOperation(value = "View the list of Tax Configs", notes = "This API returns the list of Tax Configs. Response will be pageable and sorting is available."
			+ " **SrcLocationTaxTypeEnum,TxnTaxTypeEnum,DestLocationTaxTypeEnum,CustomerTaxTypeEnum & isActive** is search parameter and all are optional.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(TAX_CONFIG_VIEW_PERMISSION)
	public PagedRestResponse<List<TaxConfigsDto>> listTaxConfigs(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @ApiParam(required = false, value = "srcLocationTaxType", allowableValues = "L1,L2,L3,CFA,FAC") @ValueOfEnum(message = "Invalid Request", enumClass = SrcLocationTaxTypeEnum.class) String srcLocationTaxType,
			@RequestParam(required = false) @ValueOfEnum(message = "Invalid Request", enumClass = TxnTaxTypeEnum.class) @ApiParam(value = "Transaction Type", allowableValues = "CUST_TRANSACTION_ADV_BOOKING,CUST_TRANSACTION_CM,CUST_TRANSACTION_PRIORITY_ORDER,INV_MANAGMNT_STOCK_ISSUE,INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE,INV_MANAGMNT_STOCK_ISSUE_TEP_GEP,INV_MANAGMNT_STOCK_RECEIPT_OTHER_RECEIPT,SERVICE_PAYMENT,SERVICE_PROCESSING,TEP_GEP,TEP_GEP_TANISHQ_EXCHANGE", required = false) String txnTypeEnum,
			@RequestParam(required = false) @ValueOfEnum(message = "Invalid Request", enumClass = DestLocationTaxTypeEnum.class) @ApiParam(required = false, value = "destLocationTaxType", allowableValues = "L1,L2,L3,CFA,FAC") String destLocationTaxType,
			@RequestParam(required = false) @ValueOfEnum(message = "Invalid Request", enumClass = CustomerTaxTypeEnum.class) @ApiParam(required = false, value = "customerTaxType", allowableValues = "NONREGISTERED,REGISTERED") String customerTaxType,
			@ApiIgnore Pageable pageable) {
		return taxConfigsService.listTaxConfigs(isActive, srcLocationTaxType != null ? srcLocationTaxType : null,
				destLocationTaxType != null ? destLocationTaxType : null,
				customerTaxType != null ? customerTaxType : null,
				txnTypeEnum != null ? TxnTaxTypeEnum.valueOfEnum(txnTypeEnum) : null, pageable);
	}

	@ApiOperation(value = "View the Tax Config details based on the id", notes = "This API returns the Tax Config details details based on the **id**"
			+ " Here **id** is mandatory fields.")
	@GetMapping(value = "{id}")
	@PreAuthorize(TAX_CONFIG_VIEW_PERMISSION)
	public TaxConfigsDto getTaxConfigs(@PathVariable("id") String id) {
		return taxConfigsService.getTaxConfigs(id);
	}

	@ApiOperation(value = "Add new Tax Config details", notes = "This API adds new Tax Config details details.")
	@PostMapping
	@PreAuthorize(TAX_CONFIG_ADD_EDIT_PERMISSION)
	public TaxConfigsDto addTaxConfigs(@RequestBody @Valid TaxConfigsCreateDto taxConfigsCreateDto) {

		return taxConfigsService.addTaxConfigs(taxConfigsCreateDto);
	}

	@ApiOperation(value = "Update Tax Config details details based on the id", notes = "This API updates new Tax Config details based on the **id**."
			+ " Here **id** are mandatory.")
	@PatchMapping(value = "{id}")
	@PreAuthorize(TAX_CONFIG_ADD_EDIT_PERMISSION)
	public TaxConfigsDto updateTaxConfigs(@PathVariable("id") String id,
			@RequestBody @Valid TaxConfigsUpdateDto taxConfigsUpdateDto) {

		return taxConfigsService.updateTaxConfigs(id, taxConfigsUpdateDto);
	}

}
