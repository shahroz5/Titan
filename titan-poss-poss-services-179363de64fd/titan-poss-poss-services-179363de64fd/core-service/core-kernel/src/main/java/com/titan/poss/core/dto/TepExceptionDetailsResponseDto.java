/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class TepExceptionDetailsResponseDto {

	private Date startDate;

	private Date endDate;

	private JsonData offerDetails;

	private String configId;

	private String customerMobileNo;
}
