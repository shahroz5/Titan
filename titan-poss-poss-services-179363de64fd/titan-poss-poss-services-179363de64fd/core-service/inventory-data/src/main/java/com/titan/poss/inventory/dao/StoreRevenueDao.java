/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
@Table(name = "store_revenue")
@EqualsAndHashCode(callSuper = false)
public class StoreRevenueDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "year_revenue", columnDefinition = "DECIMAL")
	private BigDecimal yearRevenue;

	@Column(name = "return_value", columnDefinition = "DECIMAL")
	private BigDecimal returnValue;

}
