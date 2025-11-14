document.getElementById("consultForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const formData = Object.fromEntries(new FormData(this));

  try {
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("상담 신청이 정상적으로 접수되었습니다.");
      this.reset();
    } else {
      alert("전송 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  } catch (err) {
    console.error(err);
    alert("네트워크 오류가 발생했습니다.");
  }
});