/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "gift_master")
@EqualsAndHashCode(callSuper = false)
public class GiftMasterDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "serial_no", columnDefinition = "BIGINT")
	private BigInteger serialNo;

	@Column(name = "gift_code")
	private String giftCode;

	@Column(name = "region_code")
	private String regionCode;

	@Column(name = "denomination", columnDefinition = "money")
	private BigDecimal denomination;

	@Column(name = "quantity")
	private Integer quantity;

	@Column(name = "total_value", columnDefinition = "money")
	private BigDecimal totalValue;

	@Column(name = "status", columnDefinition = "varchar", length = 30)
	private String status;

	@Column(name = "mfg_date")
	private Date mfgDate;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "validity_days")
	private Integer validityDays;

	@Column(name = "activation_date")
	private Date activationDate;

	@Column(name = "valid_from")
	private Date validFrom;

	@Column(name = "valid_till")
	private Date validTill;

	@Column(name = "gift_details", columnDefinition = "NVARCHAR")
	private String giftDetails;
	
	@Column(name = "redeem_details", columnDefinition = "NVARCHAR")
	private String redeemDetails;

	@Column(name = "remarks", columnDefinition = "VARCHAR")
	private String remarks;

	@Column(name = "excludes", columnDefinition = "NVARCHAR")
	private String excludes;

	@Column(name = "indent_no")
	private Integer indentNo;

	@Column(name = "extend_count")
	private Integer extendCount;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
