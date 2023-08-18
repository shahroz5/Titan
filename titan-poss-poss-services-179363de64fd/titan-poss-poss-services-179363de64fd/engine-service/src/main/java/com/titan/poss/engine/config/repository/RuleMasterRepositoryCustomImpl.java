/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class RuleMasterRepositoryCustomImpl implements RuleMasterRepositoryCustom {

	@PersistenceContext(unitName ="configDataEntityManager")
	private EntityManager em; // here you will get plain EntityManager impl

	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public List<Object[]> getValueListBasedOnFilters(String query) {
		return em.createNativeQuery(query).getResultList();
	}
}
