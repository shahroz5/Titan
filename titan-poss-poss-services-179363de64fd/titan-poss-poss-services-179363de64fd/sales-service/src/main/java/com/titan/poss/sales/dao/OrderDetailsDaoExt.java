/* Copyright 2019. Titan Company Limited
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
import com.titan.poss.sales.base.OrderDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>order_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "sales_order_details")
@EqualsAndHashCode(callSuper = false)
public class OrderDetailsDaoExt extends OrderDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private OrderDaoExt order;

}