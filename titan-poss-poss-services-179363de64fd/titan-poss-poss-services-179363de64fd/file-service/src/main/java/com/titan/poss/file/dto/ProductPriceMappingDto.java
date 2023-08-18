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
public class ProductPriceMappingDto {

	private String productGroupCode;

	private Integer fromBand;

	private Integer toBand;

	private BigDecimal fromPrice;

	private BigDecimal toPrice;

	private BigDecimal margin;

	private String id;

	private String fileAuditId;

	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;

	private Integer srcSyncId;

	private Integer destSyncId;

}
