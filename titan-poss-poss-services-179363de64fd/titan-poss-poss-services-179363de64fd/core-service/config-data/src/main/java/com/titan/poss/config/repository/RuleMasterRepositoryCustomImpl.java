/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.titan.poss.config.dao.RuleMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class RuleMasterRepositoryCustomImpl implements RuleMasterRepositoryCustom {

	@PersistenceContext()
	private EntityManager em; // here you will get plain EntityManager impl

	@SuppressWarnings("unchecked")
	@Override
	public Page<RuleMasterDao> getRuleDetailsBasedOnFilters(Map<String, String> query, Pageable pageable) {

		String finalQuery = query.get("finalQuery");
		
	
		String countQuery = query.get("countQuery");
		
	
		List<RuleMasterDao> results = em.createNativeQuery(finalQuery, RuleMasterDao.class)
				.getResultList();

		Query resultList = em.createNativeQuery(countQuery);

		int count = ((Number) resultList.getSingleResult()).intValue();

		return new PageImpl<>(results, pageable, count);

	}

}
