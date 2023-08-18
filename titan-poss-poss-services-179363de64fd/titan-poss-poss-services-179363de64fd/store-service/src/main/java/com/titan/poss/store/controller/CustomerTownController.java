/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.store.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;

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
import com.titan.poss.core.domain.acl.StoreAccessControls;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.store.dto.request.CustomerTownAddDto;
import com.titan.poss.store.dto.request.CustomerTownUpdateDto;
import com.titan.poss.store.dto.response.CustomerTownDto;
import com.titan.poss.store.service.CustomerTownService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller class for Customer Town.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("storeCustomerTownController")
@RequestMapping("store/v2/towns")
public class CustomerTownController {

	@Autowired
	private CustomerTownService customerTownService;

	private static final String CUSTOMER_TOWN_MASTER_VIEW_PERMISSION = "hasPermission(true,'"
			+ StoreAccessControls.CUSTOMER_TOWN_MASTER_VIEW + "' )";
	private static final String CUSTOMER_TOWN_MASTER_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ StoreAccessControls.CUSTOMER_TOWN_MASTER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of CustomerTown details.
	 * 
	 * @param stateCode
	 * @param description
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CustomerTownDto>>
	 */
	@ApiOperation(value = "API to get the list of CustomerTown details", notes = "This API will get the list of CustomerTown details based on the results matching the criteria.")
	@GetMapping
	@PreAuthorize(IS_STORE_USER + AND + CUSTOMER_TOWN_MASTER_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<CustomerTownDto>> listTown(
			@ApiParam(name = "stateCode", value = "'stateCode' to list towns", required = false) @RequestParam(required = false) String stateCode,
			@ApiParam(name = "description", value = "'description' to list towns", required = false) @RequestParam(required = false) String description,
			@ApiParam(name = "isActive", value = "'isActive' to list towns", required = false) @RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return customerTownService.listTown(stateCode, description, isActive, pageable);
	}

	/**
	 * This method will return the CustomerTown details based on the
	 * customerTownCode.
	 * 
	 * @param customerTownCode
	 * @return CustomerTownDto
	 */
	@ApiOperation(value = "API to get the CustomerTown details based on the customerTownCode", notes = "This API will get the CustomerTown details based on the **customerTownCode**")
	@GetMapping(value = "/{customerTownCode}")
	@PreAuthorize(IS_STORE_USER + AND + CUSTOMER_TOWN_MASTER_VIEW_PERMISSION)
	public CustomerTownDto getTown(
			@ApiParam(name = "customerTownCode", value = "'customerTownCode' to get details", required = true) @PathVariable("customerTownCode") @Min(1) Integer customerTownCode) {
		return customerTownService.getTown(customerTownCode);
	}

	/**
	 * This method will save the CustomerTown details.
	 * 
	 * @param customerTownAddDto
	 * @return void
	 */
	@ApiOperation(value = "API to save the CustomerTown details", notes = "This API will save the CustomerTown details")
	@PostMapping
	@PreAuthorize(IS_STORE_USER + AND + CUSTOMER_TOWN_MASTER_ADD_EDIT_PERMISSION)
	public CustomerTownDto addTown(
			@ApiParam(name = "body", value = "CustomerTown object that needs to be created", required = true) @RequestBody @Valid CustomerTownAddDto customerTownAddDto) {
		return customerTownService.addTown(customerTownAddDto);
	}

	/**
	 * This method will update the Customer_Town details.
	 * 
	 * @param customerTownCode
	 * @param customerTownUpdateDto
	 * @return void
	 */
	@ApiOperation(value = "API to update the CustomerTown details", notes = "This API will update the CustomerTown details based on <b>customerTownCode</b>.<br>")
	@PatchMapping(value = "/{customerTownCode}")
	@PreAuthorize(IS_STORE_USER + AND + CUSTOMER_TOWN_MASTER_ADD_EDIT_PERMISSION)
	public CustomerTownDto updateTown(
			@ApiParam(name = "customerTownCode", value = "'customerTownCode' to edit", required = true) @PathVariable("customerTownCode") @Min(1) Integer customerTownCode,
			@ApiParam(name = "body", value = "Customer town object to needs to be edited", required = true) @RequestBody @Valid CustomerTownUpdateDto customerTownUpdateDto) {
		return customerTownService.updateTown(customerTownCode, customerTownUpdateDto);
	}
}
