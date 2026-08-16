const OfftakeStatusPage = () => {
    return (
        <div className="p-4">
  <h1 className="text-center text-2xl font-semibold mb-6">
    Department Wise Report against MoHUA Target (01-04-2024 to 31-12-24)
  </h1>

  {[1, 2, 3, 4, 5].map((a) => (
    <div key={a} className="w-full overflow-x-auto mb-8">
      <h3 className="text-lg font-semibold mb-3">Agency {a} Name</h3>

      {/* Main Table */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="border border-black min-w-[70px] p-2">S. No.</th>
            <th className="border border-black min-w-[200px] p-2">
              Government Departments
            </th>
            <th className="border border-black min-w-[200px] p-2">
              Annual Offtake Target 24-25 (MT)
            </th>
            <th className="border border-black min-w-[200px] p-2">
              Offtake Status <span className="block">01-04-2024 to 15-12-24</span> (MT)
            </th>
            <th className="border border-black min-w-[200px] p-2">
              Offtake Status <span className="block">16-12-2024 to 31-12-24</span> (MT)
            </th>
            <th className="border border-black min-w-[200px] p-2">
              Offtake Status <span className="block">01-04-2024 to 31-12-24</span> (MT)
            </th>
            <th className="border border-black min-w-[200px] p-2">% Achieved by Dept.</th>
          </tr>
        </thead>

        <tbody>
          {[...Array(8)].map((_, index) => (
            <tr key={index}>
              <td className="border border-black text-center p-2">{index + 1}</td>
              <td className="border border-black text-left p-2">MCD</td>
              <td className="border border-black text-right p-2">2,20,000</td>
              <td className="border border-black text-right p-2">31,701</td>
              <td className="border border-black text-right p-2">1,331</td>
              <td className="border border-black text-right p-2">33,032</td>
              <td className="border border-black text-right p-2 font-bold">15.01%</td>
            </tr>
          ))}

          <tr className="bg-yellow-300 font-bold">
            <td className="border border-black p-2"></td>
            <td className="border border-black text-left p-2">Total</td>
            <td className="border border-black text-right p-2">{220000 * 8}</td>
            <td className="border border-black text-right p-2">{31701 * 8}</td>
            <td className="border border-black text-right p-2">{1331 * 8}</td>
            <td className="border border-black text-right p-2">{33032 * 8}</td>
            <td className="border border-black text-right p-2">15.01%</td>
          </tr>
        </tbody>
      </table>

      <div className="my-8 border-t border-gray-400"></div>

      <h3 className="text-lg font-semibold mb-3">Plant Wise Data</h3>

      {/* Plant Wise Table */}
      <div className="w-full overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="border border-black min-w-[70px] p-2">S. No.</th>
              <th className="border border-black min-w-[200px] p-2">Government Departments</th>
              {["Shastri Park", "Burari", "RaniKhera", "Mundka"].map((plant) => (
                <React.Fragment key={plant}>
                  <th className="border border-black min-w-[200px] p-2">
                    {plant} <span className="block">01-04-2024 to 15-12-24</span> (MT)
                  </th>
                  <th className="border border-black min-w-[200px] p-2">
                    {plant} <span className="block">16-12-2024 to 31-12-24</span> (MT)
                  </th>
                </React.Fragment>
              ))}
              <th className="border border-black min-w-[200px] p-2">
                Total <span className="block">in MT</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index}>
                <td className="border border-black text-center p-2">{index + 1}</td>
                <td className="border border-black text-left p-2">MCD</td>
                <td className="border border-black text-right p-2">7851.24</td>
                <td className="border border-black text-right p-2">478.32</td>
                <td className="border border-black text-right p-2">12867.21</td>
                <td className="border border-black text-right p-2">396.68</td>
                <td className="border border-black text-right p-2">10304.76</td>
                <td className="border border-black text-right p-2">416.75</td>
                <td className="border border-black text-right p-2">677.41</td>
                <td className="border border-black text-right p-2">39.18</td>
                <td className="border border-black text-right p-2 font-bold">33031.55</td>
              </tr>
            ))}

            <tr className="bg-yellow-300 font-bold">
              <td className="border border-black p-2"></td>
              <td className="border border-black text-left p-2">Total</td>
              <td className="border border-black text-right p-2">{7851.24 * 8}</td>
              <td className="border border-black text-right p-2">{478.32 * 8}</td>
              <td className="border border-black text-right p-2">{12867.21 * 8}</td>
              <td className="border border-black text-right p-2">{396.68 * 8}</td>
              <td className="border border-black text-right p-2">{10304.76 * 8}</td>
              <td className="border border-black text-right p-2">{416.75 * 8}</td>
              <td className="border border-black text-right p-2">{677.41 * 8}</td>
              <td className="border border-black text-right p-2">{39.18 * 8}</td>
              <td className="border border-black text-right p-2">15.01%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ))}
</div>

    )
};


export default OfftakeStatusPage;