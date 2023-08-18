/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class BinRequestDto {

	private Integer id;

	private Integer reqDocNo;

	private String reqLocationCode;

	private Date reqDocDate;

	private String binName;

	private String status;

	private String requestedRemarks;

	private String binGroupCode;

}
