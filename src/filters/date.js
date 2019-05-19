export default (value) => {
  let date
  if (typeof value === "string") {
    date = new Date(value)
  } else if (typeof value === "object") {
    date = value
  } else {
    return value
  }

  return date.toLocaleString(['en-US'], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}