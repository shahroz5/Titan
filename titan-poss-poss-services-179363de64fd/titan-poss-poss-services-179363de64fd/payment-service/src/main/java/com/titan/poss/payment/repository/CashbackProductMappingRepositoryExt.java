package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackProductMappingDaoExt;

@Repository
public interface CashbackProductMappingRepositoryExt extends JpaRepository<CashbackProductMappingDaoExt, String> {

	/*
	 * This method will delete the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 */
	@Modifying
	@Query("DELETE from CashbackProductMappingDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id IN (:productList)")
	void deleteProductBasedOnCashbackId(@Param("cashBackId") String cashBackId,
			@Param("productList") Set<String> productList);

	/*
	 * This method will return the products mapped to cashback id.
	 * 
	 * @param cashBackId
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT cp FROM CashbackProductMappingDaoExt cp WHERE cp.cashbackDao.id = :cashBackId")
	List<CashbackProductMappingDaoExt> findMappedProduct(@Param("cashBackId") String cashBackId);

	/*
	 * This method will return the cashback product mapping based on cardNumber.
	 * 
	 * @param cardNumber
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT cpm.productGroupCode FROM CashbackProductMappingDaoExt cpm WHERE cpm.cashbackDao.id = "
			+ "(SELECT cp.cashbackDao.id FROM CashbackCardDetailsDaoExt cp WHERE cp.cardNo = :cardNumber)")
	List<String> getMappedProductGroups(@Param("cardNumber") String cardNumber);

	@Override
	Optional<CashbackProductMappingDaoExt> findById(String id);

	/*
	 * This method will return the cashback product mapping based on cardbackId.
	 * 
	 * @param cashBackId
	 * 
	 * @return List<String>
	 */
	@Query("SELECT co from CashbackProductMappingDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id IN (:removeProductGroups)")
	List<CashbackProductMappingDaoExt> findAllById(@Param("cashBackId") String cashBackId,
			@Param("removeProductGroups") List<String> removeProductGroups);

	/**
	 * @param removeIdList
	 * @return
	 */
	List<CashbackProductMappingDaoExt> findByIdIn(@Param("removeIdList") List<String> removeIdList);

}
