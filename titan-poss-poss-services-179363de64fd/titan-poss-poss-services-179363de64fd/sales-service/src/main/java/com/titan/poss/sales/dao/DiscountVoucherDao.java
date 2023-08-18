/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>discount_voucher</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "discount_voucher")
@EqualsAndHashCode(callSuper = false)
public class DiscountVoucherDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

	@Column(name = "voucher_type")
	private String voucherType;

	@Column(name = "voucher_no")
	private String voucherNo;

	@Column(name = "account_no")
	private String accountNo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
	@JoinColumn(name = "location_code", referencedColumnName = "location_code")
	private CustomerLocationMappingDao customerLocationMap;

	@Column(name = "installment_amount", columnDefinition = "DECIMAL")
	private BigDecimal installmentAmount;

	@Column(name = "discount_amount", columnDefinition = "DECIMAL")
	private BigDecimal discountAmount;

	@Column(name = "status")
	private String status;

	@Column(name = "is_gold_coin_allowed")
	private Boolean isGoldCoinAllowed;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "valid_from", length = 23)
	private Date validFrom;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "valid_till", length = 23)
	private Date validTill;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

}
