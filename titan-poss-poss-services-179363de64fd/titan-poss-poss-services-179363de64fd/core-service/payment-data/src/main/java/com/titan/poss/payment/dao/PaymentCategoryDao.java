/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dao;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>integration_audit</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "payment_category_master")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class PaymentCategoryDao extends MasterSyncableEntity implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "payment_category_name", unique = true, columnDefinition = "VARCHAR", nullable = false, length = 50)
	private String paymentCategoryName;

	@ManyToOne
	@JoinColumn(name = "payment_code", referencedColumnName = "payment_code")
	private PaymentDao payment;

	@Column(name = "instrument_number", columnDefinition = "NVARCHAR")
	private String instrumentNumber;

	@Column(name = "redemption_type", columnDefinition = "VARCHAR")
	private String redemptionType;

	@Column(name = "minimum_amount", columnDefinition = "decimal")
	private BigDecimal minimumAmount;

	@Column(name = "instrument_type", columnDefinition = "VARCHAR")
	private String instrumentType;

	@Column(name = "description")
	private String description;
}
