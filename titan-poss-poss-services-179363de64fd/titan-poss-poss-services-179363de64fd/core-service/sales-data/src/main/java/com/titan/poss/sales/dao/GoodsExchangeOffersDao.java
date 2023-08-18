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
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.GoodsExchangeOffersBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "goods_exchange_offers")
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeOffersDao extends GoodsExchangeOffersBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "goods_exchange_details_id", referencedColumnName = "id")
	private GoodsExchangeDetailsDao goodsExchangeDetails;
}
