/*  
p * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemMaterialStageDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private String itemCode;

	private BigDecimal noOfOtherItem;

	private String materialCode;

	private Boolean isActive;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String fileAuditId;

}
