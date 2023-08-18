/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ItemMasterLegacyDto {
	
	private String itemCode;
	
	private BigDecimal stoneWeight;
	
	private String description;
	
	private Boolean isActive;
	
	private Boolean consignmentFlag;
	
	private BigDecimal maxWeightDeviation;
	
	private String inventoryType;

	private BigDecimal stdWeight;;
	
	@JsonProperty("productCode")
	 private String productCategory;
	
	private String brandCode;
	
	private String productType;
	
	@JsonProperty("materialCode")
	 private String itemType;
	
	private String supplyChainCode;
	
	@JsonProperty("stdPrice")
	private BigDecimal stdValue;
	
	private BigDecimal stoneCharges;
	
	@JsonProperty("complexityCode")
	private String  complexity;
	
	private String pricingType;
	
	private Boolean isSaleable;
	
	@JsonProperty("taxClass")
	private String taxClassCode;
	
	private String findingCode;
	
	private String size;
	
	private String finishing;
	
	private Boolean isPerGram;
	
	private String pricingGroupType;
	
	private Boolean isReturnable;
	
	@JsonProperty("karatage")
	private BigDecimal karat;
	
	private String itemNature;
	
	private String indentType;
	
	@JsonProperty("cfaProductCode")
	 private String productGroup;
	
	private String loginID;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;
	
	private String lastModifiedBy;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;
	
	private Integer diamondCaratage;
	
	private String diamondColor;
	
	private String diamondClarity;
	
	private Integer leadTime;
	
	private Boolean isForIndent;
	
	private String businessGroup;
	
	private String collectionName;
	
	private String designerName;
	
	private String themeDesign;
	
	private String designStyle1;
	
	private String designStyle2;
	
	private Boolean delicateCode;
	
	private String gender;
	
	private String platingType;
	
	private String productionRoute;
	
	private String shape;
	
	private String materialColour;
	
	private String stoneCombination;
	
	private Integer guaranteePeriod;
	
	private String usageOccasion;
	
	private String pricingPyramid;
	
	private Integer indicativePrice;
	
	private Integer seqNo;
	
	private Boolean isInterBrandAcceptance;
	
	private Boolean isAssmAllowed;
	
	private Boolean isCustomerOrderDropped;
	
	private Boolean isSplit;
	
	@JsonProperty("parentRef")
	private String parentItem;
	
	@JsonProperty("isFOCItem")
	private Boolean isFocItem;
	
	@JsonProperty("hsN_SAC_Code")
	private String hsnSacCode;
	
	private BigDecimal purity;
	
	private String biMetal;

}
