/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class GiftDetailsBaseDao extends SyncableEntity implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "instrument_no")
	private String instrumentNo;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "vendor_code", columnDefinition = "VARCHAR")
	private String vendorCode;
	
	@Column(name = "gift_code", columnDefinition = "VARCHAR")
	private String giftCode;

	@Column(name = "gift_type", columnDefinition = "VARCHAR")
	private String giftType;

	@Column(name = "net_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "reference_details", columnDefinition = "NVARCHAR")
	private String referenceDetails;

	@Column(name = "is_gift_activated")
	private Boolean isGiftActivated;
}
