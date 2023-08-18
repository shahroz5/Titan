/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean isIssueToFactory;
	private Boolean isIssueToMerchandise;
	private Boolean isIssueToOtherBoutique;
	private Boolean isIssueToTEP;
	private Boolean isIssueToGEP;
	private Boolean isIssueDefective;
	private Boolean isIssueOthers;
	@NotNull
	@Min(value = 1, message = "maximumNoOfDaysForPhysicalReceiptDate must be greater than 0")
	private Integer maximumNoOfDaysForPhysicalReceiptDate;
	private Integer maximumNoOfDaysForSTNCancellation;
	private Boolean isSTNcancellationAllowed;
	private Boolean isConversionRestricted;
	private Boolean isStuddedSplitAllowed;
    private Boolean isUECLocationStockNotVisibleForIBTTransfer;
	@NotNull
	private Double sparewtToleranceforStockItem;
	@NotNull
	private Double servicewtToleranceforStockItem;
	@NotNull
	private Double conversionwtToleranceforBangle;

}
