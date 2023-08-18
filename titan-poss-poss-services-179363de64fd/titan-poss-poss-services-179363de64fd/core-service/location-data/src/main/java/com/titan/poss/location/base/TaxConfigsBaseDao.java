/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

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
public class TaxConfigsBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "src_location_type")
	private String srcLocationTaxType;

	@Column(name = "dest_location_type")
	private String destLocationTaxType;

	@Column(name = "src_location_applicable_tax")
	private String srcLocationApplicableTax;

	@Column(name = "dest_location_applicable_tax")
	private String destLocationApplicableTax;

	@Column(name = "customer_type")
	private String customerTaxType;

	@Column(name = "is_same_state")
	private Boolean isSameState;

	@Column(name = "src_tax_applicable")
	private Boolean srcTaxApplicable;

	@Column(name = "applicable_tax")
	private String applicableTax;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
