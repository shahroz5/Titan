/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PaymentDao;

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
public class PayeeBankLocationMappingBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@ManyToOne
	@JoinColumn(name = "bank_name", referencedColumnName = "bank_name")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private PayeeBankDao payeeBank;
	
	@ManyToOne
	@JoinColumn(name = "payment_code", referencedColumnName = "payment_code")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private PaymentDao payment;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "gl_code")
	private String glCode;

	@Column(name = "is_default")
	private Boolean isDefault;

}
