/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.core.dto.MappedConfigResponseDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TepExceptionErrorResponseDto extends MappedConfigResponseDto {

	private String itemCode;

	private Date startDate;

	private Date endDate;

	private String customerMobileNo;

	public TepExceptionErrorResponseDto(String locationCode, String configId, String configName, String configType,
			String itemCode, Date startDate, Date endDate, String customerMobileNo) {
		super(locationCode, configId, configName, configType);
		this.itemCode = itemCode;
		this.startDate = startDate;
		this.endDate = endDate;
		this.customerMobileNo = customerMobileNo;
	}

}
