/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.config.base.DiscountBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "discount_master")
@EqualsAndHashCode(callSuper = false)
public class DiscountDao extends DiscountBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "refer_other_discounts", referencedColumnName = "id")
//	@JsonBackReference("refer_other_discounts")
//	private DiscountDao discount;

}
