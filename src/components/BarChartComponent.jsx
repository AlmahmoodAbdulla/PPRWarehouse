import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from "recharts";

export default function BarChartComponent(props) {
  const [data, setData] = useState([]);
  const groupedData = {};
  useEffect(() => {
    props.data.forEach((row) =>{
      if(groupedData[row.pharmacy_id]){
        groupedData[row.pharmacy_id].violation += row.violation;
      }else {
        groupedData[row.pharmacy_id] = {
          pharmacy_id: row.pharmacy_id,
          pharmacy_name: row.pharmacy_name,
          violation: row.violation
        };
      }
    })
    const result = Object.values(groupedData);
    setData(result);
  }, [props]);
  return (
<ResponsiveContainer width='100%' aspect={4.0 / 3.0}  height={props.data.length * (20 + 5)}>
                        <BarChart data={data} layout="vertical">
                            <XAxis type="number" />
                            <YAxis dataKey="pharmacy_name" type="category" tickMargin={1}  fontSize={10}/>
                            <Tooltip wrapperStyle={{ width: 'auto', backgroundColor: '#ccc' }}/>
                            <Legend />
                            <Bar legendType="star" barGap={5} barSize={20} dataKey="violation" fill="#73ac41" />

                        </BarChart>
                    </ResponsiveContainer>
  );
}
