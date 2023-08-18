/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import org.hibernate.annotations.Proxy;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
@Proxy(lazy = false)
public class FocSchemeDetailsBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "item_type")
	private String itemType;

	@Column(name = "category")
	private String category;

	@Column(name = "foc_eligibility", columnDefinition = "nvarchar")
	private String focEligibility;

	@Column(name = "offer_type")
	private String offerType;

	@Column(name = "multiply_factor", columnDefinition = "decimal")
	private BigDecimal stdSaleValue;

	@Column(name = "from_sale_value", columnDefinition = "decimal")
	private BigDecimal fromSaleValue;

	@Column(name = "to_sale_value", columnDefinition = "decimal")
	private BigDecimal toSaleValue;

	@Column(name = "weight", columnDefinition = "decimal")
	private BigDecimal weight;

	@Column(name = "quantity", columnDefinition = "SMALLINT")
	private Integer quantity;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

	@Column(name = "is_single")
	private Boolean isSingle;

	@Column(name = "is_multiple")
	private Boolean isMultiple;
}
