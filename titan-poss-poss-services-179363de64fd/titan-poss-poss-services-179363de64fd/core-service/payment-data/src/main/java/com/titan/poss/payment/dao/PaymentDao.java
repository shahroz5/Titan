/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "payment_master")
@EqualsAndHashCode(callSuper = false)
public class PaymentDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@NotNull
	@Column(name = "payment_code", nullable = false)
	private String paymentCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "payment_group", columnDefinition = "VARCHAR")
	private String paymentGroup;

	@Column(name = "field_details", columnDefinition = "NVARCHAR")
	private String fieldDetails;

	@Column(name = "is_editable")
	private Boolean isEditable;

	@Column(name = "customer_dependent")
	private Boolean customerDependent;

	@Column(name = "oracle_mapping")
	private String oracleMapping;

}