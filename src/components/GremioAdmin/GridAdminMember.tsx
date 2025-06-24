import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Button,
    Dialog,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField, Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { faker } from "@faker-js/faker";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "react-hooks-shareable";
import PersonIcon from "@mui/icons-material/Person";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import { ToastContainer, toast } from 'react-toastify';

import {
    MemberView,
    MemberViewSchema,
} from "./SchemaGremioAdmin";
import { z } from "zod";
 
export default function GridAdminMember({
    members,
}: {
    members: z.infer<typeof MemberViewSchema>[];
}) {


    const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;


    console.log(import.meta.env.VITE_BACK_END_API_DRE);
    const [isViewAdd, openViewAdd, closeViewAdd] = useBoolean(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<MemberView[]>(members);


    const handleDataDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/members-gremio/${id}`);
            setRows((prev) => prev.filter((row) => row.id !== id)); 
            toast.success("Estudante desvinculado com Sucesso!");
        } catch (error) {
            console.error("Erro ao deletar estudante:", error);
        } finally {
            setLoading(false);
        }
    };

    // Atualizar estudante
    // const handleDataUpdate = async (newRow: Student, oldRow: Student) => {
    //     try {
    //         await axios.patch(`${apiUrl}/students/${newRow.id}`, newRow);
    //         setRows((prev) =>
    //             prev.map((row) => (row.id === newRow.id ? newRow : row))
    //         );
    //         return newRow;
    //     } catch (error) {
    //         console.error("Erro ao atualizar estudante:", error);
    //         throw error;
    //     }
    // };

    // Cadastrar novo estudante
    // const handleDataPost = async (data: StudentCreate) => {
    //     console.log(data);
    //     setLoading(true);
    //     try {
    //         const response = await axios.post<Student>(`${apiUrl}/students`, data);
    //         setRows((prev) => [...prev, response.data]);
    //         setStatusCode(response.status);

    //         // reset();
    //         console.log("POST ESTUDANTE", response.data);
    //     } catch (error) {
    //         console.error("Erro ao cadastrar estudante:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const columns: GridColDef<MemberView>[] = [
        {
            field: "id", headerName: "ID", width: 40, renderCell: (params) => {
                console.log("params", params.row)
                return <>
                    {params.row.id}
                </>
            }
        },
        {
            field: "url_profile",
            headerName: "Foto",
            width: 70, 
            renderCell: (params) => (
                <img className="rounded-full w-12" src={params.row.student.url_profile} alt="" />
            ),
        },
        {
            field: "name", headerName: "Nome", width: 150, editable: true, renderCell: (params) => {
                console.log("params", params.row.student.name)
                return <>
                    {params.row.student.name}
                </>
            }
        },
        {
            field: "role",
            headerName: "Cargo",
            width: 100, 
            renderCell: (params) => (
                <>
                    {params.row.role}
                </>
            )
        },
        {
            field: "status",
            headerName: "Status",
            width: 100, 
            renderCell: (params) => (params.row.status ? "Ativo" : "Inativo"),
        },
        {
            field: "actions",
            headerName: "Ações",
            width: 130,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                // console.log("params.row", params.row);
                return (
                    <div>
                        <Tooltip title="Desvincular">

                            <IconButton
                                onClick={() => handleDataDelete(params.row.id)}
                                color="error"
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div> 
            <div className="w-full !h-96">

                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={50}
                    getRowId={(row) => row.id}
                    loading={loading}
                    editMode="row"
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                />
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" // ou "light" | "dark"
            />
        </div>
    );
}
