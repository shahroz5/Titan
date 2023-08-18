package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Proxy;

import com.titan.poss.config.base.FocSchemeDetailsBaseDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "foc_scheme_details")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Proxy(lazy = false)
public class FocSchemeDetailsDao extends FocSchemeDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scheme_id", referencedColumnName = "id")
	private FocSchemeMasterDao focSchemeMasterDao;

}
