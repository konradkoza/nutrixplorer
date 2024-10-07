CREATE DATABASE nutrixplorer;
CREATE USER nutriadmin password 'adminP@ssw0rd';
-- CREATE USER ffadmin password 'ffadminP@ssw0rd';
CREATE USER nutriuser password 'mokP@ssw0rd';
\c nutrixplorer;
GRANT ALL ON SCHEMA public TO nutriAdmin;
-- GRANT ALL ON SCHEMA public TO ffAdmin;