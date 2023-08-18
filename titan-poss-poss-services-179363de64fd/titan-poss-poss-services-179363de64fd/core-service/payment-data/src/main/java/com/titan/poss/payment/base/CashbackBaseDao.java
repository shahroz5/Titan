/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.payment.dao.PayerBankDao;

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
public class CashbackBaseDao extends MasterSyncableEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Column(name = "cashback_name")
	private String cashbackName;

	@Column(name = "card_no_length")
	private String cardNoLength;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "start_date")
	private Date startDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "first_digits")
	private Integer firstCardDigits;

	@Column(name = "last_digits")
	private Integer lastCardDigits;

	@Column(name = "validate_mobile")
	private Boolean mobileFlag;

	@Column(name = "max_usage_count")
	private Integer maxUsageCount;

	@Column(name = "cm_remarks", columnDefinition = "NVARCHAR")
	private String cmRemarks;

	@Column(name = "offer_remarks", columnDefinition = "NVARCHAR")
	private String offerRemarks;

	@Column(name = "exclude_cashback")
	private Boolean excludeCashback;

	@Column(name = "is_cashback_amount")
	private Boolean isCashbackAmount;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bank_name", referencedColumnName = "bank_name")
	private PayerBankDao payerBankName;
	
}
