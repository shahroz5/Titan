package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Proxy;

import com.titan.poss.config.base.FocSchemeMasterBaseDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "foc_scheme_master")
@EqualsAndHashCode(callSuper = false)
@Proxy(lazy = false)
public class FocSchemeMasterDao extends FocSchemeMasterBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
