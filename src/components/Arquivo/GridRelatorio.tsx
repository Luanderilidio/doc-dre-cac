import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import moment from 'moment/min/moment-with-locales';
import "moment/locale/pt-br";
import { Container } from '@mui/material';
import StatusChip from '../StatusChip';
import { useEffect, useMemo, useState } from 'react';

interface DocumentoResumo {
    id: string;
    tipoDocumento: string;
    total: number;
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'finished':
            return 'Finalizados';
        case 'denied':
            return 'Negados';
        case 'in_service':
            return 'Em atendimento';
        case 'pending':
            return 'Pendente';
        case 'delivery':
            return 'Liberado';
        case 'no_service':
            return 'Sem Atendimento';
        default:
            return status;
    }
};

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 30 },
    {
        field: 'nomeCompleto', headerName: 'Nome Completo', width: 180, renderCell: (params) => (
            <div className='text-wrap !text-left  font-boldwhitespace-normal break-words leading-snug py-2 uppercase'>
                {params.value}
            </div>
        )
    },
    { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 150 },
    { field: 'via', headerName: 'Via', width: 60 },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => {
            const dataFormatada = moment(params.row.timestamp).format(
                'DD/MM/YYYY'
            );

            return (
                <div className="flex flex-col items-center justify-center gap-1 text-center py-1">
                    <p className='font-bold capitalize text-xs'>

                        {getStatusLabel(params.value)}
                    </p>
                    <span className="text-xs text-gray-500">
                        {dataFormatada}
                    </span>
                </div>
            );
        },
    },
    {
        field: 'funcionario',
        headerName: 'Funcionario',
        sortable: false,
        width: 100,
    },
    {
        field: 'motivo',
        headerName: 'Observação',
        sortable: false,
        width: 470,
        renderCell: (params) => (
            <div className='text-wrap !text-left  font-boldwhitespace-normal text-xs  break-words leading-none py-2'>
                {params.value}
            </div>
        )
    },
];

const columnsResumo: GridColDef[] = [
    { field: 'tipoDocumento', headerName: 'Tipo de Documento', flex: 1 },
    { field: 'total', headerName: 'Total', width: 100 },
];

const columnsSolicitacao: GridColDef[] = [
    {
        field: 'statusSolicitacao',
        headerName: 'Status Solicitação',
        flex: 1,
        renderCell: (params) => {
            // 👉 linha TOTAL
            if (params.row.id === 'total') {
                return <strong>TOTAL</strong>
            }

            switch (params.value) {
                case 'finished':
                    return 'Finalizados'
                case 'denied':
                    return 'Negados'
                case 'in_service':
                    return 'Em atendimento'
                case 'pending':
                    return 'Pendentes'
                case 'delivery':
                    return 'Liberados'
                case 'no_service':
                    return 'Sem Atendimento'
                default:
                    return params.value
            }
        },
    },
    {
        field: 'total',
        headerName: 'Total',
        width: 100,
        renderCell: (params) =>
            params.row.id === 'total'
                ? <strong>{params.value}</strong>
                : params.value,
    },
]

export default function GridRelatorio({ data }: any) {

    console.log("GridRelatorio", data)

    const resumoDocumentos = Object.values(
        data.reduce((acc: any, item: any) => {
            const tipo = item.tipoDocumento || 'Não informado';

            if (!acc[tipo]) {
                acc[tipo] = {
                    id: tipo,
                    tipoDocumento: tipo,
                    total: 0,
                };
            }

            acc[tipo].total += 1;
            return acc;
        }, {})
    );

    const resumoSolicitacao = Object.values(
        data.reduce((acc: any, item: any) => {
            const status = item.status;

            if (!acc[status]) {
                acc[status] = {
                    id: status,
                    statusSolicitacao: status,
                    total: 0,
                };
            }

            acc[status].total += 1;
            return acc;
        }, {})
    );

    const totalGeralSolicitacao = resumoSolicitacao.reduce(
        (acc: number, item: any) => acc + item.total,
        0
    );

    const resumoTotalSolicitacao = [
        ...resumoSolicitacao,
        {
            id: 'total',
            statusSolicitacao: 'TOTAL',
            total: totalGeralSolicitacao,
        },
    ];
    return (
        <div className='!h-fit overflow-y-auto py-5'>

            <Container>

                <h1 className='w-full text-2xl font-bold text-center py-5'>RELATÓRIO DOS ATENDIMENTOS</h1>
                <Paper
                    elevation={0}
                    className="p-2 border border-gray-200 rounded-lg"
                >

                    <DataGrid
                        rows={data}
                        columns={columns}
                        // initialState={{ pagination: { paginationModel } }}
                        getRowHeight={() => 'auto'}
                        autoHeight
                        hideFooter
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: '#f9fafb',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#e5e7eb',
                            },
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                justifyContent: 'left',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                textAlign: 'center',
                                width: '100%',
                            },
                        }}
                    />
                </Paper>
                <h1 className='w-full text-2xl font-bold text-center py-5'>QUANTIDADE POR TIPO DE DOCUMENTO</h1>
                <div className='grid grid-cols-2 gap-5'>
                    <Paper
                        elevation={0}
                        className="p-2 border border-gray-200 rounded-lg"
                    >

                        <DataGrid
                            rows={resumoDocumentos}
                            columns={columnsResumo}
                            autoHeight
                            density="compact"
                            hideFooter
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: '#f9fafb',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#e5e7eb',
                                },
                            }}
                        />
                    </Paper>
                    <Paper
                        elevation={0}
                        className="p-2 border border-gray-200 rounded-lg"
                    >
                        <DataGrid
                            rows={resumoTotalSolicitacao}
                            columns={columnsSolicitacao}
                            autoHeight
                            density="compact"
                            hideFooter
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: '#f9fafb',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#e5e7eb',
                                },
                            }}
                        />
                    </Paper>
                </div>
            </Container>
        </div>
    );
}
