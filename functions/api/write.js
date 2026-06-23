// Cloudflare Pages Function: 写入消息到 D1
export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { message } = await context.request.json();
    if (!message || typeof message !== "string") {
      return new Response("Missing or invalid message", { status: 400 });
    }

    // 确保表存在
    await context.env.DB.exec(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL
      )`
    );

    const { success, meta } = await context.env.DB.prepare(
      "INSERT INTO messages (content) VALUES (?)"
    )
      .bind(message)
      .run();

    if (!success) {
      throw new Error("Insert failed");
    }

    return new Response(
      JSON.stringify({ id: meta.last_row_id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
