CREATE DATABASE nutrixplorer;
CREATE USER nutriAdmin password 'adminP@ssw0rd';
CREATE USER nutriUser password 'mokP@ssw0rd';
\c nutrixplorer;
GRANT ALL ON SCHEMA public TO nutriAdmin;