package com.titan.poss.store.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.store.base.BankPriorityBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@Entity
@Table(name = "payee_bank_priority_mapping")
@EqualsAndHashCode(callSuper = false)
public class BankPriorityDaoExt extends BankPriorityBaseDao{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
