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

import com.titan.poss.location.base.StateTaxDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "state_tax_details")
@EqualsAndHashCode(callSuper = false)
public class StateTaxDetailsDaoExt extends StateTaxDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

}
