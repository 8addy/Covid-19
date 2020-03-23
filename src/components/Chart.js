import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const Chart = props => {
  const { values } = props;
  const [data, setData] = useState({
    labels: ['Confirmed', 'Deaths', 'Recovered'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          'rgb(56, 68, 228)',
          'rgb(228, 56, 56)',
          'rgb(56, 228, 56)'
        ]
      }
    ]
  });

  useEffect(() => {
    if (values) {
      setData({
        labels: ['Confirmed', 'Deaths', 'Recovered'],
        datasets: [
          {
            data: [values.confirmed, values.deaths, values.recovered],
            backgroundColor: [
              'rgb(56, 68, 228)',
              'rgb(228, 56, 56)',
              'rgb(56, 228, 56)'
            ]
          }
        ]
      });
    }
  }, [values]);

  return (
    <div>
      <Doughnut
        data={data}
        options={{
          legend: {
            labels: {
              fontColor: props.checked ? '#fff' : '#333',
              fontSize: 17
            }
          }
        }}
      />
    </div>
  );
};

export default Chart;
