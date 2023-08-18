/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.store.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

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
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.store.dto.request.CatchmentAddDto;
import com.titan.poss.store.dto.request.CatchmentUpdateDto;
import com.titan.poss.store.dto.response.CatchmentDto;
import com.titan.poss.store.service.CatchmentService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller class for Catchment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("storeCatchmentController")
@RequestMapping("store/v2/catchments")
public class CatchmentController {

	@Autowired
	private CatchmentService catchmentService;

	private static final String CATCHMENT_VIEW_PERMISSION = "hasPermission(true,'"
			+ StoreAccessControls.CATCHMENT_MASTER_VIEW + "' )";
	private static final String CATCHMENT_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ StoreAccessControls.CATCHMENT_MASTER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Catchment details.
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<CatchmentDto>>
	 */
	@ApiOperation(value = "API to get the list of Catchment Area details", notes = "This API will get the list of Catchment Area details based on the results matching the criteria.")
	@GetMapping
	@PreAuthorize(IS_STORE_USER + AND + CATCHMENT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<CatchmentDto>> listCatchmentArea(
			@ApiParam(value = "Provide if you want to search by 'catchment area'", required = false) @RequestParam(name = "searchField", required = false) @Size(max = 100, message = "max length of search field is 100") @PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, nullCheck = false) String searchField,
			@ApiParam(value = "Provide if you want to search by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return catchmentService.listCatchmentArea(searchField, isActive, pageable);
	}

	/**
	 * This method will return the Catchment details based on the catchmentCode.
	 * 
	 * @param catchmentCode
	 * @return CatchmentDto
	 */
	@ApiOperation(value = "API to get the catchment details based on the catchmentCode", notes = "This API will get the catchment details based on the **catchmentCode**")
	@GetMapping(value = "/{catchmentCode}")
	@PreAuthorize(IS_STORE_USER + AND + CATCHMENT_VIEW_PERMISSION)
	public CatchmentDto getCatchment(
			@ApiParam(name = "catchmentCode", value = "'catchmentCode' to get details", required = true) @PathVariable("catchmentCode") @PatternCheck(regexp = RegExConstants.CATCHMENT_CODE_REGEX, nullCheck = true) String catchmentCode) {
		return catchmentService.getCatchment(catchmentCode);
	}

	/**
	 * This method will save the Catchment details.
	 * 
	 * @param catchmentAddDto
	 * @return void
	 */
	@ApiOperation(value = "API to save the catchment details", notes = "This API will save the catchment details")
	@PostMapping
	@PreAuthorize(IS_STORE_USER + AND + CATCHMENT_ADD_EDIT_PERMISSION)
	public CatchmentDto addCatchment(
			@ApiParam(name = "body", value = "Catchment object that needs to be created", required = true) @RequestBody @Valid CatchmentAddDto catchmentAddDto) {
		return catchmentService.addCatchment(catchmentAddDto);
	}

	/**
	 * This method will update the Catchment details.
	 * 
	 * @param catchmentCode
	 * @param catchmentUpdateDto
	 * @return void
	 */
	@ApiOperation(value = "API to update the catchment details", notes = "This API will update the catchment details")
	@PatchMapping(value = "/{catchmentCode}")
	@PreAuthorize(IS_STORE_USER + AND + CATCHMENT_ADD_EDIT_PERMISSION)
	public CatchmentDto updateCatchment(
			@ApiParam(name = "catchmentCode", value = "'catchmentCode' to edit", required = true) @PathVariable("catchmentCode") @PatternCheck(regexp = RegExConstants.CATCHMENT_CODE_REGEX, nullCheck = true) String catchmentCode,
			@ApiParam(name = "body", value = "Catchment object that needs to be edited", required = true) @RequestBody @Valid CatchmentUpdateDto catchmentUpdateDto) {
		return catchmentService.updateCatchment(catchmentCode, catchmentUpdateDto);
	}
	@ApiOperation(value = "API to check the catchment description", notes = "This API will check the catchment description")
	@PostMapping(value = "/validate-catchment")
	@PreAuthorize(IS_STORE_USER + AND + CATCHMENT_ADD_EDIT_PERMISSION)
	public boolean saveCatchmentDescription(
			@ApiParam(name = "description", value = "'description' that need to check save", required = true) @RequestParam(name = "description") String description) {
		return catchmentService.saveCatchment(description);
	}

}