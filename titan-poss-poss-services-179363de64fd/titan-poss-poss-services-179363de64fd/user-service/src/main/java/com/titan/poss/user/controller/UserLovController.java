/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.dto.response.LovDto;
import com.titan.poss.user.service.UserLovService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for user lov.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("UserLovController")
@RequestMapping(value = "${user.base-url}/lovs")
public class UserLovController {

	@Autowired
	private UserLovService userLovService;

	/**
	 * This method will return the LOV details based on the lovType.
	 * 
	 * 
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	// @formatter:off
	@ApiOperation(value = "View the Lov details", notes = "This API will give the Lov details based on **lovType**"
			+ ""
			+ "<span style=\"font-weight: bold;\">LOV Types:</span>"
			+ "<ul>"
			+ "	<li>ROLE_TYPE</li>"
			+ "	<li>USER_TYPE</li>"
			+ "	<li>Else It can be any type which is there in DB</li>"
			+ "</ul>")
	// @formatter:off
	@GetMapping(value = "/{lovType}")
	public LovDto getLov(
			@ApiParam(name = "lovType", value = "'lovType' to get details", required = true) @PathVariable("lovType") @PatternCheck(regexp = RegExConstants.USER_LOV_VALUE_REGEX, nullCheck = true) String lovType,
			@ApiParam(value = "Provide if you want to search LOV records by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive){

		return userLovService.getLov(lovType, isActive);
	}

}
