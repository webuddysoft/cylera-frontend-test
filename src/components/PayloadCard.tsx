import { useState, useMemo, useCallback } from "react";
import { Mission, MissionDetail, Payload } from "../libs/mission";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export interface PayloadCardProps {
  missions: MissionDetail[]
}

const DIR_ASC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
  </svg>;
const DIR_DESC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
<path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
</svg>;


const PayloadCard: React.FC<PayloadCardProps> = ({missions}: PayloadCardProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [nationality, setNationality] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  const handleSort = useCallback((o: string) => {
    if (o !== orderBy) {
      setOrderBy(o);
      setOrderDir('asc');
    } else if (orderDir === 'asc') {
      setOrderDir('desc');
    } else {
      setOrderDir('asc');
      setOrderBy(null);
    }
    
  }, [orderBy, orderDir]);

  const nationalities: string[] = useMemo((): string[] => {
    return missions.reduce((p: string[], c: MissionDetail): string[] => {
      const tN: (string | null)[] = c.payloads.map((p: Payload | null) => p !== null ? p.nationality : null);
      tN.forEach((s: string | null) => {
        if (s !== null && !p.includes(s)) {
          p.push(s);
        }
      })
      return p;
    }, []);

  }, [missions]);
  
  const missionsFiltered: Mission[] = useMemo((): Mission[] => {
    let rows = missions.map((m: MissionDetail): Mission => ({
      name: m.name,
      color: `#${m.id.substring(0, 6)}`,
      total: m.payloads.reduce((p: number, c: Payload | null): number => {
        if (c !== null && c.payload_mass_kg !== null && (nationality === null || nationality === c.nationality)) {
          return p + c.payload_mass_kg;
        }
        return p;
      }, 0)
    })).filter((m: Mission) => m.total > 0);
    if (orderBy !== null) {
      rows = rows.sort((a: Mission, b: Mission): number => {
        if (orderBy === 'mission') {
          return a.name.localeCompare(b.name) * (orderDir === 'asc' ? 1 : -1);
        } else {
          return (a.total - b.total) * (orderDir === 'asc' ? 1 : -1);
        }
      })
    }
    return rows;
  }, [missions, nationality, orderBy, orderDir]);


  const chartData = useMemo(() => ({
    labels: missionsFiltered.map((m: Mission) => m.name),
    datasets: [
      {
        label: 'Total Mass',
        data: missionsFiltered.map((m: Mission) => m.total),
        backgroundColor: missionsFiltered.map(m => m.color)
      }
    ]
  }), [missionsFiltered]);

  return (
    <div className="shadow-card w-[550px] mx-auto mt-10 font-card rounded-lg">
      <div className="bg-white flex px-6 py-[7px] justify-between items-center mb-[5px] rounded-t-lg">
        <h3 className="text-xl font-bold">Total Payload Per Mission</h3>
        <div className="relative w-[150px]">
          <button 
            className={`transition ease-in-out duration-200 text-light-blue inline-flex items-center w-full justify-between px-5 py-2.5 gap-2 rounded-md shadow-dropdown bg-white hover:ring-1 hover:ring-black hover:ring-opacity-5 hover:shadow-md ${showDropdown ? 'ring-1 ring-black ring-opacity-5 shadow-md' : ''}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="text-sm">{nationality === null ? 'All Nations' : nationality}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 20" className="w-3 h-3" strokeWidth={5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div className={`${showDropdown ? "h-auto" : "h-0 hidden"} z-[100] absolute top-full right-0 w-full ring-1 ring-black ring-opacity-5 mt-2 bg-white shadow-md text-sm rounded-md overflow-hidden`}>
            <SimpleBar style={{maxHeight: '60vh'}} forceVisible="y" autoHide={false}>
              <div className={`transition ease-in-out duration-100 divide-y divide-gray-100`}>
                <a href="#" key={`m0`} className={`transition ease-in-out duration-100 text-light-blue block px-4 py-2 text-sm hover:bg-gray-100 ${nationality === null ? 'bg-gray-100' : ''}`} onClick={() => [setNationality(null), setShowDropdown(false)]}>All Nations</a>
              {
                nationalities.sort().map((n: string, i: number) => (
                  <a href="#" key={`m${i}`} className={`transition ease-in-out duration-100 text-light-blue block px-4 py-2 text-sm hover:bg-gray-100 ${nationality == n ? 'bg-gray-100' : ''}`} onClick={() => [setNationality(n), setShowDropdown(false)]}>{n}</a>
                ))
              }
              </div>
            </SimpleBar>
          </div>
        </div>
      </div>
      <div className="bg-white px-5 py-6 rounded-b-lg flex">
        <div id="chartdiv" className="w-[215px] px-9 items-center flex">
          <Doughnut data={chartData} 
            options={{
              cutout: 63,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} 
          />
        </div>
        <div className="max-h-[280px] w-full chart-table">
          <SimpleBar style={{maxHeight: '280px'}} forceVisible="y" autoHide={false}>
            <table className="w-full">
              <thead className="text-[#374151] text-xs font-bold">
                <tr className="border-spacing-x-3">
                  <th className="py-4 text-left w-[140px] sticky bg-white top-0" onClick={() => handleSort('mission')}>
                    <span className="flex items-center cursor-pointer">
                      MISSION
                      {orderBy === 'mission' ? orderDir === 'asc' ? <DIR_ASC /> : <DIR_DESC /> : null}
                    </span>
                  </th>
                  <th className="sticky bg-white top-0" onClick={() => handleSort('mass')}>
                    <span className="flex items-center cursor-pointer whitespace-nowrap">
                      TOTAL PAYLOAD MASS
                      {orderBy === 'mass' ? orderDir === 'asc' ? <DIR_ASC /> : <DIR_DESC /> : null}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  missionsFiltered.map((m: Mission, i: number) => (
                  <tr key={`trow${i}`} className="border-b-2 border-gray-100 last:border-b-0">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full w-1.5 h-1.5 block`} style={{backgroundColor: m.color}}></span>
                        <span className="truncate w-[90px] text-[#1c1f37] text-[14px]">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[#1c1f37]/50 text-[14px]">
                      {new Intl.NumberFormat().format(m.total)} KG
                    </td>
                  </tr>
                  ))
                }
                
              </tbody>
            </table>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};

export default PayloadCard;
