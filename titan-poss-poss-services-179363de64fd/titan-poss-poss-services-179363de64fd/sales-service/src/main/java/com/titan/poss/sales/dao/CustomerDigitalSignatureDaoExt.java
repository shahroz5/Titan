package com.titan.poss.sales.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@Entity
@Table(name = "customer_digital_signature")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class CustomerDigitalSignatureDaoExt extends AuditableEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	
	@Column(name = "ulp_number")
	private String ulpNumber;

	@Column(name = "customer_type")
	private String customerType;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "customer_id", nullable = false,referencedColumnName = "id")
	private CustomerDaoExt customer;
	
	@Column(name = "mobile_number")
	private String mobileNumber;
	
	@Column(name = "applicable_transaction_types",columnDefinition = "NVARCHAR")
	private String applicableTransactionTypes;
	
	@Column(name = "location_code")
	private String locationCode;
	
	@Column(name = "digital_signature")
	private String digitalSignature;
	
	@Column(name = "customer_document_txn_id",columnDefinition = "NVARCHAR")
	private String customerDocumentTxnId;
	
}
