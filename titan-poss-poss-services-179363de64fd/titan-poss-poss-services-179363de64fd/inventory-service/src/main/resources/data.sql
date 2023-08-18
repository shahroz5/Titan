use test_inventory
truncate table stock_request_details
truncate table stock_request
truncate table stock_invoice_details
delete stock_invoice
truncate table stock_transaction_details
delete stock_transaction
truncate table stock_transfer_details
delete  stock_transfer
truncate table inventory_details
truncate table bin_request

DBCC CHECKIDENT (stock_invoice, RESEED, 1);
DBCC CHECKIDENT (stock_transfer, RESEED, 1);
DBCC CHECKIDENT (stock_transaction, RESEED, 1);




insert into inventory_details(id,location_code,item_code,lot_number,serial_number,mfg_date,total_quantity,total_weight,total_value,
std_weight,std_value,bin_group_code,bin_code,product_group,product_category,weight_unit,currency_code,created_by,created_date,last_modified_by,
last_modified_date,bin_modified_date,org_code)
values (NEWID(),'URB','500A37FAALA503','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','71','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500A37FAAMA501','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'EXHIBITION','EXHIBITION','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500A37FAAMA503','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','FINGER RING','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500A37FAAMA504','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'PURCFA','FINGER RING','71','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500A37FAANA501','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'STN','BEST DEAL','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500A37FAANA503','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'STN','BEST DEAL','71','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','11GOPYM008','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'STN','BEST DEAL','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500A37HAAAB302','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'STN','BEST DEAL','71','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500A37HAAAB304','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'STN','BEST DEAL','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','5905761LA0B649','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'URB','500002FCAMAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'EXHIBITION','EXHIBITION','85','Z','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500002FCAMAA03','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'LOSS','LOSS','85','Z','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'URB','500005FDAGAS02','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500005FDAGAX02','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500005FDAHAS04','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500005FDAHAS09','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500005FDAIAA01','1BA000001','10','2019-09-09 14:27:44.707','2','20.000','2000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500005FDAIAA02','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500005FDAIAA09','1BA000001','10','2019-09-09 14:27:44.707','2','20.000','2000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'URB','500005FDAIAA09','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'LOAN','LOAN','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','5905761LA0B649','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'LOSS','LOSS','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500002FCAMAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'EXHIBITION','EXHIBITION','85','Z','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),


(NEWID(),'BGR','500005FDAIAS04','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500005FDAJAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500002FBBNAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'STN','BEST DEAL','78','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'URB','513515PIJAAA00','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'PURCFA','ZEROBIN','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','514115POWAAA00','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'PURCFA','ZEROBIN','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','21DIROAT0250','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'TEP','TEP','72','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','500005FDAJAA02','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'TEP','TEP','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'URB','21DIRMST0350','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'GEP','GEP','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PAT','500002FBDMAA04','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'PURCFA','ZEROBIN','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PAT','500002FCALAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'PURCFA','ZEROBIN','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','11GOPYM008','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'TEP','TEP','72','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','21DIRMST0260','1BA000001','10','2019-09-09 14:27:44.707','1','10.000','1000','10','1000',
'TEP','TEP','71','P','gms','INR','L1User','2020-02-16 00:00:00.000','L3User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','21DIRMST0400','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'GEP','GEP','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PNA','500004DAAAAA00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'PURCFA','DROP EARRING','71','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','500004DAAABA00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'PURCFA','DROP EARRING','71','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PNA','500015DMAABX00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','71','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','500033DAAAAA00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','71','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PNA','500002DAAABA01','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','500002DAAABA02','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','72','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PNA','500002DABAAA04','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'GEP','GEP','72','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','500002DBAAAA01','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'GEP','GEP','72','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'PNA','510107ZCAAZP00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','73','Z','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'PNA','510112ZHAAZP00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','73','Z','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'BGR','500033DAAAAA00','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','71','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500002DAAABA01','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'TEP','TEP','72','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500002DAAABA02','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'COIN','COIN','72','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),
(NEWID(),'BGR','500002DABAAA04','1BA000001','10','2019-09-09 14:27:44.707','1','10','1000','10','1000',
'GEP','GEP','72','D','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'),

(NEWID(),'URB','5905760KA0B678','1BA000001','100.20','2019-09-09 14:27:44.707','5','501','6173949.50','82.17','1234789.900',
'STN','BEST DEAL','88','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ');

insert into inventory_details(id,location_code,item_code,lot_number,serial_number,mfg_date,total_quantity,total_weight,total_value,
std_weight,std_value,bin_group_code,bin_code,product_group,product_category,weight_unit,currency_code,created_by,created_date,last_modified_by,
last_modified_date,bin_modified_date,org_code)
values (NEWID(),'URB','509132VA154110','1BA000001','5.124','2019-09-09 14:27:44.707','5','25.620','6173949.500','5.124','1234789.900',
'STN','BEST DEAL','71','OTHERS','gms','INR','L1User','2020-02-16 00:00:00.000','L1User','2020-02-16 00:00:00.000','2020-02-16 00:00:00.000','TJ'); 


insert into stock_request(request_type,req_doc_no,req_fiscal_year,req_location_code,req_doc_date,src_location_code,dest_location_code,total_requested_quantity,total_requested_weight,total_requested_value,request_remarks,status,org_code,weight_unit,currency_code,created_by,created_date,last_modified_by,last_modified_date) values
('BTQ',1,2020,'ABO','2020-03-04 12:11:30.702','BGR','ABO',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('FAC',2,2020,'FHJR','2020-03-04 12:11:30.702','BGR','FHJR',1,100,1000,'testing','APPROVED','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('MER',3,2020,'FHJR','2020-03-04 12:11:30.702','BGR','ABO',1,100,1000,'testing','APPROVED','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('LOAN',4,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('LOSS',5,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('FOC',6,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('ADJ',7,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('PSV',8,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('EXH',9,2020,'URB','2020-03-04 12:11:30.702','URB','URB',1,100,1000,'testing','APVL_PENDING','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('BTQ',10,2020,'ABO','2020-03-04 12:11:30.702','BGR','ABO',1,100,1000,'testing','ISSUED','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702'),
('MER',11,2020,'ABO','2020-03-04 12:11:30.702','BGR','ABO',1,100,1000,'testing','ISSUED','TJ','gms','INR','bos.urb','2020-03-04 12:11:30.702','bos.urb','2020-03-04 12:11:30.702');

insert into stock_request_details(id,stock_request_id,item_code,lot_number,mfg_date,requested_quantity,requested_value,requested_weight,std_value,std_weight,bin_group_code,bin_code,product_group,inventory_id,product_category,weight_unit,currency_code,status,created_by,created_date,last_modified_by,last_modified_date) values 
(NEWID(),1,'500005FDAIAA01','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500005FDAIAA01')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),2,'500005FDAIAA01','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500005FDAIAA01')),'OTHERS','gms','INR','APPROVED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),3,'500005FDAIAA09','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500005FDAIAA09' and location_code='urb')),'OTHERS','gms','INR','APPROVED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),4,'5905761LA0B649','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '5905761LA0B649' and serial_number='10' and location_code='urb')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),5,'500A37FAANA501','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500A37FAANA501' and location_code='urb')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),6,'500A37FAALA503','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500A37FAALA503')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),7,'500A37HAAAB302','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500A37HAAAB302')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),8,'500A37FAAMA504','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500A37FAAMA504')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),9,'500002FCAMAA01','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500002FCAMAA01' and location_code='urb')),'OTHERS','gms','INR','APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),

(NEWID(),10,'500005FDAIAA01','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500005FDAIAA01')),'OTHERS','gms','INR','ISSUED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987'),
(NEWID(),11,'500005FDAIAA01','1BA000001','2020-03-04 13:48:23.987',1,1000,10,1000,10,'STN','FINGER RING','72',CONVERT(uniqueidentifier,(select id from inventory_details where item_code = '500005FDAIAA01')),'OTHERS','gms','INR','CNCL_APVL_APPROVED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987');

insert into stock_transfer(transfer_type,src_location_code,src_fiscal_year,src_doc_no,src_doc_date,
total_issued_quantity,total_issued_value,total_issued_weight,issued_remarks,issued_by,
dest_location_code, stock_request_id,order_type,weight_unit,currency_code,status,prints,
org_code,created_by,created_date,last_modified_by,last_modified_date,total_received_quantity,total_received_value,total_received_weight) values 
('BTQ_BTQ','ABO',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('MER_BTQ','ABO',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('TEP_PLAIN','ABO',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('TEP_STUDDED','ABO',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('LOAN','BGR',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('EXH','BGR',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','BGR',10,'R','gms','INR',
'ISSUED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('BTQ_BTQ','BGR',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','ABO',10,'R','gms','INR',
'CNCL_APVL_APPROVED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10),
('MER_BTQ','BGR',2020,1212,'2020-03-09 16:14:46.849',1,1000,10,'testing','bos.urb','ABO',10,'R','gms','INR',
'CNCL_APVL_APPROVED',0,'TJ','bos.urb','2020-03-09 16:14:46.849','bos.urb','2020-03-09 16:14:46.849',1,1000,10);


update stock_transfer set carrier_details='{"type":"courier","data":{"courierCompany":"Bluedart","courierDocketNumber":"afasdfAD","courierLockNumber":"SDFSADFSDAF","courierRoadPermitNumber":"SDFASFDSADAS"}}' 
where id in (4,5,11)

insert into stock_transfer_details (id,stock_transfer_id,item_code,lot_number,mfg_date,issued_quantity,issued_weight,
issued_value,std_value,std_weight,bin_group_code,bin_code,product_group,product_category,order_type,reference_no,inventory_id,
weight_unit,currency_code,status,created_by,created_date,last_modified_by,last_modified_date,received_quantity,received_value,received_weight) values 
(NEWID(),2,'500005FDAIAA01','1BA000001','2020-01-1 00:00:00.000',1,10,1000,1000,10,'STN','FINGER RING',72,'D','R',122121,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500005FDAIAA01')),
'gms','INR','ISSUED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987',0,0,0),
(NEWID(),3,'500005FDAIAA01','1BA000001','2020-01-1 00:00:00.000',1,10,1000,1000,10,'STN','FINGER RING',72,'D','R',122121,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500005FDAIAA01')),
'gms','INR','ISSUED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987',0,0,0),
(NEWID(),4,'500005FDAIAA01','1BA000001','2020-01-1 00:00:00.000',1,10,1000,1000,10,'STN','FINGER RING',72,'D','R',122121,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500005FDAIAA01')),
'gms','INR','ISSUED','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987',0,0,0),
(NEWID(),8,'500005FDAIAA01','1BA000001','2020-01-1 00:00:00.000',1,10,1000,1000,10,'STN','FINGER RING',72,'D','R',122121,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500005FDAIAA01')),
'gms','INR','CNCL_APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987',0,0,0),
(NEWID(),9,'500005FDAIAA01','1BA000001','2020-01-1 00:00:00.000',1,10,1000,1000,10,'STN','FINGER RING',72,'D','R',122121,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500005FDAIAA01')),
'gms','INR','CNCL_APVL_PENDING','bos.urb','2020-03-04 13:48:23.987','bos.urb','2020-03-04 13:48:23.987',0,0,0);

insert into stock_invoice (invoice_type,src_location_code,src_doc_no,src_fiscal_year,src_doc_date,total_issued_quantity,total_issued_weight,total_issued_value,dest_location_code,total_received_quantity,total_received_value, total_received_weight,status,weight_unit,currency_code,prints,org_code,created_by,created_date,last_modified_by,last_modified_date) values 
('CFA_BTQ','LDH',1,2020,'2020-01-1 00:00:00.000',2,20,2000,'PNA',2,2000,20,'ISSUED','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
('BTQ_CFA','PNA',2,2020,'2020-01-1 00:00:00.000',1,10,1000,null,1,1000,10,'OPEN','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
('TEP_PLAIN','PNA',3,2020,'2020-01-1 00:00:00.000',1,10,1000,null,1,1000,10,'OPEN','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
('TEP_STUDDED','PNA',4,2020,'2020-01-1 00:00:00.000',1,10,1000,null,1,1000,10,'OPEN','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
('GEP','PNA',5,2020,'2020-01-1 00:00:00.000',1,10,1000,null,1,1000,10,'OPEN','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
('COIN','PNA',6,2020,'2020-01-1 00:00:00.000',1,10,1000,null,1,1000,10,'OPEN','gms','INR',0,'TJ','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000');


insert into stock_invoice_details (id,stock_invoice_id,item_code,lot_number,issued_quantity,issued_weight,issued_value,std_value,std_weight,bin_group_code,bin_code,product_group,product_category,order_type,received_quantity,received_weight,received_value,reference_no,inventory_id,weight_unit,currency_code,status,created_by,created_date,last_modified_by,last_modified_date) values 
(NEWID(),2,'513515PIJAAA00','1BA000001',1,10,1000,1000,10,'PURCFA','ZEROBIN','71','P','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='513515PIJAAA00')),'gms','INR','ISSUED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),2,'514115POWAAA00','1BA000001',1,10,1000,1000,10,'PURCFA','ZEROBIN','71','P','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='514115POWAAA00')),'gms','INR','ISSUED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),3,'500004DAAAAA00','1BA000001',1,10,1000,1000,10,'PURCFA','DROP EARRING','71','P','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500004DAAAAA00' and location_code = 'PNA')),'gms','INR','SELECTED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),4,'500015DMAABX00','1BA000001',1,10,1000,1000,10,'TEP','TEP','71','D','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500015DMAABX00' and location_code = 'PNA')),'gms','INR','SELECTED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),5,'500002DAAABA01','1BA000001',1,10,1000,1000,10,'TEP','TEP','72','D','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500002DAAABA01' and location_code = 'PNA')),'gms','INR','SELECTED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),6,'500002DABAAA04','1BA000001',1,10,1000,1000,10,'GEP','GEP','72','D','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='500002DABAAA04' and location_code = 'PNA')),'gms','INR','SELECTED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000'),
(NEWID(),7,'510107ZCAAZP00','1BA000001',1,10,1000,1000,10,'COIN','COIN','72','D','R',1,10,1000,1234567,CONVERT(uniqueidentifier,(select id from inventory_details where item_code='510107ZCAAZP00' and location_code = 'PNA')),'gms','INR','SELECTED','mandeep','2020-01-01 00:00:00.000','mandeep','2020-01-01 00:00:00.000');

insert into bin_request (req_doc_date, req_doc_no,req_fiscal_year,req_location_code,bin_name,bin_group_code,request_remarks,status,created_by,created_date,last_modified_by,last_modified_date) values 
('2020-03-05 12:57:34.348',1,2020,'URB','Sapire','STN','Testing','APPROVED','bos.urb','2020-03-05 12:57:34.348','bos.urb','2020-03-05 12:57:34.348'),
('2020-03-05 12:57:34.348',2,2020,'URB','Sapire1','STN','Testing','APVL_PENDING','bos.urb','2020-03-05 12:57:34.348','bos.urb','2020-03-05 12:57:34.348'),
('2020-03-05 12:57:34.348',3,2020,'URB','Sapire2','STN','Testing','APVL_PENDING','bos.urb','2020-03-05 12:57:34.348','bos.urb','2020-03-05 12:57:34.348'),
('2020-03-05 12:57:34.348',4,2020,'URB','Sapire3','STN','Testing','APVL_PENDING','bos.urb','2020-03-05 12:57:34.348','bos.urb','2020-03-05 12:57:34.348');

update stock_request_details set accepted_quantity=1
update stock_request set total_accepted_quantity=1
update stock_request_details set accepted_quantity=1,approved_quantity=1
where stock_request_id in (2,3)
update stock_request set total_accepted_quantity=1,total_approved_quantity=1 where id in (2,3)
update inventory_details set bin_code = 'ZEROBIN' where item_code = '509132VA154110'



