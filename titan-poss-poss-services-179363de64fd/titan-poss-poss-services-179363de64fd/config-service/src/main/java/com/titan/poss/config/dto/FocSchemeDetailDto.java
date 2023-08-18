/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.config.dto.request.FocSchemeDetailUpdateDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeDetailDto {

	private List<@Valid FocSchemeDetailBaseDto> addSchemeDetails;

	private List<@Valid FocSchemeDetailUpdateDto> updateSchemeDetails;
	
	private List<String> deleteSchemeDetails;

}
