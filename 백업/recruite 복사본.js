const API_URL = "https://api.ninehire.com/api/v1/jobs";
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.NmUyMDc3MzAtYzcyYS0xMWVmLThhYTEtNDE2OGMyNTljNzZh.H01lsBQ8F7KKo-rdewD4ePkZqqgegNcjNhjuAiaxfx8"; // 실제 발급받은 키 입력

document.addEventListener("DOMContentLoaded", () => {
  const recruitList = document.getElementById("recruitList");
  const keywordBtn = document.getElementById("keywordSearchBtn");
  const perPage = 10;
  let currentPage = 1;

  /** 채용공고 렌더링 */
  function renderJobs(jobs) {
    if (!jobs.length) {
      recruitList.innerHTML = "<p>현재 진행 중인 공고가 없습니다.</p>";
      return;
    }
    recruitList.innerHTML = jobs
      .map(
        (job) => `
      <div class="recruit_item">
        <div class="info">
          <h3><a href="${job.applyUrl}" target="_blank">${job.title}</a></h3>
          <p>${job.affiliation || ""} | ${job.jobGroup || ""} / ${
          job.jobTask || ""
        }</p>
        </div>
        <div class="deadline">${
          job.deadline
            ? new Date(job.deadline).toLocaleDateString("ko-KR")
            : "상시채용"
        }</div>
      </div>
    `
      )
      .join("");
  }

  /**  페이지네이션 렌더링 */
  function renderPagination(totalCount, currentPage) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalCount / perPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let buttons = "";
    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }

    pagination.innerHTML = buttons;

    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = parseInt(btn.dataset.page);
        doSearch(currentPage);
      });
    });
  }

  /**  API 요청 */
  async function fetchJobs(query = "", page = 1) {
    recruitList.innerHTML = "<p>불러오는 중...</p>";

    try {
      const res = await fetch(
        `${API_URL}?countPerPage=${perPage}&page=${page}${query}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("API 오류");
      const data = await res.json();

      renderJobs(data.results);
      renderPagination(data.count, page);
    } catch (e) {
      recruitList.innerHTML = `<p>데이터를 불러올 수 없습니다.</p>`;
    }
  }

  /** 검색 실행 */
  function doSearch(page = 1) {
    const employmentType =
      document.querySelector("#employmentType .select_trigger").dataset.value ||
      "";
    const career =
      document.querySelector("#career .select_trigger").dataset.value || "";
    const jobGroup =
      document.querySelector("#jobGroup .select_trigger").dataset.value || "";
    const keyword = document.querySelector("#keyword").value || "";

    let query = "";
    if (employmentType) query += `&employmentType=${employmentType}`;
    if (career) query += `&career=${career}`;
    if (jobGroup) query += `&jobGroup=${jobGroup}`;
    if (keyword) query += `&title=${encodeURIComponent(keyword)}`;

    fetchJobs(query, page);
  }

  /** 드롭다운 제어 */
  document.querySelectorAll(".custom_select").forEach((select) => {
    const trigger = select.querySelector(".select_trigger");
    const options = select.querySelector(".select_options");

    // 열기/닫기
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".custom_select.active").forEach((open) => {
        if (open !== select) open.classList.remove("active");
      });
      select.classList.toggle("active");
    });

    // 옵션 선택 → 검색 실행
    options.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        trigger.innerHTML =
          option.textContent +
          ' <img src="../public/images/icon_arrow_down.svg" alt="arrow">';
        trigger.dataset.value = option.dataset.value;
        select.classList.remove("active");

        doSearch(); // ✅ 선택 즉시 검색 실행
      });
    });
  });

  // 돋보기 버튼 클릭 → 검색 실행
  keywordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    doSearch();
  });

  // 다른 곳 클릭 시 드롭다운 닫기
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".custom_select.active")
      .forEach((s) => s.classList.remove("active"));
  });

  // 최초 실행
  doSearch();
});
