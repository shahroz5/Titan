/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManualFocSchemeResponseDto {

	private String schemeId;

	private String schemeName;
	
	private Date manualFOCStartDate;
	
	private Date manualFOCEndDate;

	private List<FocItemDto> focItems;
	
	private String configDetails;

}
