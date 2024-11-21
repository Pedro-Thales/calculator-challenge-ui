import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from '@mui/icons-material/Delete'

import { Box, IconButton, TextField } from '@mui/material'


function RecordList(props) {
    const navigate = useNavigate();
    const [recordList, setRecordList] = useState([])
    const token = localStorage.getItem('token');

    const [filterText, setFilterText] = useState("")

    const [page, setPage] = useState(0);  // Current page index
    const [rowsPerPage, setRowsPerPage] = useState(5);  // Number of rows per page

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchRecordList()
        fetchUserBalance()
    }, [])

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const fetchUserBalance = () => {
        axiosInstance.get('/calculator/balance')
            .then(function (response) {
                props.setBalance(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    const fetchRecordList = () => {
        axiosInstance.get('/calculator/records')
            .then(function (response) {
                setRecordList(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`/calculator/records/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Record deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchRecordList()
                        fetchUserBalance()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }


    const handleFilterChange = (event) => {
        setFilterText(event.target.value)
        setPage(0)
    }

    const filteredRecords = recordList.filter(record =>
        (record.operationType && record.operationType.toLowerCase().includes(filterText.toLocaleLowerCase())) ||
        (record.operationResponse && record.operationResponse.toLowerCase().includes(filterText.toLocaleLowerCase()))
    );

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change in rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);  // Reset the table to the first page whenever rows per page changes
    };


    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Records List</h2>
                <div className="card">
                    <div className="card-header" style={{ justifyContent: 'space-between', display: 'flex' }} >
                        <Link className="btn btn-outline-primary" to="/create">Create New Record </Link>
                    </div>
                    <div className="card-body">

                        <TableContainer>

                            <Box display="flex" justifyContent="flex-end" >
                                <TextField
                                    label="Search Records"
                                    variant="outlined"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                >
                                </TextField>
                            </Box>
                            <hr></hr>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }} scope="col">#</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} scope="col">Operation Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} scope="col">Response</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} scope="col">Date Added</TableCell>
                                        <TableCell scope="col"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRecords !== null ? filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, index) => (
                                        <TableRow
                                            key={record.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ fontSize: '1.1rem' }} scope="row">{page * rowsPerPage + index + 1}</TableCell>

                                            <TableCell sx={{ fontSize: '1.1rem' }}>{record.operationType}</TableCell>

                                            <TableCell sx={{ fontSize: '1.1rem' }}>{record.operationResponse}</TableCell>
                                            <TableCell sx={{ fontSize: '1.1rem' }}>{new Date(record.date).toLocaleString('en-US')}</TableCell>
                                            <TableCell align='center'>
                                                <IconButton color='secondary' onClick={() => handleDelete(record.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                            <TablePagination sx={{ fontSize: '1.0rem' }}
                                component="div"
                                count={recordList != null ? recordList.length : 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </TableContainer>



                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default RecordList;