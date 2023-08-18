/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GepAndItemIdDetailsResponseDto extends BaseGepResponseDto {
	private List<String> itemIdList;
	private String employeeCode;
	private JsonData exchangeDetails;
	private String remarks;
	private Boolean isRecalculated;
	private Date refDocDate;
	private Object approvalDetails;
	private String reason;
}
