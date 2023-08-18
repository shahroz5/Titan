/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GoodsExchangeOffersDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesGoodsExchangeOffersRepository")
public interface GoodsExchangeOffersRepositoryExt extends JpaRepository<GoodsExchangeOffersDaoExt, String> {

	GoodsExchangeOffersDaoExt findByGoodsExchangeDetailsId(String id);

}
