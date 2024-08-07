import { useAppSelector } from "@/store";

const BadgeIcon = ({ icon, text }) => {
  const { view } = useAppSelector((state) => state.indexPage?.data['tasklist'])
  console.log(view);
  return (
    <div className={`flex items-center justify-between gap-1 ${view !== 'table' ? 'border bg-white border-black rounded-3xl' : ''} px-2 py-0.5 text-xs`}>
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  )
}
export default BadgeIcon