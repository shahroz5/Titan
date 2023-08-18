/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.config.dao.DiscountDao;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class DiscountRepositoryCustomImpl implements DiscountRepositoryCustom {

	@PersistenceContext(unitName = "configDataEntityManager")
	private EntityManager em; // here you will get plain EntityManager impl

	
	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public List<DiscountDao> getDiscountCodes(String query) {

		List<DiscountDao> results = em.createNativeQuery(query, DiscountDao.class).getResultList();
		List<DiscountDao> list = new ArrayList<>();
		Iterator<DiscountDao> iterator = results.iterator();

		while (iterator.hasNext()) {
			list.add(iterator.next());
		}
		return list;
	}

}
