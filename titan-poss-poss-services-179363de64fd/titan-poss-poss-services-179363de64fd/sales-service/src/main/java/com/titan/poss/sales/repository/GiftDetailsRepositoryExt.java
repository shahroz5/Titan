/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GiftDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCashMemoGiftDetailsRepositoryExt")
public interface GiftDetailsRepositoryExt extends JpaRepository<GiftDetailsDaoExt, String> {

	/**
	 *
	 * @param cashMemoId
	 * @return Integer
	 */
	Integer countByCashMemoDaoId(String cashMemoId);

	/**
	 *
	 * @param itemId
	 * @param cashMemoId
	 * @return GiftDetailsDao
	 */
	GiftDetailsDaoExt findOneByItemIdAndCashMemoDaoId(String itemId, String cashMemoId);

	/**
	 *
	 * @param cashMemoId
	 * @return List<GiftDetailsDao>
	 */
	List<GiftDetailsDaoExt> findByCashMemoDaoId(String cashMemoId);
}
