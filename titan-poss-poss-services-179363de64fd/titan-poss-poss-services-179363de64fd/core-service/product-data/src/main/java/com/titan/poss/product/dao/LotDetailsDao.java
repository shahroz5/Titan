/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "lot_stone_details")
@EqualsAndHashCode(callSuper = false)
public class LotDetailsDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private LotDetailsIdDao lotDetailsId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "stone_code", referencedColumnName = "stone_code")
	private StoneDao stone;

	@Column(name = "stone_weight", columnDefinition = "decimal")
	private BigDecimal stoneWeight;

	@Column(name = "no_of_stones")
	private Short noOfStones;

	@Column(name = "weight_unit")
	private String weightUnit;
	
    @Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
