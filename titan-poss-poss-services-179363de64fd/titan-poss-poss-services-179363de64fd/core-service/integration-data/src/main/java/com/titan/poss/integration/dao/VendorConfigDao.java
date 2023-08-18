/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity
@Table(name = "vendor_configs")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class VendorConfigDao extends VendorConfigBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "config_id", columnDefinition = "uniqueidentifier", updatable = false)
	private String configId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vendor_code", nullable = false)
	private VendorDao vendor;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
