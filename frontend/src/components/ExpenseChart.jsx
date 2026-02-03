import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chi tiêu theo danh mục (Tháng này)',
        },
    },
};

export default function ExpenseChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/reports/expenses');
                const labels = data.map(item => item.name);
                const values = data.map(item => item.total);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Chi tiêu (VNĐ)',
                            data: values,
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Failed to fetch chart data');
            }
        };

        fetchData();
    }, []);

    return <Bar options={options} data={chartData} />;
}
