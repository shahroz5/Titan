/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.store.dto.BankPriorityDto;
import com.titan.poss.store.dto.request.PriorityDto;
import com.titan.poss.store.service.BankPriorityService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("storeBankPriorityController")
@RequestMapping(value = "store/v2/bank-priorities")
public class BankPriorityController {

	@Autowired
	private BankPriorityService bankPriorityService;

	private static final String BANK_PRIORITY_VIEW_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.BANK_PRIORITY_VIEW + "' )";
	private static final String BANK_PRIORITY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.BANK_PRIORITY_ADD_EDIT + "' )";

	/**
	 * This method will return the list of bank priority based.
	 * 
	 * @return PagedRestResponse<List<BankPriorityDto>>
	 */
	@ApiOperation(value = "View the list of Bank priority", notes = "This API returns the list of Bank Priority")
	@GetMapping
	@PreAuthorize(IS_STORE_USER + AND + BANK_PRIORITY_VIEW_PERMISSION)
	public List<BankPriorityDto> listPayerBank() {
		return bankPriorityService.listBankPriority();
	}

	/**
	 * This method will update the bank Priority.
	 * 
	 * @param bankPriorityDto
	 * @return BankPriorityDto
	 */
	@ApiOperation(value = "Update the Bank Priority ", notes = "This API updates the Bank Priority")
	@PatchMapping
	@PreAuthorize(IS_STORE_USER + AND + BANK_PRIORITY_ADD_EDIT_PERMISSION)
	public List<BankPriorityDto> updatePayerBank(@RequestBody @Valid PriorityDto bankPriorityDto) {
		return bankPriorityService.updateBankPriority(bankPriorityDto, CommonUtil.getLocationCode());
	}
}
