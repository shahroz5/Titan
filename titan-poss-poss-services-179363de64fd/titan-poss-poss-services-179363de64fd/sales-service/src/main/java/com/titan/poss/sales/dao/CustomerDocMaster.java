/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
//@Entity(name = "Advance")
//@Table(name = "customer_doc_master")
@EqualsAndHashCode(callSuper = false)
public class CustomerDocMaster extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "file_id", columnDefinition = "uniqueidentifier")
	private String fileId;

	// @ManyToOne(fetch = FetchType.LAZY)
	// @JoinColumn(name = "customer_master_id", referencedColumnName = "id")

	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "customer_master_id", columnDefinition = "uniqueidentifier")
	private String customerMasterId;

	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "sales_txn_id", columnDefinition = "uniqueidentifier")
	private String salesTxnId;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "file_sub_type")
	private String fileSubType;

	@Column(name = "transaction_type")
	private String transactionType;

	@Column(name = "file_path")
	private String filePath;

}
