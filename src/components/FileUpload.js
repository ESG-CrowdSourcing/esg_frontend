import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserService from "../services/user.service";
import XLSX from "xlsx";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import readXlsxFile from "read-excel-file";
import $ from 'jquery';
import Table from 'react-bootstrap/Table'

import axios from 'axios'
import ReactTable from "react-table"; 
import 'react-table/react-table.css'


const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

// Data Exchange Portal


class FileUpload extends React.Component {

  
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null],
      data: [],
      cols: [],
      selectedFile: null,
      selectedCompany: "",
      companies: [],
      companyData: {}
    };  
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCompanyData = this.getCompanyData.bind(this);

    // this.getAllCompanies()
  }

  componentDidMount() {
    debugger
    fetch("http://858cb1e5b0d9.ngrok.io/getAllCompany", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        debugger
        console.log("Success:", data);
        this.setState({
          companies: data.data
        })
        // alert(data.message)
      })
      .catch((error) => {
        debugger
        console.error("Error:", error);
        alert(error.message)
      });
  }

  handleChange(e) {
    debugger
    this.setState({
      selectedFile: e.target.files,
    });
  }

  sendData(e) {
    debugger
    e.preventDefault();
    var input = document.getElementById('file');
    const data = new FormData();
    console.log(this.state.selectedFile);
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x]);
    }
    console.log(data);
    debugger
    fetch("http://858cb1e5b0d9.ngrok.io/taxonomy ", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        debugger
        console.log("Success:", data);
        alert(data.message)
      })
      .catch((error) => {
        debugger
        console.error("Error:", error);
        alert(error.message)
      });

  }
  getCompanyData(e){
    debugger
    if(e.target.value == "Select Company"){
      alert("Please Select companies to view data")
    }else{

      this.setState({
        selectedCompany: e.target.value
       })
       
       const { companyName } = {
        companyName : e.target.value
      }
    
       let url = `http://858cb1e5b0d9.ngrok.io/getNewData/${companyName}`;
   
       fetch(url, {
         method: "GET"
       })
         .then((response) => response.json())
         .then((data) => {
           debugger
           console.log("Success:", data.data);
         
   
           this.setState({
             companyData : data
           })
          //  alert(data.message)
         })
         .catch((error) => {
           debugger
           console.error("Error:", error);
           alert(error.message)
         });

    }
   

  }




  render() {

    const columns = [{  
      Header: 'Year',  
      accessor: 'Year',
     }
     ,{  
      Header: 'DPCode',  
      accessor: 'DPCode' ,
      }
     
     ,{  
     Header: 'Response',  
     accessor: 'Response' ,
     }
     ,{  
     Header: 'unit',  
     accessor: 'unit',
     }
  ]

   
    return (
      <div className="container">
        <header className="jumbotron">
          <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "12px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600"
            }}
          >
            Upload File
          </Card.Title>
          <div>
            <Row>
              <Col sm={12}>
                <Form.File
                  id="formcheck-api-regular"
                  style={{ width: "459px", height: "83px", fontSize: "12px" }}>
                  <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} style={{ top: "322px", left: "406px", width: "459px", 
                  background: "#F0F1F4 0% 0% no-repeat padding-box",border: "1px solid #D4D4D428", borderRadius: "4px", opacity: " 1", height: "auto", }} multiple />
                </Form.File> 
              </Col>
            </Row>
            <Row>
              <Col sm={7}> </Col>
              <Col sm={5}>
                <button className="btn btn-default">Cancel</button>
                <button className="btn btn-primary" onClick={this.sendData}>
                  Submit
                </button>
              </Col>
            </Row> 
          </div>
        </header>
        <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
          <Col sm={8}>
             <h5 style={{color: "#155F9B"}}>Data Exchange Portal</h5>
             <label>Company Name : {this.state.companyData.companyName }</label>
          </Col>
          <Col sm={4}>

            <h6 style={{  height: "22px", textAlign: "left", fontSize: "12px", letterSpacing: "0px", fontWeight: "600", marginBottom: "0px !important" }}>
              Select Company
            </h6>
            <select  onChange={this.getCompanyData} className="select">
              <option>Select Company</option>
              {this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>

          </Col>
        </Row>
        <Row> 
          <Col sm={12} className="table-col jumbotron" style={{padding: '0px !important'}}>
              <ReactTable data={this.state.companyData.fiscalYear} columns={columns}  style={{ border: '0px solid rgba(0,0,0,0.1)'}}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileUpload;