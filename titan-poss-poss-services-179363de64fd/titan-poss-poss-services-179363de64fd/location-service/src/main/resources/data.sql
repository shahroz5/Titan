DELETE FROM exchange_rate_master;
DELETE FROM exchange_rate_master_aud;

DELETE FROM material_price_location_history;

DELETE FROM material_price_location_mapping;
DELETE FROM material_price_location_mapping_aud;

DELETE FROM location_price_group_mapping;
DELETE FROM location_master;
DELETE FROM location_master_aud;

DELETE FROM location_lov_master;
DELETE FROM location_lov_master_aud;

DELETE FROM material_price_config;
DELETE FROM material_price_config_aud;

DELETE FROM market_material_mapping;
DELETE FROM market_material_mapping_aud;
DELETE FROM market_master;
DELETE FROM market_master_aud;

DELETE FROM region_master;
DELETE FROM region_master_aud;

DELETE FROM town_master;
DELETE FROM town_master_aud;

DELETE FROM state_tax_mapping;
DELETE FROM state_tax_mapping_aud;

DELETE FROM state_master;
DELETE FROM state_master_aud;

DELETE FROM pincode_master;
DELETE FROM pincode_master_aud;

DELETE FROM country_master;
DELETE FROM country_master_aud;

DELETE FROM currency_master;
DELETE FROM currency_master_aud;

DELETE FROM tax_class_master;
DELETE FROM tax_class_master_aud;

DELETE FROM tax_master;
DELETE FROM tax_master_aud;

DELETE FROM tax_configs;
DELETE FROM tax_configs_aud;

INSERT INTO currency_master (currency_code,currency_symbol,description,unicode,image,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('INR','INR','Indian Rupee',NULL,NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO country_master (country_code,description,currency_code,date_format,time_format,phone_length,locale,isd_code,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('IND','India','INR','mm-dd-yyyy','hh:MM:SSS',10,'en_IN','+91',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO exchange_rate_master (id,from_currency,to_currency,buying_rate,selling_rate,is_active,created_by,created_date,last_modified_by,last_modified_date) values(1,'IND','USD',64,62,0,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO location_lov_master (id,lov_type,code,value,is_active,created_by,created_date,last_modified_by,last_modified_date) values(NEWID(),'LOCATIONTYPE','L1','L1 Owners',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO market_master (market_code,description,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('KA','Karnataka Market',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('KA1','Karnataka Market1',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO region_master (region_code,description,parent_region_code,org_code,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('South','South',NULL,'TJ','{}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO state_master (state_id,description,state_code,country_code,config_details,is_active,created_by,created_date,last_modified_by,last_modified_date,state_tax_code,is_union_territory,src_datasync_id,dest_datasync_id) values(1,'ANDHRA PRADESH','AP','IND',NULL,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0,0,0);

INSERT INTO town_master (town_id,description,state_id,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(1,'KADAPA',1,1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO tax_class_master (tax_class_code,description,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('TC1','Titan Watch',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('TC2','Titan Watch',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO tax_master (tax_code,description,is_active,created_by,created_date,last_modified_by,last_modified_date) values('CGST','Central Goods and Service Tax',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO tax_configs (id,txn_type,src_location_type,dest_location_type,customer_type,is_same_state,src_tax_applicable,applicable_tax,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(1,'Customer Transaction_Cash Memo_New CM','L1',NULL,'NonRegistered',1,1,'SGST/UTGST,CGST',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO state_tax_mapping (id,tax_class_code,state_id,tax_details,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values(NEWID(),'TC1',1,'{"type":"CGST/SGST","data":null}',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO location_master (location_code,description,company_name,address,pincode,phone_no,contact_no,fax,location_email,location_type,registration_no,market_code,country_code,town_id,state_id,region_code,sub_region_code,payment_currencies,master_currency,base_currency,stock_currency,old_factory_code,owner_type,factory_code,cfa_code,brand_code,sub_brand_code,config_details,location_format,is_active,created_by,created_date,last_modified_by,last_modified_date,src_datasync_id,dest_datasync_id) values('ANP','Tanishq-ANANTAPUR','TITAN COMPANY LIMITED','13-3-376RF ROAD, BESIDE HONDA SHOWROOM',515001,'9980XXXXXX','9980XXXXXX','2','ANP@titan.co.in','BTQ','NA','KA','IND',1,1,'South','South','INR','INR','INR','INR',NULL,'L2','ANP','ANP','Tanishq','GoldPlus','{}','MF',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('PLVD','Tanishq-PULIVENDULA','TITAN COMPANY LIMITED','13-3-376RF ROAD, BESIDE HONDA SHOWROOM',515001,'9980XXXXXX','9980XXXXXX','2','ANP@titan.co.in','BTQ','NA','KA','IND',1,1,'South','South','INR','INR','INR','INR',NULL,'L2','ANP','ANP','Tanishq','GoldPlus','{}','MF',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0),('URB','Chennai - Usman Road','TITAN COMPANY LIMITED','46, NORTH USMAN ROADT NAGAR',515001,'9980XXXXXX','9980XXXXXX','2','ANP@titan.co.in','BTQ','NA','KA','IND',1,1,'South','South','INR','INR','INR','INR',NULL,'L2','ANP','ANP','Tanishq','GoldPlus','{}','MF',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),0,0);

INSERT INTO location_price_group_mapping (id,pricing_group_type,price_group,location_code,is_active,created_by,created_date,last_modified_by,last_modified_date) values(NEWID(),'GOLDSTUDDED','Studded','ANP',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO pincode_master(id,pin_code,town_name,state_name,cachement_area,is_active,created_by,created_date,last_modified_by,last_modified_date,country_code,src_datasync_id,dest_datasync_id) values(1,'110001','New Delhi','Delhi','Connaught Place',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),'IND',0,0),(2,'110002','New Delhi','Delhi','Connaught Place',1,'Sivaleela',GETDATE(),'Sivaleela',GETDATE(),NULL,0,0);

INSERT INTO market_material_mapping (id,market_code,material_type_code,markup_factor,add_amount,deduct_amount,created_by,created_date,last_modified_by,last_modified_date) values(NEWID(),'KA','J',2,12,23,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO material_price_config (id,material_type_code,base_price,material_price_type,applicable_date,remarks,created_by,created_date,last_modified_by,last_modified_date) values(1,'J',2000,'D',GETDATE(),'Forced gold rate updated and we have revised the Salem gold rate to 1337','Sivaleela',GETDATE(),'Sivaleela',GETDATE());

INSERT INTO material_price_location_mapping (id,material_price_config_id,material_price,location_code,market_code,markup_factor,material_type_code,applicable_date,add_amount,deduct_amount,created_by,created_date,last_modified_by,last_modified_date) values(NEWID(),1,2000,'ANP','KA',2,'J',GETDATE(),12,10,'Sivaleela',GETDATE(),'Sivaleela',GETDATE());

