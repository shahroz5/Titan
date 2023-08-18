/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>customer_documents</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "CustomerDocuments")
@Table(name = "customer_documents")
@EqualsAndHashCode(callSuper = false)
public class CustomerDocumentsDao extends MasterSyncableEntity implements Comparable<CustomerDocumentsDao> {

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "transaction_id", columnDefinition = "uniqueidentifier")
	private String txnId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_master_id", referencedColumnName = "id")
	private CustomerDao customer;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "document_type")
	private String documentType;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "file_sub_type")
	private String fileSubType;

	@Column(name = "document_path")
	private String documentPath;

	@Column(name = "is_synced")
	private Boolean isSynced;

	@Column(name = "process_id", columnDefinition = "uniqueidentifier")
	private String processId;

	@Column(name = "status")
	private String status;

	@Override
	public int compareTo(CustomerDocumentsDao cd) {
		return getCreatedDate().compareTo(cd.getCreatedDate());
	}
}
