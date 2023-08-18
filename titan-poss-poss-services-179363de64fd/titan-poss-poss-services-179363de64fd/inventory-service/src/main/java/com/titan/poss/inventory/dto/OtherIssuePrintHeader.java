/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OtherIssuePrintHeader extends InventoryHeader {
	// for other issues
	private String transactionType;
	private Object carrierDetails;
	private Integer issuedDocNo;
	private Short issuedFiscalYear;
	private Date issuedDocDate;
	private String issuedDate;
	private String locationCode;

	private String issuedRemarks;
	private String taxHeader;
	private String receivedRemarks;
	private Integer receivedDocNo;
	private Short receivedFiscalYear;
	private Date receivedDocDate;
	private Short totalReceivedQuantity;
	private BigDecimal totalReceivedWeight;
	private BigDecimal totalReceivedValue;
}
