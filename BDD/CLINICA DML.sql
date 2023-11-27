CREATE DATABASE ClinicaUCUSalud;

USE ClinicaUCUSalud;

CREATE TABLE Logins
(
    LogId    varchar(20) PRIMARY KEY NOT NULL,
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
    LogId          varchar(20) UNIQUE         NOT NULL,
    FOREIGN KEY (LogID) REFERENCES Logins (LogId)
);

CREATE TABLE Agenda
(
    Nro        INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Ci         INT(8) UNIQUE   NOT NULL,
    Fch_Agenda DATE            NOT NULL,
    FOREIGN KEY (Ci) REFERENCES Funcionarios (Ci)
);

CREATE TABLE Carnet_Salud
(
    Ci              INT(8) NOT NULL PRIMARY KEY,
    Fch_Emision     DATE   NOT NULL,
    Fch_Vencimiento DATE   NOT NULL,
    Comprobante     MEDIUMBLOB,
    FOREIGN KEY (Ci) REFERENCES Funcionarios (Ci)
);

CREATE TABLE Periodos_Actualizacion
(
    Año        INT(4)        NOT NULL,
    Semestre   ENUM ('1', '2'),
    Fch_Inicio DATE        NOT NULL,
    Fch_Fin    DATE        NOT NULL,
    CONSTRAINT PA_PK PRIMARY KEY (Año, Semestre)
);

CREATE TABLE Cupos
(
    Fecha DATE NOT NULL,
    CitasDisponibles INT(5)  NOT NULL,
    Año INT(4) NOT NULL,
    Semestre  ENUM ('1', '2') NOT NULL,
    FOREIGN KEY (Año,Semestre) REFERENCES Periodos_Actualizacion (Año,Semestre),
     PRIMARY KEY (Fecha,Año, Semestre)
);

INSERT INTO Periodos_Actualizacion (Año, Semestre, Fch_Inicio, Fch_Fin)
VALUES
  (2023, '1', '2023-11-01', '2023-11-15');

INSERT INTO Logins (LogId, Password)
VALUES
  ('juanperez', 'contraseña123'),
  ('mariagomez', 'segura456'),
  ('analopez', 'clave789'),
  ('pedroramirez', 'secretaABC'),
  ('lauramartinez', 'mipass123'),
  ('carlosgarcia', 'miclave456'),
  ('sofiadiaz', 'contrasenaXYZ');

INSERT INTO Funcionarios (Ci, Nombre, Apellido, Fch_Nacimiento, Direccion, Telefono, Email, LogId)
VALUES
  (11112222, 'Ana', 'López', '1988-07-10', 'Calle Sur 789', 012, 'ana@example.com', 'analopez'),
  (33334444, 'Pedro', 'Ramírez', '1995-03-25', 'Avenida Norte 567', 023, 'pedro@example.com', 'pedroramirez'),
  (55556666, 'Laura', 'Martínez', '1980-11-02', 'Calle Este 234', 034, 'laura@example.com', 'lauramartinez'),
  (77778888, 'Carlos', 'García', '1992-09-18', 'Avenida Oeste 890', 045, 'carlos@example.com', 'carlosgarcia'),
  (99990000, 'Sofía', 'Díaz', '1987-12-07', 'Calle Central 456', 056, 'sofia@example.com', 'sofiadiaz');
