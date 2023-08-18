/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.location.base.TownBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "town_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class TownDao extends TownBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "town_id", columnDefinition = "uniqueidentifier")
	private String townId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "state_id", referencedColumnName = "state_id")
	private StateDao state;

}
