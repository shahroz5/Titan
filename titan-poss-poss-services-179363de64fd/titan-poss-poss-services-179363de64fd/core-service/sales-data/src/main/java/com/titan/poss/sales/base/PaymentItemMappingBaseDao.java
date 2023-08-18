/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base DAO class for <b>payment_item_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class PaymentItemMappingBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "item_id", columnDefinition = "uniqueidentifier")
	private String itemId;

	@Column(name = "amount", columnDefinition = "DECIMAL")
	private BigDecimal amount;

	@Column(name = "product_group_code")
	private String productGroupCode;

}
