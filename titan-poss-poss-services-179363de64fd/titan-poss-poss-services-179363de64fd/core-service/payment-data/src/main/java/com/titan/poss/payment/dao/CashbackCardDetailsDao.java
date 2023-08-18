/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.payment.base.CashbackCardDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "cashback_card_details")
@EqualsAndHashCode(callSuper = false)
public class CashbackCardDetailsDao extends CashbackCardDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	@EqualsAndHashCode.Exclude
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cashback_id", referencedColumnName = "cashback_id")
	@EqualsAndHashCode.Exclude
	private CashbackDao cashbackDao;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	

}
