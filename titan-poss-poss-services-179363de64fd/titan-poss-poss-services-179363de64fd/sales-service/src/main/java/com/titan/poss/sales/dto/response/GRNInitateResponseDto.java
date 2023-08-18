/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.ReturnableItemsDto;

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
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class GRNInitateResponseDto extends BaseTransactionResponseDto {

	private Date docDate;
	private MetalRateListDto metalRateList;
	private Integer refCustomerId;
	private Integer grnCustomerId;

	private List<GRNItemDetailsDto> items;

	// scheme for FOC items not returned
//	private Set<GRNFocSchemeDto> focSchemes;
//	private List<GRNFocItemDetailsDto> focItems;

	private BigDecimal totalValue;
	private Short totalQuantity;
	private BigDecimal cmFinalValue;
	private BigDecimal otherCharges;
	private BigDecimal loyaltyPoints;

	private Integer refDocNo;
	private Date refDocDate;
	private Short refFiscalYear;
	private String refId;

	private String srcLocationCode;
	private String txnSource;

//	List<String> returnableItemIds;
	List<ReturnableItemsDto> returnedItems;

	private BigDecimal tcsCollected;
	
	private Map<String,Integer> cnDocDetails;
	
	private Boolean isVoid;

	 

}
