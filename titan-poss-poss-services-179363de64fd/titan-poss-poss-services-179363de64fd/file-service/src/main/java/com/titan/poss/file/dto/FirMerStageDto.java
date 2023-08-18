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
public class FirMerStageDto {

	private String type;
	private String itemCode;
	private String lotNumber;
	private BigDecimal unitWeight;
	private Short quantity;
	private String initiatedLocationCode;
	private String sourceLocationCode;
	private String destinationLocationCode;
	private Integer fiscalYear;
	private String fileId;
	private Date mfgDate;
	private BigDecimal totalValue;
	private BigDecimal stdWeight;
	private BigDecimal stdValue;
	private Short totalQuantity;
	private String binGroupCode;
	private String binCode;
	private String inventoryId;
	private String createdBy;
	private String lastModifiedBy;
	private Date createdDate;
	private Date lastModifiedDate;
	private String productGroup;
	private String productCategory;
	private String itemDetails;

}
