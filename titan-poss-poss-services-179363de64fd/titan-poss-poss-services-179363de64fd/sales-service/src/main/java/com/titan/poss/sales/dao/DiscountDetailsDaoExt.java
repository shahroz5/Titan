/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.sales.base.DiscountDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>discount_details_sales</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "discount_details_sales")
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class DiscountDetailsDaoExt extends DiscountDetailsBaseDao{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "discount_config_id", referencedColumnName = "id")
	private DiscountConfigDetailsDaoExt discountConfig;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDaoExt salesTxn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ref_payment_id", referencedColumnName = "id")
	private PaymentDetailsDaoExt refPayment;
}
