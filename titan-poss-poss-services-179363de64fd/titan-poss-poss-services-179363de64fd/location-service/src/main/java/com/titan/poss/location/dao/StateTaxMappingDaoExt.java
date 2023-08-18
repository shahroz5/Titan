/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.location.base.StateTaxMappingBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "state_tax_mapping")
@EqualsAndHashCode(callSuper = false)
public class StateTaxMappingDaoExt extends StateTaxMappingBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
