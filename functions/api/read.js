export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    await context.env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    ).run();

    const { results } = await context.env.DB.prepare(
      "SELECT id, content FROM messages ORDER BY id ASC"
    ).all();

    return Response.json(results);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
