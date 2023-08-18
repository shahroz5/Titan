/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.sales.base.DiscountDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DAO for <b>discount_details</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "SalesDiscountDetailsDao")
@Table(name = "discount_details_sales")
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class DiscountDetailsDao extends DiscountDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "discount_config_id", referencedColumnName = "id")
	private DiscountConfigDetailsDao discountConfig;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDao salesTxn;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ref_payment_id", referencedColumnName = "id")
	private PaymentDetailsDao refPayment;

	/**
	 * @param id
	 */
	public DiscountDetailsDao(String id) {
		super();
		this.id = id;
	}

}
