/*  
	 * Copyright 2019. Titan Company Limited
	 * All rights reserved.
	 */
package com.titan.poss.product.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Embeddable
public class LotDetailsIdDao implements Serializable {
	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_code")
	private ItemDao item;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "line_item_no")
	private Short lineItemNo;
}
