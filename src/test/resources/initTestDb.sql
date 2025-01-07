CREATE DATABASE nutrixplorertest;
CREATE USER nutriadmin password 'adminP@ssw0rd';
CREATE USER nutriuser password 'mokP@ssw0rd';
\c nutrixplorertest;
GRANT ALL ON SCHEMA public TO nutriadmin;
