import React, {useEffect} from 'react';
import Pagination from '@mui/material/Pagination';
import Typography from "@mui/material/Typography";
import accept from "../../../assets/accept.png";
import wrong from "../../../assets/wrong.png";
import {BootstrapTooltip} from "../../../styles/specificStyles/tooltipStyles";
import {useNavigate} from "react-router-dom";
import {convertDateHour} from "../../../services/utils/util";

function ListTasks({data}) {
    const [paginatedData, setPaginatedData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(5);

    const navigate = useNavigate();

    const handleChange = (event, value) => {
        setPage(value);
    }

    async function handlePagination() {
        const aux = [];
        for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage; i++) {
            if (i < data.length) {
                aux.push(data[i]);
            }
        }
        setPaginatedData(aux);
    }

    useEffect(() => {
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        handlePagination().then(r => r);
    }, [data, page]);

    function viewDetails(task) {
        navigate('/detalhes/' + task.id, {state: {task: task}});
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            {paginatedData.map((task) => {
                return (
                    <BootstrapTooltip
                        title={
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#17202a'
                                }}>
                                Clique para ver os detalhes
                            </Typography>
                        }
                    >
                        <div
                            style={{
                                display: 'flex', width: '100%', backgroundColor: '#212f3e', borderRadius: '10px',
                                minHeight: 70, maxHeight: 70, marginBottom: 15, alignItems: 'center', paddingLeft: 15
                            }}
                            onClick={() => viewDetails(task)}
                        >
                            <Typography sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                color: '#fff',
                                fontSize: 18
                            }}>
                                {task.name}
                            </Typography>

                            <div style={{
                                display: 'flex', textAlign: 'flex-end', marginLeft: 'auto', marginRight: 15,
                            }}>
                                <Typography sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    color: '#fff',
                                    fontSize: 16,
                                    textAlign: 'flex-end',
                                }}>
                                    {convertDateHour(task.date.seconds)}
                                </Typography>
                            </div>
                        </div>
                    </BootstrapTooltip>
                )
            })}

            <br/>
            <Pagination count={totalPages} page={page} onChange={handleChange}/>
        </div>
    );

}

export default ListTasks;