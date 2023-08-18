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

import com.titan.poss.sales.dao.base.CustomerPaymentBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>customer_payment</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Entity
@Table(name = "customer_payment")
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerPaymentDaoExt extends CustomerPaymentBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_master_id", referencedColumnName = "id")
	private CustomerDaoExt customer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
	@JoinColumn(name = "location_code", referencedColumnName = "location_code")
	private CustomerLocationMappingDao customerLocationMap;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_id", referencedColumnName = "id")
	private PaymentDetailsDaoExt paymentDetailsDao;

}
