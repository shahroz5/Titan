/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.base;

import java.io.Serializable;


import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;
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
public class PayerLocationMappingBaseDao extends SyncTimeDao implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Column(name = "location_code")
	private String locationCode;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_code", referencedColumnName = "payment_code")
	private PaymentDao payment;

}
