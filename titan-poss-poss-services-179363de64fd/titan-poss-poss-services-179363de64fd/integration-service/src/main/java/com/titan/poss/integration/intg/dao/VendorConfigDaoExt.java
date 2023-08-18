/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.integration.dao.VendorConfigBaseDao;
import com.titan.poss.integration.dao.VendorDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@Entity
@Table(name = "vendor_configs")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class VendorConfigDaoExt extends VendorConfigBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "config_id", columnDefinition = "uniqueidentifier", updatable = false)
	private String configId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vendor_code", nullable = false)
	private VendorDao vendor;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
