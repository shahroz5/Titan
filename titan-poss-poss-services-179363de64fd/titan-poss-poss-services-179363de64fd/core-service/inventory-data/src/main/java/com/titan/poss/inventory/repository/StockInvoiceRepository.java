/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * Handles repository operations for Stn
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface StockInvoiceRepository extends JpaRepository<StockInvoiceDao, Integer> {

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryCountDto(i.invoiceType,count(i)) FROM  StockInvoiceDao i WHERE "
			+ " i.destLocationCode = :locationCode AND i.status = :status AND i.invoiceType= :invoiceType GROUP BY i.invoiceType")
	List<InventoryCountDto> getPurchaseInvoiceCount(@Param("locationCode") String locationCode,
			@Param("status") String status, @Param("invoiceType") String invoiceType);

	List<StockInvoiceDao> findByInvoiceTypeAndStatusAndSrcLocationCode(String invoiceType, String string,
			String locationCode);

	@Modifying
	@Query("UPDATE StockInvoiceDao si set"
			+ " si.totalIssuedQuantity = si.totalIssuedQuantity + :totalQuantity, si.totalIssuedWeight = si.totalIssuedWeight + :totalWeight, si.totalIssuedValue = si.totalIssuedValue + :totalValue,"
			+ " si.totalReceivedQuantity = si.totalReceivedQuantity + :totalQuantity, si.totalReceivedWeight = si.totalReceivedWeight + :totalWeight, si.totalReceivedValue = si.totalReceivedValue + :totalValue ,"
			+ " si.totalDiscount = si.totalDiscount + :totalDiscount"
			+ " where si.id = :id AND si.status = 'OPEN'")
	void updateTotalValues(@Param("totalQuantity") Short totalQuantity, @Param("totalWeight") BigDecimal totalWeight,
			@Param("totalValue") BigDecimal totalValue, @Param("id") Integer id, @Param("totalDiscount") BigDecimal totalDiscount);

	// updating header while confirming request.
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_invoice SET"
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_issued_value=i.reqValue,"
			+ " total_issued_quantity=i.quantity, total_issued_weight=i.weights FROM "
			+ "(SELECT sum(sd.issued_quantity) as quantity," + "sum(sd.issued_weight) as weights,"
			+ "sum(sd.issued_value) as reqValue "
			+ "FROM stock_invoice_details sd where stock_invoice_id=:id)as i where id=:id")
	void updateTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

		@Modifying
		@Query(nativeQuery = true, value = "UPDATE stock_invoice SET"
				+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
				+ "total_issued_value=i.reqValue,"
				+ " total_issued_quantity=i.quantity, total_issued_weight=i.weights FROM "
				+ "(SELECT sum(sd.issued_quantity) as quantity," + "sum(sd.issued_weight) as weights,"
				+ "sum(sd.issued_value) as reqValue "
				+ "FROM stock_invoice_details sd where id IN (:stockInvIds))as i where id=:id")
		void updateTotalWeightAndQuantityData(@Param("id") Integer id,@Param("stockInvIds") List<String> stockInvIds,
				@Param("lastModifiedDate") Date lastModifiedDate,
				@Param("lastModifiedBy") String lastModifiedBy);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_invoice SET"
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_received_value=i.reqValue,"
			+ " total_received_quantity=i.quantity, total_received_weight=i.weights FROM "
			+ "(SELECT sum(sd.received_quantity) as quantity," + "sum(sd.received_weight) as weights,"
			+ "sum(sd.received_value) as reqValue "
			+ "FROM stock_invoice_details sd where stock_invoice_id=:id)as i where id=:id")
	void updatePurchaseTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	Optional<StockInvoiceDao> findByIdAndInvoiceType(Integer id, String invoiceType);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockInvoiceDao sr set sr.prints = :printCount where sr.id = :id ")
	void updatePrintCount(@Param("printCount") Short printCount, @Param("id") Integer id);

	// Queries related to history
	@Query("SELECT stockInvoice FROM StockInvoiceDao stockInvoice WHERE stockInvoice.invoiceType = :invoiceType AND "
			+ " (stockInvoice.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) "
			+ " AND stockInvoice.destLocationCode = :destLocationCode AND "
			+ " (stockInvoice.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) AND"
			+ " (stockInvoice.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL) AND"
			+ " (stockInvoice.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (stockInvoice.destDocNo = :destDocNo OR :destDocNo IS NULL) AND"
			+ " stockInvoice.destDocDate between :startDate AND :endDate AND stockInvoice.status IN (:statuses)")
	Page<StockInvoiceDao> listPurchaseInvoiceHistory(@Param("invoiceType") String invoiceType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("destFiscalYear") Short destFiscalYear,
			@Param("srcFiscalYear") Short srcFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("statuses") List<String> statuses, Pageable pageable);

	// Queries related to history
	@Query("SELECT stockInvoice FROM StockInvoiceDao stockInvoice WHERE stockInvoice.invoiceType = :invoiceType AND "
			+ " (stockInvoice.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) "
			+ " AND stockInvoice.srcLocationCode = :srcLocationCode AND "
			+ " (stockInvoice.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ " (stockInvoice.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL) AND"
			+ " (stockInvoice.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (stockInvoice.destDocNo = :destDocNo OR :destDocNo IS NULL) AND"
			+ " stockInvoice.srcDocDate between :startDate AND :endDate AND stockInvoice.status IN (:statuses)")
	Page<StockInvoiceDao> listReturnInvoiceHistory(@Param("invoiceType") String invoiceType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("destFiscalYear") Short destFiscalYear,
			@Param("srcFiscalYear") Short srcFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("statuses") List<String> statuses, Pageable pageable);

	Optional<StockInvoiceDao> findByIdAndSrcLocationCodeAndInvoiceType(Integer id, String locationCode,
			String invoiceType);

	Optional<StockInvoiceDao> findByIdAndDestLocationCodeAndInvoiceType(Integer id, String locationCode,
			String invoiceType);

	@Query("SELECT s FROM StockInvoiceDao s WHERE s.status='OPEN'")
	List<StockInvoiceDao> getStockInvoiceWhereStatusIsOpen();

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_invoice SET total_received_quantity = total_issued_quantity, "
			+ " total_received_weight = total_issued_weight,total_received_value = total_issued_value,last_modified_by = :lastModifiedBy, "
			+ " last_modified_date = :lastModifiedDate WHERE status='ISSUED' AND invoice_type IN ('CFA_BTQ')")
	void updateStockInvoiceStatus(@Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	@Modifying
	@Query("UPDATE StockInvoiceDao si SET si.orderType = :orderType WHERE si.id = :id")
	void updateStockInvoiceOrderType(@Param("id") Integer id, @Param("orderType") String orderType);

	/**
	 * @param stockId
	 * @return
	 */
	StockInvoiceDao findOneById(Integer stockId);

	StockInvoiceDao findByDestLocationCodeAndInvoiceTypeAndSrcDocNo(String destLocationCode, String invoiceType,
			Integer srcDocNo);

	List<StockInvoiceDao> findByInvoiceTypeAndFilePublishedAndStatusIn(String invoiceType, Boolean filePublishedStatus,
			List<String> status);
	
	@Modifying
	@Query("UPDATE StockInvoiceDao si SET si.filePublished = :filePublished WHERE si.id = :id")
	void updateStockInvoiceFilePublished(@Param("filePublished") Boolean filePublished, @Param("id") Integer id);
	
	

}
