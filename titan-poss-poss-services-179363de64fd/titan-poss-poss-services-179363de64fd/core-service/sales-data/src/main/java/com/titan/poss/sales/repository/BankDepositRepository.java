package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BankDepositDao;

@Repository("bankDepositRepository")
public interface BankDepositRepository extends JpaRepository<BankDepositDao, String> {

	/**
	 * 
	 * @param idList
	 * @param locationCode
	 * @return List<BankDepositDao>
	 */
	List<BankDepositDao> findByIdInAndLocationCode(List<String> idList, String locationCode);

	/**
	 * 
	 * @param status
	 * @param locationCode
	 * @param paymentCode
	 * @param pageable
	 * @return Page<BankDepositDao>
	 */
	Page<BankDepositDao> findByIsBankingCompletedAndLocationCodeAndPaymentCodeIn(Boolean status, String locationCode,
			List<String> paymentCode, Pageable pageable);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param status
	 * @return List<BankDepositDao>
	 */
	List<BankDepositDao> findByLocationCodeAndBusinessDateAndIsBankingCompleted(String locationCode, Date businessDate,
			Boolean status);

	/**
	 * @param txnId
	 * @param locationCode
	 * @return
	 */
	BankDepositDao findByIdAndLocationCode(String txnId, String locationCode);

	/**
	 * @param payeeBankName
	 * @param depositDate
	 * @param true1
	 * @param locationCode
	 * @param paymentCode
	 * @return
	 */
	List<BankDepositDao> findAllByPayeeBankNameAndDepositDateAndIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
			String payeeBankName, Date depositDate, Boolean true1, String locationCode, String paymentCode);

}
