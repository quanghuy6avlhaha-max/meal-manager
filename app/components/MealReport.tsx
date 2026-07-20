"use client";

type MealItem = {
  name: string;
  username: string;
  sang?: boolean;
  trua?: boolean;
  toi?: boolean;
};

type Props = {
  data: MealItem[];
};

export default function MealReport({
  data,
}: Props) {
  const sang = data.filter(
    (item) => item.sang
  );

  const trua = data.filter(
    (item) => item.trua
  );

  const toi = data.filter(
    (item) => item.toi
  );

  function renderLine(
    title: string,
    list: MealItem[]
  ) {
    if (list.length === 0) {
      return `${title}: 0 suất`;
    }

    return `${title}: ${list.length} suất - ${list
      .map((item) => item.name)
      .join(", ")}`;
  }

  async function copyReport() {
    const text = [
      renderLine("Sáng", sang),
      renderLine("Trưa", trua),
      renderLine("Tối", toi),
    ].join("\n");

    await navigator.clipboard.writeText(text);

    alert("Đã copy báo cáo.");
  }

  function renderList(
    title: string,
    list: MealItem[]
  ) {
    return (
      <div className="border rounded-xl p-4 mb-4">
        <h3 className="font-bold mb-2">
          {title} ({list.length})
        </h3>

        {list.length === 0 ? (
          <div className="text-gray-500">
            Không có người báo
          </div>
        ) : (
          <div className="space-y-1">
            {list.map((item) => (
              <div
                key={item.username}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>


      {renderList(
        "Sáng",
        sang
      )}

      {renderList(
        "Trưa",
        trua
      )}

      {renderList(
        "Tối",
        toi
      )}
    </div>
  );
}