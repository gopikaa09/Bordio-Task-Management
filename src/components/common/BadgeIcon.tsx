const BadgeIcon = ({ icon, text }) => {
  return (
    <div className="flex items-center justify-between">
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  )
}
export default BadgeIcon