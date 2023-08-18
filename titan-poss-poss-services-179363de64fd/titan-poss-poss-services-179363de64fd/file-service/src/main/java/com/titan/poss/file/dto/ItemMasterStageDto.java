/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

/**
 * DAO for <b>item_master_stage</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ItemMasterStageDto {

	private BigDecimal stoneWeight;

	private String itemCode;

	private String description;

	private Boolean isActive;

	private Boolean consignmentFlag;

	private BigDecimal maxWeightDeviation;

	private String inventoryType;

	private BigDecimal stdWeight;

	private String productCode;

	private String brandCode;

	private String productType;

	private String materialCode;

	private String supplyChainCode;

	private BigDecimal stdPrice;

	private BigDecimal stoneCharges;

	private String complexityCode;

	private String pricingType;

	private Boolean isSaleable;

	private String taxClass;

	private String findingCode;

	private String size;

	private String finishing;

	private Boolean isPerGram;

	private String pricingGroupType;

	private Boolean isReturnable;

	private BigDecimal karatage;

	private String itemNature;

	private String indentType;

	private String cfaProductCode;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private BigDecimal diamondCaratage;

	private String diamondColor;

	private String diamondClarity;

    private BigDecimal leadTime;
	
	private Boolean isForIndent;

	private String businessGroup;

	private String collectionName;

	private String designerName;

	private String themeDesign;

	private String designStyle1;

	private String designStyle2;

	private String delicateCode;

	private String gender;

	private String platingType;

	private String productionRoute;

	private String shape;

	private String materialColour;

	private String stoneCombination;

	private Integer guaranteePeriod;

	private String usageOccasion;

	private String pricingPyramid;

	private String indicativePrice;

	private Boolean isCustomerOrderDropped;

	private Boolean isSplit;

	private String parentRef;

	private Boolean isFocItem;

	private String hsnSacCode;

	private BigDecimal purity;

	private String bIMetal;
	
	private BigDecimal priceFactor;
	
	private String fileAuditId;
	
	@JsonIgnore
	private String itemDetails;
	
	@JsonIgnore
	private String configDetails;
	
	private String transferType;
	
	private String totCategory;
}
