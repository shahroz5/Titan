/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

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
public class FocSchemeProductMappingDaoExt extends FocSchemeProductMappingBaseDao {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	@EqualsAndHashCode.Include
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scheme_id", referencedColumnName = "id")
	private FocSchemeMasterDaoExt focSchemeMasterDao;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scheme_details_id", referencedColumnName = "id")
	private FocSchemeDetailsDaoExt focSchemeDetailsDao;
}
