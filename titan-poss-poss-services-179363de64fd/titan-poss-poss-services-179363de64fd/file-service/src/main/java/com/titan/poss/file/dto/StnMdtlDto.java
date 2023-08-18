/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StnMdtlDto {

	private Integer lineCount;

	private Integer lineDtlCount;

	private String itemNo;

	private BigDecimal stnWeight;

	private Integer stnQty;

	private String itemCode;

	private String lotNumber;

	private String fileId;

	private String createdBy;

	private Date createdDate;

	private String productGroup;

}
