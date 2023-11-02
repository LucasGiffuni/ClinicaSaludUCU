package com.example.clinica_ucu.service.impl;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.clinica_ucu.model.Agenda;
import com.example.clinica_ucu.model.PeriodosActualizacion;
import com.example.clinica_ucu.model.response.DefaultResponse;

@Service
public class AgendaServiceImpl {
    private Connection con;

    private void createConection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");
    }

    public DefaultResponse crearAgenda(Agenda agenda) {
        try {
            createConection();
            String sql = " insert into Agenda (Ci, Fch_Agenda)"
                    + " values (?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(agenda.getCi()));
            preparedStmt.setDate(2, Date.valueOf(agenda.getFch_Agenda()));

            preparedStmt.execute();

            DefaultResponse response = new DefaultResponse();
            response.setDefaultResponse("200", "Cita Agendada Correctamente");

            con.close();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }
        DefaultResponse response = new DefaultResponse();
        response.setDefaultResponse("400", "Error");
        return response;
    }

    public List<PeriodosActualizacion> obtenerPeriodosDeActualizacion() throws SQLException, ClassNotFoundException {
        createConection();
        List<PeriodosActualizacion> periodos = new ArrayList<>();

        String sql = "select * from Periodos_Actualizacion";
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        ResultSet rs = preparedStmt.executeQuery();
        while (rs.next()) {
            PeriodosActualizacion u = new PeriodosActualizacion(rs.getInt(1), rs.getString(2), rs.getDate(3),
                    rs.getDate(4));
            periodos.add(u);
        }

        return periodos;
    }

}
