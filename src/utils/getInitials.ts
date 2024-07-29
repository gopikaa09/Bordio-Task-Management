export function getInitials(name) {
  const words = name?.split(' ')
  if (words?.length === 1) {
    return words[0].substring(0, 1).toUpperCase()
  }
  return '' // Handle the case where name is empty
}