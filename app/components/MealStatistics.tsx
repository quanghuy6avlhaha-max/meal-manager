"use client";

type UserStatistic = {
  name: string;
  username: string;
  sang: number;
  trua: number;
  toi: number;
};

type Props = {
  data: UserStatistic[];
  month: string;
};

export default function MealStatistics({
  data,
  month,
}: Props) {

  const totalSang =
    data.reduce(
      (sum, item) => sum + item.sang,
      0
    );

  const totalTrua =
    data.reduce(
      (sum, item) => sum + item.trua,
      0
    );

  const totalToi =
    data.reduce(
      (sum, item) => sum + item.toi,
      0
    );

  return (
    <div className="mt-10">

      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Thống kê tháng {month}
      </h2>

      <div className="mb-6 rounded-xl border border-[#F5E8BF] bg-[#FFFDF7] p-4">

        <h3 className="mb-3 font-bold text-gray-800">
          Tổng cả đội
        </h3>

        <div>
          Sáng: {totalSang} suất
        </div>

        <div>
          Trưa: {totalTrua} suất
        </div>

        <div>
          Tối: {totalToi} suất
        </div>

      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-[#F2D77A] text-gray-800">

            <tr>

              <th className="p-3 text-left">
                Họ tên
              </th>

              <th className="p-3">
                Sáng
              </th>

              <th className="p-3">
                Trưa
              </th>

              <th className="p-3">
                Tối
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((user) => (

              <tr
                key={user.username}
                className="border-b"
              >

                <td className="p-3">
                  {user.name}
                </td>

                <td className="p-3 text-center">
                  {user.sang}
                </td>

                <td className="p-3 text-center">
                  {user.trua}
                </td>

                <td className="p-3 text-center">
                  {user.toi}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}