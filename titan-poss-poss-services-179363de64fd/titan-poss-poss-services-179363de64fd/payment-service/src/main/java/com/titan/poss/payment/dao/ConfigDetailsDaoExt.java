package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.payment.base.ConfigDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "payment_config_transaction_mapping")
@EqualsAndHashCode(callSuper = false)
public class ConfigDetailsDaoExt extends ConfigDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "config_id", referencedColumnName = "config_id")
	private ConfigDaoExt configId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "transaction_type", referencedColumnName = "transaction_type")
	private TransactionDao transactionDao;
}
