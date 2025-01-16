import React from "react";
import "../styles/OfftakeStatusPage.css";

const OfftakeStatusPage = () => {
  return (
    <div className="offtakeStatusPage">
      <h1>
        Department Wise Report against MoHUA Target (01-04-2024 to 31-12-24)
      </h1>

      {[1, 2, 3, 4, 5].map((a) => {
        return (
          <div className="TableCont">
            <h3>Agency {a} Name</h3>
            <table>
              <thead>
                <th>S. No.</th>
                <th>Government Departments</th>
                <th>Annual Offtake Target 24-25 (MT)</th>
                <th>
                  Offtake Status <span>01-04-2024 to 15-12-24</span> (MT)
                </th>
                <th>
                  Offtake Status <span>16-12-2024 to 31-12-24</span> (MT)
                </th>
                <th>
                  Offtake Status <span>01-04-2024 to 31-12-24</span> (MT)
                </th>
                <th>% Achieved by Dept.</th>
              </thead>

              <tbody>
                {[1, 1, 1, 1, 1, 1, 1, 1].map((m, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>MCD</td>
                      <td>2,20,000</td>
                      <td>31,701</td>
                      <td>1,331</td>
                      <td>33,032</td>
                      <td>
                        <strong>15.01%</strong>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td></td>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{220000 * 8}</strong>
                  </td>
                  <td>
                    <strong>{31701 * 8}</strong>
                  </td>
                  <td>
                    <strong>{1331 * 8}</strong>
                  </td>
                  <td>
                    <strong>{33032 * 8}</strong>
                  </td>
                  <td>
                    <strong>15.01%</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <br />
            <hr />
            <br />

            <h3>Plant Wise Data</h3>

            <div className="TableCont">
              <table>
                <thead>
                  <th>S. No.</th>
                  <th>Government Departments</th>
                  <th>
                    Shastri Park <span>01-04-2024 to 15-12-24</span> (MT)
                  </th>
                  <th>
                    Shastri Park <span>16-12-2024 to 31-12-24</span> (MT)
                  </th>

                  <th>
                    Burari <span>01-04-2024 to 15-12-24</span> (MT)
                  </th>
                  <th>
                    Burari <span>16-12-2024 to 31-12-24</span> (MT)
                  </th>
                  <th>
                    RaniKhera <span>01-04-2024 to 15-12-24</span> (MT)
                  </th>
                  <th>
                    RaniKhera <span>16-12-2024 to 31-12-24</span> (MT)
                  </th>
                  <th>
                    Mundka <span>01-04-2024 to 15-12-24</span> (MT)
                  </th>
                  <th>
                    Mundka <span>16-12-2024 to 31-12-24</span> (MT)
                  </th>
                  <th>
                    Total <span>in MT</span> (MT)
                  </th>
                </thead>

                <tbody>
                  {[1, 1, 1, 1, 1, 1, 1, 1].map((m, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>MCD</td>
                        <td>7851.24</td>
                        <td>478.32</td>
                        <td>12867.21</td>
                        <td>396.68</td>
                        <td>10304.76</td>
                        <td>416.75</td>
                        <td>677.41</td>
                        <td>39.18</td>
                        <td>
                          <strong>33031.55</strong>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td></td>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{7851.24 * 8}</strong>
                    </td>
                    <td>
                      <strong>{478.32 * 8}</strong>
                    </td>
                    <td>
                      <strong>{12867.21 * 8}</strong>
                    </td>
                    <td>
                      <strong>{396.68 * 8}</strong>
                    </td>
                    <td>
                      <strong>{10304.76 * 8}</strong>
                    </td>
                    <td>
                      <strong>{416.75 * 8}</strong>
                    </td>
                    <td>
                      <strong>{677.41 * 8}</strong>
                    </td>
                    <td>
                      <strong>{39.18 * 8}</strong>
                    </td>
                    <td>
                      <strong>15.01%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OfftakeStatusPage;
