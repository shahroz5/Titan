package com.titan.poss.sales.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BinToBinFileItemsStageDao;
import com.titan.poss.sales.dao.BinToBinFileStageDao;

@Repository
public interface BinToBinFileItemsStageRepository extends JpaRepository<BinToBinFileItemsStageDao, String> {

	List<BinToBinFileItemsStageDao> findAllByBinToBinFileStage(BinToBinFileStageDao binToBinFileStage);

	
	@Transactional
	@Modifying
	@Query("delete from BinToBinFileItemsStageDao b where b.id IN(:ids)")
	void deleteAllByIdIn(@Param("ids") List<String> ids);
	
	@Transactional
	@Modifying
	@Query(nativeQuery = true, value="delete from bintobin_file_items_stage where bintobin_file_stage_id= :fileId AND inventory_id IN (:inventoryIds)")
	void deleteByInventoryId(@Param("fileId") Integer fileId,@Param("inventoryIds") List<String> inventoryIds);
	
    List<BinToBinFileItemsStageDao> findByItemStatus(String itemStatus);
    
	List<BinToBinFileItemsStageDao> findByBinToBinFileStageAndItemStatus(BinToBinFileStageDao binToBinFileStage,String itemStatus);

	
}
