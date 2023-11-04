USE ClinicaUCUSalud;

CREATE EVENT VerificarFormularios
    ON SCHEDULE EVERY 1 DAY -- Programar para ejecutarse diariamente
        STARTS CURRENT_TIMESTAMP + INTERVAL 1 MINUTE -- Comenzar desde el momento actual
    DO
    BEGIN
        SELECT *
        INTO OUTFILE 'BDD/sin_carnet.txt'
            FIELDS TERMINATED BY '\t' -- Otra opción de separador
            LINES TERMINATED BY '\n'
        FROM Funcionarios F
        WHERE F.Ci NOT IN (SELECT C.Ci FROM Carnet_Salud C);
    END;

SHOW EVENTS;