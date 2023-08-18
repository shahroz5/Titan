/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.GhsConstantsEnum;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@ApiModel(description = "CN transfer to Ghs request Dto")
public class GhsCreditNoteTransferDto {

	private Integer docNo;

	private Short fiscalYear;

	private Date docDate;

	private Integer refDocNo;

	@ValueOfEnum(message = "Invalid Status", enumClass = GhsConstantsEnum.class)
	private String status;

	private String creditNoteType;

	private BigDecimal amount;

	private String refDocType;

	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;

	private String remarks;

	private Object customer;
	
	private BigDecimal totalCashCollected;
	
	private Integer accountNumber;
}
