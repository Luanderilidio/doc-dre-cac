export default function ChartProgress() {
  const data = [
    {
      escola: "escola 1",
      enviou: true,
    },
    {
      escola: "escola 2",
      enviou: true,
    },
    {
      escola: "escola 3",
      enviou: false,
    },
    {
      escola: "escola 5",
      enviou: false,
    },
  ];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="h-24 flex items-center justify-center gap-[6px]">
        {data.map((item) => (
          <div className=" flex relative">
            <div className={`${item.enviou ? 'bg-green-500 font-bold  ' : 'bg-red-500' } text-white w-24 h-14 flex items-center justify-center `}>
              {item.escola.substring(0, 12)}
            </div>
            <div className=" absolute -bottom-3 -right-1 h-20 border-r-2 border-gray-300 border-dashed" />
          </div>
        ))}
      </div>
    </div>
  );
}
