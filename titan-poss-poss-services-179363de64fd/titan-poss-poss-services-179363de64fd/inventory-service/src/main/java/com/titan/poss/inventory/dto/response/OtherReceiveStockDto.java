/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class OtherReceiveStockDto {

	private Integer id;
	private String transactionType;
	private String locationCode;
	private Integer srcDocNo;
	private Short srcFiscalYear;
	private Date srcDocDate;
	private Integer destDocNo;
	private Date destDocDate;
	private Short totalAvailableQuantity;
	private Short totalMeasuredQuantity;
	private String locationCodeDescription;

	// while receive totalAvailableQuantity=details totalIssuedQuantity
	// while issue totalAvailableQuantity=details totalReceivedQuantity
	private BigDecimal totalAvailableValue;

	// while receive totalMeasuredQuantity=details totalReceivedQuantity
	// while issue totalMeasuredQuantity=details totalIssuedQuantity
	private BigDecimal totalMeasuredValue;

	// while receive totalAvailableQuantity=details totalIssuedQuantity
	// while issue totalAvailableQuantity=details totalReceivedQuantity
	private BigDecimal totalAvailableWeight;

	// while receive totalMeasuredWeight=details totalReceivedWeight
	// while issue totalMeasuredWeight=details totalIssuedWeight
	private BigDecimal totalMeasuredWeight;
	private Object carrierDetails;
	private Object otherDetails;
	private String weightUnit;
	private String currencyCode;
	private String status;
}
