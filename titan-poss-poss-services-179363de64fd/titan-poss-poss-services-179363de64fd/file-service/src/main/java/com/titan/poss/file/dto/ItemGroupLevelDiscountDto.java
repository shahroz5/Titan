/*  
 * Copyright 2019. Titan Company Limited
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
public class ItemGroupLevelDiscountDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private Boolean regularF2IsPercent;

	private Boolean regularUcpIsPercent;

	private Boolean regularVIsPercent;

	private Boolean regularF1IsPercent;

	private BigDecimal regularF2Value;

	private BigDecimal regularUcpValue;

	private BigDecimal regularVValue;

	private BigDecimal regularF1Value;

	private BigDecimal regularWeightValue;

	private Boolean regularIsGrossWeight;

	private String discountCode;

	private String itemCode;

	private String lotNumber;

	private String locationCode;

	private String regularStartDate;

	private String regularEndDate;

	private Boolean isTransferredLocation;

	private Boolean isPreviewApplicable;

	private Boolean previewF2IsPercent;

	private Boolean previewUcpIsPercent;

	private Boolean previewVIsPercent;

	private Boolean previewF1IsPercent;

	private BigDecimal previewF2Value;

	private BigDecimal previewUcpValue;

	private BigDecimal previewVValue;

	private BigDecimal previewF1Value;

	private BigDecimal previewWeightValue;

	private Boolean previewIsGrossWeight;

	private String previewStartDate;

	private String previewEndDate;

	private Boolean isActive;

	private String id;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String fileAuditId;

}
