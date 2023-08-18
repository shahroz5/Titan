package com.titan.poss.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.BankPriorityDaoExt;
@Repository
public interface BankPriorityRepositoryExt extends JpaRepository<BankPriorityDaoExt, String>{

	/**
	 * 
	 * @param locationCode
	 * @return List<BankPriorityDao>
	 */
	List<BankPriorityDaoExt> findAllByLocationCodeOrderByPriority(String locationCode);

	/**
	 * 
	 * @param locationCode
	 * @param bankName
	 * @return List<BankPriorityDao>
	 */
	List<BankPriorityDaoExt> findByLocationCodeAndBankNameIn(String locationCode, List<String> bankName);

	List<BankPriorityDaoExt> findByLocationCode(String locationCode);
}
