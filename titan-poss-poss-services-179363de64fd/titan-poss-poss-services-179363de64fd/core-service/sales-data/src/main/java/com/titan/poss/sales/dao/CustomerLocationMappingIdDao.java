/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Id class for <b>customer_location_mapping</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Embeddable
public class CustomerLocationMappingIdDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "location_code", columnDefinition = "NVARCHAR")
	private String locationCode;
}
