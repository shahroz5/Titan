/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
public class GhsBankDepositeBaseDao implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name = "type")
	private String type;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "cheque_no")
	private String chequeNo;

	@Column(name = "cheque_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date chequeDate;

	@Column(name = "gross_amount", columnDefinition = "decimal")
	private BigDecimal grossAmount;

	@Column(name = "commision", columnDefinition = "decimal")
	private BigDecimal commision;

	@Column(name = "pif_no")
	private String pifNo;

	@Column(name = "deposit_slip_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date depositSlipDate;

	@Column(name = "collection_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date collectionDate;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "business_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date businessDate;

	@Column(name = "login_id")
	private String loginId;

	@Column(name = "created_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;

	@Column(name = "last_modified_id")
	private String lastModifiedId;

	@Column(name = "last_modified_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastModifiedDate;

	@Column(name = "tran_id")
	private String tranId;

	@Column(name = "mid_code")
	private String midCode;

	@Column(name = "payee_bank_name")
	private String payeeBankName;

	@Column(name = "collected_amount", columnDefinition = "decimal")
	private BigDecimal collectedAmount;

	@Column(name = "total_collected_amount", columnDefinition = "decimal")
	private BigDecimal totalCollectedAmount;
	
	@Column(name = "is_service")
	private Boolean isService;
	
	
}
