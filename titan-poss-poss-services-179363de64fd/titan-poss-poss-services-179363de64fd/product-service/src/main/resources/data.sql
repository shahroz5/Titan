DELETE FROM lot_details;
DELETE FROM lot_details_aud;

DELETE FROM item_stone_mapping;


DELETE FROM price_master;
DELETE FROM price_master_aud;

DELETE FROM lot_master;
DELETE FROM lot_master_aud;

DELETE FROM item_master;
DELETE FROM item_master_aud;

DELETE FROM brand_master;
DELETE FROM brand_master_aud;

DELETE FROM product_category_master;
DELETE FROM product_category_master_aud;

DELETE FROM product_group_master;
DELETE FROM product_group_master_aud;

DELETE FROM organization_master;
DELETE FROM organization_master_aud;

DELETE FROM complexity_price_group_mapping;
DELETE FROM complexity_price_group_mapping_aud;

DELETE FROM complexity_master;
DELETE FROM complexity_master_aud;

DELETE FROM stone_master;
DELETE FROM stone_master_aud;

DELETE FROM stone_type_master;
DELETE FROM stone_type_master_aud;

DELETE FROM depreciation_master;
DELETE FROM depreciation_master_aud;

DELETE FROM purity_master;
DELETE FROM purity_master_aud;

DELETE FROM material_master;
DELETE FROM material_master_aud;

DELETE FROM prod_lov_master;
DELETE FROM prod_lov_master_aud;

DELETE FROM price_group_master;
DELETE FROM price_group_master_aud;

/* set id auto-generation to 1*/
DBCC CHECKIDENT (purity_master, RESEED, 0); 



INSERT INTO organization_master (org_code,description,parent_org_code,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('T','Titan',NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO brand_master (brand_code,description,parent_brand_code,org_code,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('Tanishq','Tanishq',NULL,'T','{}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('ZOYA','ZOYA','Tanishq',NULL,'{"brandConfigDetails":{"brandShortName":"Tanishq","brandName":"Tanishq","cashRefundLimit":"11111","ULPServiceURL":"URL","dummyMobNo":"1111111111","brandDetailsCheckBox":{"isInterbrandTEPAllowed":true,"referCashPaymentConfig":false}}}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO complexity_master (complexity_code,description,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('PA','Complexity A - Plain',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO depreciation_master (depreciation_code,description,percentage,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('Ruby','Red colour stones',50,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO material_master (material_type_code,description,org_code,material_type,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('J','Gold',NULL,'METAL',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO prod_lov_master (id,lov_type,code,value,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(NEWID(),'PRODUCTTYPE','STUDDED','STUDDED',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO stone_type_master (stone_type_code,description,depreciation_code,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('DU','DUMMY','Ruby','{}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO stone_master (stone_code,color,std_weight,stone_type_code,quality,shape,std_value,rate_per_carat,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('20DIRHPTG002','PINK',0.007,'DU','Treated Diamond','ROUND',469,NULL,'{}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO purity_master (material_type_code,purity,karat,offset,description,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('J',10,24,1,'for silver',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO product_category_master(product_category_code,description,org_code,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('C','CHAIN',NULL,'{}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0); 

INSERT INTO product_group_master (product_group_code,product_type,description,material_type_code,org_code,pricing_type,metal_type,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,plain_studded,src_datasync_id,dest_datasync_id) values('GV',NULL,'Gift Voucher',NULL,NULL,NULL,NULL,NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,0,0);

INSERT INTO price_group_master (price_group,description,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('Bangalore','Bangalore',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('KADAPA','KADAPA',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO complexity_price_group_mapping  (id,complexity_code,price_group,making_charge_punit,making_charge_pgram,wastage_pct,making_charge_pct,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(NEWID(),'PA','Bangalore',1,2,12,2,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO item_master (item_code,description,std_weight,std_value,complexity_code,product_group_code,product_category_code,brand_code,material_type_code,purity,karat,pricing_group_type,pricing_type,stone_charges,lead_time,org_code,parent_item_code,item_details,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,is_editable,tax_class_code,currency_code,weight_unit,src_datasync_id,dest_datasync_id) values('100ABEA098','W451-ETHNIC DIAL',NULL,310,'PA','GV','C','Tanishq','J',NULL,NULL,'UCP','UCP',NULL,NULL,'T',NULL,NULL,NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,NULL,NULL,NULL,0,0),('100ABEA0981','W451-ETHNIC DIAL',NULL,310,'PA','GV','C','Tanishq','J',NULL,NULL,'UCP','UCP',NULL,NULL,'T',NULL,NULL,NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,NULL,NULL,NULL,0,0);

INSERT INTO item_stone_mapping  (id,item_code,no_of_stones,stone_code,created_by,created_date,last_modified_by,last_modified_date,is_active,src_datasync_id,dest_datasync_id) values(NEWID(),'100ABEA098',8,'20DIRHPTG002','Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,0,0);	

INSERT INTO price_master (id,item_code,price_group,making_charge,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(NEWID(),'100ABEA098','Bangalore',11618,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO lot_master (lot_number,item_code,mfg_date,stone_value,stone_details,is_active,created_by,created_date,last_modified_by,last_modified_date,parent_lot_number,parent_item_code,src_datasync_id,dest_datasync_id) values('1BA000001','100ABEA098',GETDATE(),12345,'{"StoneWeight":0.000,"DiamondWeight":0.501}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,NULL,0,0);

INSERT INTO lot_details (lot_number,item_code,line_item_no,stone_code,stone_weight,no_of_stones,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('1BA000001','100ABEA098',1,'20DIRHPTG002',1.097,98,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);