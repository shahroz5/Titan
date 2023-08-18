/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "rounding_variance", columnDefinition = "decimal")
	private BigDecimal roundingVariance;

	@Column(name = "exchange_details", columnDefinition = "NVARCHAR")
	private String exchangeDetails;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "approved_date")
	private Date approvedDate;
	
	@Column(name = "reason", columnDefinition = "NVARCHAR")
	private String reason;

	@Column(name = "refund_details", columnDefinition = "NVARCHAR")
	private String refundDetails;

	@Column(name = "process_id", columnDefinition = "uniqueidentifier")
	private String processId;

	@Column(name = "payment_type")
	private String paymentType;
	
	@Column(name = "is_migrated")
	private Boolean isMigrated;

	@Column(name = "refund_value", columnDefinition = "decimal")
	private BigDecimal refundValue;
	
	@Column(name = "tep_exception_details", columnDefinition = "NVARCHAR")
	private String tepExceptionDetails;
	
	@Column(name = "is_overriding")
	private Boolean isOverriding;
	
	@PrePersist
	private void onPrePersist2() {
		if (this.isMigrated == null) {
			this.isMigrated = false;
		}
		
		if (this.refundValue == null) {
			this.refundValue = BigDecimal.ZERO;
		}
		
		if (this.isOverriding == null) {
			this.isOverriding = false;
		}
	}
}
