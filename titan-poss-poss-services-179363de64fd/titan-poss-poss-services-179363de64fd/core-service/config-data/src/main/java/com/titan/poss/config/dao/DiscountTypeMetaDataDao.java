/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "discount_metadata")
@EqualsAndHashCode(callSuper = false)
public class DiscountTypeMetaDataDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "discount_type")
	private String discountType;

	@Column(name = "location_mapping", columnDefinition = "BIT")
	private Boolean locationMapping;

	@Column(name = "product_group_mapping", columnDefinition = "BIT")
	private Boolean productGroupMapping;

	@Column(name = "product_category_mapping", columnDefinition = "BIT")
	private Boolean productCategoryMapping;

	@Column(name = "item_mapping", columnDefinition = "BIT")
	private Boolean itemMapping;

	@Column(name = "exclude_mapping", columnDefinition = "BIT")
	private Boolean excludeMapping;

	@Column(name = "is_default", columnDefinition = "BIT")
	private Boolean isDefault;

	@Column(name = "applicable_level")
	private String applicableLevel;

	@Column(name = "is_manual_discount", columnDefinition = "BIT")
	private Boolean isManualDiscount;

}
