const harperFetch = (body) =>
  fetch(process.env.HARPER_DB_URL, {
    method: 'POST',
    body: JSON.stringify({ ...body, database: 'cache_and_ratelimit', table: 'all' }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + process.env.HARPER_AUTH_TOKEN,
    },
  })

export const insert = async (records = []) => {
  const t = await harperFetch({
    records,
    operation: 'insert',
  })
  if (!t.ok) return {}
  return await t.json()
}

export const update = async (records = []) => {
  await harperFetch({
    records,
    operation: 'update',
  })
}

export const deleteRecords = async (ids = []) => {
  await harperFetch({
    ids,
    operation: 'delete',
  })
}

export const searchByValue = async (search_value, search_attribute = 'id', get_attributes = ['*']) => {
  const t = await harperFetch({
    search_value,
    get_attributes,
    search_attribute,
    operation: 'search_by_value',
  })
  if (!t.ok) return []
  return await t.json()
}
