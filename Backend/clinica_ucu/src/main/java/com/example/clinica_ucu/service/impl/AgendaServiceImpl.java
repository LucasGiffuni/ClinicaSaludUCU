package com.example.clinica_ucu.service.impl;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.clinica_ucu.ClinicaUcuApplication;
import com.example.clinica_ucu.model.Agenda;
import com.example.clinica_ucu.model.Cupos;
import com.example.clinica_ucu.model.PeriodosActualizacion;
import com.example.clinica_ucu.model.User.DatabaseUser;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.InitCuposResponse;
import com.example.clinica_ucu.model.response.NewAgendaResponse;

@Service
public class AgendaServiceImpl {
    private Connection con;

    @Value("${spring.datasource.connectionString}")
    private String connectionString;
    @Value("${spring.datasource.databaseName}")
    private String databaseName;
    @Value("${spring.datasource.databaseUsername}")
    private String databaseUser;
    @Value("${spring.datasource.databasePassword}")
    private String databasePassword;

    private final Logger logger = LoggerFactory.getLogger(ClinicaUcuApplication.class);

    private void createConection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(
                connectionString + databaseName, databaseUser, databasePassword);
    }

    public NewAgendaResponse crearAgenda(String CI, String Fecha) throws NumberFormatException, SQLException {

        try {
            createConection();
            String sql = " insert into Agenda (Ci, Fch_Agenda)"
                    + " values (?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);

            preparedStmt.setInt(1, Integer.parseInt(CI));
            preparedStmt.setDate(2, Date.valueOf(Fecha));

            preparedStmt.execute();

            sql = "Update Cupos set CitasDisponibles = ((Select CitasDisponibles where Fecha = ?) - 1) where Fecha = ? ";

            PreparedStatement preparedStmt2 = con.prepareStatement(sql);

            preparedStmt2.setDate(1, Date.valueOf(Fecha));
            preparedStmt2.setDate(2, Date.valueOf(Fecha));

            preparedStmt2.execute();

            con.close();
            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            NewAgendaResponse response = new NewAgendaResponse(defaultResponse, "Cita Agendada Correctamente");
            return response;

        } catch (ClassNotFoundException | NumberFormatException | SQLException e) {
            e.printStackTrace();

            String sql = " DELETE FROM Agenda where Fch_Agenda = ?";
            PreparedStatement preparedStmt3 = con.prepareStatement(sql);
            preparedStmt3.setDate(1, Date.valueOf(Fecha));
            preparedStmt3.execute();

            DefaultResponse defaultResponse = new DefaultResponse("400", "ERROR");
            NewAgendaResponse response = new NewAgendaResponse(defaultResponse,
                    "Funcionario ya agendado para esta fecha");

            return response;
        }

    }

    public List<PeriodosActualizacion> obtenerPeriodosDeActualizacion() throws SQLException, ClassNotFoundException {
        createConection();
        List<PeriodosActualizacion> periodos = new ArrayList<>();

        String sql = "select * from Periodos_Actualizacion";
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        ResultSet rs = preparedStmt.executeQuery();
        while (rs.next()) {
            PeriodosActualizacion u = new PeriodosActualizacion();
            u.setYear(Integer.toString(rs.getInt(1)));
            u.setSemestre(rs.getString(2));
            u.setFch_Inicio(rs.getDate(3).toString());
            u.setFch_Fin(rs.getDate(4).toString());

            periodos.add(u);
        }

        return periodos;
    }

    public List<Cupos> obtenerFechasAgenda(String anio, String semestre) throws ClassNotFoundException, SQLException {

        createConection();
        List<Cupos> cupos = new ArrayList<>();

        String sql = "select * from Cupos where Año = ? and Semestre = ?";
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        preparedStmt.setInt(1, Integer.parseInt(anio));
        preparedStmt.setString(2, semestre);

        ResultSet rs = preparedStmt.executeQuery();
        while (rs.next()) {
            Cupos c = new Cupos();
            c.setFecha(rs.getDate(1).toString());
            c.setCitasDisponibles(rs.getInt(2));
            c.setAnio(rs.getInt(3));
            c.setSemestre(rs.getString(4));
            if (c.getCitasDisponibles() > 0) {
                cupos.add(c);
            }

        }

        return cupos;
    }

    public InitCuposResponse inicializarPeriodo(PeriodosActualizacion periodo) {
        try {
            createConection();

            String sql = "insert into Periodos_Actualizacion (Año, Semestre, Fch_Inicio,Fch_Fin) values (?, ?, ?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(periodo.getYear()));
            preparedStmt.setString(2, periodo.getSemestre());
            preparedStmt.setDate(3, Date.valueOf(periodo.getFch_Inicio()));
            preparedStmt.setDate(4, Date.valueOf(periodo.getFch_Fin()));
            preparedStmt.execute();
            con.close();

            prepareCupos(periodo);

            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "Periodo y cupos inicializados correctamente");
            return response;

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            DefaultResponse defaultResponse = new DefaultResponse("400", "ERROR");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "El periodo ingresado ya existe");
            return response;
        }

    }

    private void prepareCupos(PeriodosActualizacion periodo) throws ClassNotFoundException, SQLException {

        LocalDate initialDate = LocalDate.of(Integer.parseInt(periodo.getFch_Inicio().split("-")[0]),
                Integer.parseInt(periodo.getFch_Inicio().split("-")[1]),
                Integer.parseInt(periodo.getFch_Inicio().split("-")[2]));
        LocalDate finalDate = LocalDate.of(Integer.parseInt(periodo.getFch_Fin().split("-")[0]),
                Integer.parseInt(periodo.getFch_Fin().split("-")[1]),
                Integer.parseInt(periodo.getFch_Fin().split("-")[2]));
        ZoneId defaultZoneId = ZoneId.systemDefault();

        List<LocalDate> dates = initialDate.datesUntil(finalDate).toList();
        for (LocalDate localDate : dates) {
            createConection();
            String sql = "insert into Cupos (Fecha, CitasDisponibles,Año, Semestre) values (?, ?, ?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setDate(1, Date.valueOf(localDate));
            preparedStmt.setInt(2, 5);
            preparedStmt.setInt(3, Integer.parseInt(periodo.getYear()));
            preparedStmt.setString(4, periodo.getSemestre());
            preparedStmt.execute();
            con.close();
        }

    }

    public InitCuposResponse eliminarPeriodo(String anio, String semestre, String fecha_inicio, String fecha_fin) {
        try {
            createConection();

            String sql = "DELETE FROM Periodos_Actualizacion WHERE Año = ? and Semestre = ? and Fch_Inicio = ? and Fch_Fin = ?";
            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(anio));
            preparedStmt.setString(2, semestre);
            preparedStmt.setDate(3, Date.valueOf(fecha_inicio));
            preparedStmt.setDate(4, Date.valueOf(fecha_fin));
            preparedStmt.execute();
            con.close();

            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "Periodo y cupos eliminado correctamente");
            return response;

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            DefaultResponse defaultResponse = new DefaultResponse("400", "ERROR");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "Error");
            return response;
        }
    }

}
