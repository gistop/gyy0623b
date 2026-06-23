const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("感谢咨询，我们会尽快联系你。");
  });
}

// D1 交互逻辑
const d1Input = document.getElementById("d1-input");
const writeBtn = document.getElementById("write-btn");
const readBtn = document.getElementById("read-btn");

if (writeBtn && readBtn && d1Input) {
  writeBtn.addEventListener("click", async () => {
    const message = d1Input.value.trim();
    if (!message) {
      alert("请输入要写入的信息。");
      return;
    }
    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`写入失败: ${res.status}`);
      const data = await res.json();
      alert(`写入成功！ID: ${data.id}`);
      d1Input.value = "";
    } catch (err) {
      alert(`错误: ${err.message}`);
    }
  });

  readBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/read");
      if (!res.ok) throw new Error(`读取失败: ${res.status}`);
      const data = await res.json();
      if (data.length === 0) {
        alert("数据库中没有信息。");
      } else {
        alert(
          data
            .map((row) => `ID: ${row.id}, 内容: ${row.content}`)
            .join("\n")
        );
      }
    } catch (err) {
      alert(`错误: ${err.message}`);
    }
  });
}
