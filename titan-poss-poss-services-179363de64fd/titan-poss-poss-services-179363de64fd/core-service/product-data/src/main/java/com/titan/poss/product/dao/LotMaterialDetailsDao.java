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
@Table(name = "lot_material_details")
@EqualsAndHashCode(callSuper = false)
public class LotMaterialDetailsDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private LotMaterialDetailsIdDao lotDetailsId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "material_code", referencedColumnName = "material_code")
	private MaterialDao material;

	@Column(name = "material_weight", columnDefinition = "decimal")
	private BigDecimal materialWeight;

	@Column(name = "no_of_materials")
	private Integer noOfMaterials;

	@Column(name = "weight_unit")
	private String weightUnit;
	
    @Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
