/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.GoodsExchangeDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "goods_exchange_details")
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeDetailsDao extends GoodsExchangeDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "goods_exchange_id", referencedColumnName = "id")
	private GoodsExchangeDao goodsExchange;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cash_memo_details_id", referencedColumnName = "id")
	private CashMemoDetailsDao cashMemoDetails;
}
