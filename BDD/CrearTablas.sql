CREATE DATABASE ClinicaUCUSalud;

USE ClinicaUCUSalud;

CREATE TABLE Logins
(
    LogId    INT PRIMARY KEY NOT NULL,
    Password VARCHAR(20)     NOT NULL
);

CREATE TABLE Funcionarios
(
    Ci             INT(8) PRIMARY KEY NOT NULL,
    Nombre         VARCHAR(60)        NOT NULL,
    Apellido       VARCHAR(60)        NOT NULL,
    Fch_Nacimiento DATE               NOT NULL,
    Direccion      VARCHAR(120)       NOT NULL,
    Telefono       INT UNIQUE         NOT NULL,
    Email          VARCHAR(20) UNIQUE NOT NULL,
    LogId          INT UNIQUE         NOT NULL,
    FOREIGN KEY (LogID) REFERENCES Logins (LogId)
);

CREATE TABLE Agenda
(
    Nro        INT PRIMARY KEY NOT NULL,
    Ci         INT(8) UNIQUE   NOT NULL,
    Fch_Agenda DATE            NOT NULL,
    FOREIGN KEY (Ci) REFERENCES Funcionarios (Ci)
);

CREATE TABLE Carnet_Salud
(
    Ci              INT(8) NOT NULL PRIMARY KEY,
    Fch_Emision     DATE   NOT NULL,
    Fch_Vencimiento DATE   NOT NULL,
    Comprobante     BLOB   NOT NULL,
    FOREIGN KEY (Ci) REFERENCES Funcionarios (Ci)
);

CREATE TABLE Periodos_Actualizacion
(
    Año        YEAR        NOT NULL,
    Semestre   ENUM (1, 2) NOT NULL,
    Fch_Inicio DATE        NOT NULL,
    Fch_Fin    DATE        NOT NULL,
    CONSTRAINT PA_PK PRIMARY KEY (Año, Semestre)
);

CREATE TRIGGER VerificarFechaAgenda
    BEFORE INSERT
    ON Agenda
    FOR EACH ROW
BEGIN
    DECLARE vPeriodo INT;
    SELECT COUNT(*)
    INTO vPeriodo
    FROM Periodos_Actualizacion
    WHERE NEW.Fch_Agenda BETWEEN Fch_Inicio AND Fch_Fin;

    IF vPeriodo = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La fecha de agenda no está dentro de un período de actualización válido.';
    END IF;
END;
