/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
public class CreditNoteLinkDto {
	private String id;

	private BigDecimal redeemedAmount;

	private SalesTxnDaoExt linkedTxn;

	// used for bulk credit notes to nulify
	private Boolean removeLink;
}
