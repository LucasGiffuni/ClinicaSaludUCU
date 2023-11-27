CREATE DATABASE ClinicaUCUSalud;

USE ClinicaUCUSalud;

CREATE TABLE Logins
(
    LogId    INT PRIMARY KEY NOT NULL,
    Password VARCHAR(50)     NOT NULL
);

CREATE TABLE Funcionarios
(
    Ci             INT(8) PRIMARY KEY NOT NULL,
    Nombre         VARCHAR(60)        NOT NULL,
    Apellido       VARCHAR(60)        NOT NULL,
    Fch_Nacimiento DATE               NOT NULL,
    Direccion      VARCHAR(120)       NOT NULL,
    Telefono       INT UNIQUE         NOT NULL,
    Email          VARCHAR(50) UNIQUE NOT NULL,
    LogId          INT UNIQUE         NOT NULL,
    FOREIGN KEY (LogID) REFERENCES Logins (LogId)
);

CREATE TABLE Agenda
(
    Nro        INT PRIMARY KEY NOT NULL AUTOINCREMENT,
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
    Semestre   ENUM ('1', '2'),
    Fch_Inicio DATE        NOT NULL,
    Fch_Fin    DATE        NOT NULL,
    CONSTRAINT PA_PK PRIMARY KEY (Año, Semestre)
);



CREATE TABLE Cupos
(
    Fecha DATE PRIMARY KEY NOT NULL,
    CitasDisponibles INT(5)           NOT NULL
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
    ELSE
        UPDATE Cupos C1 SET CitasDisponibles = (SELECT CitasDisponibles FROM Cupos C2 WHERE C1.Fecha = C2.Fecha) - 1
        WHERE C1.Fecha = NEW.Fch_Agenda;
    END IF;
END;

CREATE TRIGGER InsertarCuposPorDia
    AFTER INSERT
    ON Periodos_Actualizacion
    FOR EACH ROW
BEGIN
    DECLARE currentDate DATE;
    SET currentDate = NEW.Fch_Inicio;

    WHILE currentDate <= NEW.Fch_Fin
        DO
            INSERT INTO Cupos (Fecha, CitasDisponibles)
            VALUES (currentDate, 5);
            SET currentDate = DATE_ADD(currentDate, INTERVAL 1 DAY);
        END WHILE;
END;
