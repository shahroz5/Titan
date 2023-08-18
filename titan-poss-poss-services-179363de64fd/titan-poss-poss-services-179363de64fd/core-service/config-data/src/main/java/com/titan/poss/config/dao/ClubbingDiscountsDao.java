/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "discount_club_master")
@EqualsAndHashCode(callSuper = false)
public class ClubbingDiscountsDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type1_discount_id", referencedColumnName = "id")
	private DiscountDao discount1;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type2_discount_id", referencedColumnName = "id")
	private DiscountDao discount2;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type3_discount_id", referencedColumnName = "id")
	private DiscountDao discount3;
}
