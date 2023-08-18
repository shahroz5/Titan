/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "SalesInvoiceDocumentsDao")
@Table(name = "sales_invoice_documents")
@EqualsAndHashCode(callSuper = false)
public class SalesInvoiceDocumentsDao extends SyncableEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "invoice_number")
	private String invoiceNumber;

	@Column(name = "qr_code_value", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String qrCodeValue;

	@Column(name = "acknowledgement_no")
	private String acknowledgementNo;

	@Column(name = "acknowledgement_date")
	private Date acknowledgementDate;

	@Column(name = "reference_id")
	private String referenceId;

	@Column(name = "transaction_type")
	private String transactionType;

}
