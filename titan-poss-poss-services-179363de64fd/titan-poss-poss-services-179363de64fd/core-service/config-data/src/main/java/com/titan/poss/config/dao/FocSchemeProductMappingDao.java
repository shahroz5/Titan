/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Proxy;

import com.titan.poss.config.base.FocSchemeProductMappingBaseDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "foc_scheme_product_mapping")
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@Proxy(lazy = false)
public class FocSchemeProductMappingDao extends FocSchemeProductMappingBaseDao {

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	@EqualsAndHashCode.Include
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scheme_id", referencedColumnName = "id")
	private FocSchemeMasterDao focSchemeMasterDao;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scheme_details_id", referencedColumnName = "id")
	private FocSchemeDetailsDao focSchemeDetailsDao;

}
