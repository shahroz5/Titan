/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.inventory.repository;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class InventoryDetailRepositoryExtImpl implements CustomInventoryDetailRepositoryExt {

	@PersistenceContext()
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	@Override
	public Page<Object[]> getDetails(Map<String, String> query, Pageable pageable) {

		String finalQuery = query.get("finalQuery");
		String countQuery = query.get("countQuery");

		List<Object[]> results = entityManager.createNativeQuery(finalQuery).getResultList();

		Query resultList = entityManager.createNativeQuery(countQuery);

		int count = ((Number) resultList.getSingleResult()).intValue();

		return new PageImpl<>(results, pageable, count);

	}
}
