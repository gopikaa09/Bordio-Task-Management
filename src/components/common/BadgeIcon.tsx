const BadgeIcon = ({ icon, text }) => {
  return (
    <div className="flex items-center justify-between gap-1 border bg-white border-black rounded-3xl px-2 py-0.5 text-xs">
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  )
}
export default BadgeIcon