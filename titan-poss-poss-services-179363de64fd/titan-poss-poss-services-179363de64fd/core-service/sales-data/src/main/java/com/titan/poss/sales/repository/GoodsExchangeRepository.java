/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GoodsExchangeDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("goodsExchangeRepository")
public interface GoodsExchangeRepository extends JpaRepository<GoodsExchangeDao, String> {

}
