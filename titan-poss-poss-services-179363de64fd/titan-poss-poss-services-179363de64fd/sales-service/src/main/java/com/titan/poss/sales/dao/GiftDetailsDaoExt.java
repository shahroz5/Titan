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

import com.titan.poss.sales.base.GiftDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Repository for GiftDetailsDaoExt.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "gift_details")
@EqualsAndHashCode(callSuper = false)
public class GiftDetailsDaoExt extends GiftDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String itemId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cash_memo_id", referencedColumnName = "id")
	private CashMemoDaoExt cashMemoDao;
}
