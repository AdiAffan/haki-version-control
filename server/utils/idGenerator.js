function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

module.exports = generateId;