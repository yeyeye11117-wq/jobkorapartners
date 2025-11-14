/* ===============================
 *  Recruit List (All / Corporate / Region)
 * =============================== */
const API_URL = "https://api.ninehire.com/api/v1/jobs";
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.NmUyMDc3MzAtYzcyYS0xMWVmLThhYTEtNDE2OGMyNTljNzZh.H01lsBQ8F7KKo-rdewD4ePkZqqgegNcjNhjuAiaxfx8"; // 실제 발급받은 키
const PER_PAGE = 10;

document.addEventListener("DOMContentLoaded", () => {
  const recruitList = document.getElementById("recruitList");
  const keywordBtn = document.getElementById("keywordSearchBtn");
  const pagination = document.getElementById("pagination");
  const pageType = document.body.dataset.pageType || ""; // "", "corporate", "region"
  let currentPage = 1;

  /* ---------- 렌더링 ---------- */
  function renderJobs(jobs) {
    if (!jobs || !jobs.length) {
      recruitList.innerHTML = "<p>현재 진행 중인 공고가 없습니다.</p>";
      pagination.innerHTML = "";
      return;
    }

    recruitList.innerHTML = jobs.map((job) => {
      const deadlineText = job.deadline
        ? new Date(job.deadline).toLocaleDateString("ko-KR")
        : "상시채용";
      return `
        <div class="recruit_item">
          <div class="info">
            <h3><a href="${job.applyUrl}" target="_blank" rel="noopener">${job.title}</a></h3>
            <p>${job.affiliation || ""} | ${job.jobGroup || ""} / ${job.jobTask || ""}</p>
          </div>
          <div class="deadline">${deadlineText}</div>
        </div>
      `;
    }).join("");
  }

  function renderPagination(totalCount, pageNow) {
    const totalPages = Math.ceil(totalCount / PER_PAGE);
    if (totalPages <= 1) { pagination.innerHTML = ""; return; }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === pageNow ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    pagination.innerHTML = html;

    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = parseInt(btn.dataset.page, 10);
        doSearch(currentPage);
      });
    });
  }

  /* ---------- API 호출 ---------- */
  async function fetchJobs(query = "", page = 1) {
    recruitList.innerHTML = "<p>불러오는 중...</p>";

    try {
      const res = await fetch(`${API_URL}?countPerPage=${PER_PAGE}&page=${page}${query}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("API 오류");

      const data = await res.json();
      let results = data.results || [];

      // 대기업 페이지 필터
      if (pageType === "corporate") {
        results = results.filter(
          (job) => job.tags?.includes("대기업") || job.affiliation?.includes("대기업")
        );
      }

      // 지역 페이지 필터 (URL에서 매번 region 재계산)
      if (pageType === "region") {
        const regionRaw = new URLSearchParams(window.location.search).get("region") || "";
        if (regionRaw) {
          const norm = (s) => (s || "").replace(/\s/g, "").toLowerCase();
          const region = norm(regionRaw);
          results = results.filter((job) =>
            (job.jobLocations || []).some((loc) => {
              const text = norm((loc.name || "") + (loc.address || ""));
              return text.includes(region);
            })
          );
        }
      }

      renderJobs(results);

      // 주의: data.count는 API 전체 기준일 수 있습니다.
      // 지역/대기업 필터 후 페이지 수를 정확히 맞추려면 results.length 사용을 권장합니다.
      renderPagination(results.length, page);
    } catch (e) {
      console.error(e);
      recruitList.innerHTML = `<p>데이터를 불러올 수 없습니다.</p>`;
      pagination.innerHTML = "";
    }
  }

  /* ---------- 검색/필터 ---------- */
  function doSearch(page = 1) {
    const employmentType = document.querySelector("#employmentType .select_trigger")?.dataset.value || "";
    const career        = document.querySelector("#career .select_trigger")?.dataset.value || "";
    const jobGroup      = document.querySelector("#jobGroup .select_trigger")?.dataset.value || "";
    const keyword       = document.querySelector("#keyword")?.value || "";

    let query = "";
    if (employmentType) query += `&employmentType=${employmentType}`;
    if (career)         query += `&career=${career}`;
    if (jobGroup)       query += `&jobGroup=${jobGroup}`;
    if (keyword)        query += `&title=${encodeURIComponent(keyword)}`;

    fetchJobs(query, page);
  }

  /* ---------- 커스텀 셀렉트 ---------- */
  document.querySelectorAll(".custom_select").forEach((select) => {
    const trigger = select.querySelector(".select_trigger");
    const options = select.querySelector(".select_options");

    if (!trigger || !options) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".custom_select.active").forEach((open) => {
        if (open !== select) open.classList.remove("active");
      });
      select.classList.toggle("active");
    });

    options.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        trigger.innerHTML = `${option.textContent} <img src="../public/images/icon_arrow_down.svg" alt="arrow">`;
        trigger.dataset.value = option.dataset.value;
        select.classList.remove("active");
        currentPage = 1;
        doSearch(currentPage);
      });
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".custom_select.active").forEach((s) => s.classList.remove("active"));
  });

  // 키워드 검색 버튼
  document.getElementById("keywordSearchBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = 1;
    doSearch(currentPage);
  });

  /* ---------- 지역 탭(전체 포함) ---------- */
  function updateActiveTab(region) {
    document.querySelectorAll(".region_tab").forEach((tab) => {
      const tabRegion = (tab.getAttribute("href") || "").split("=")[1] || "";
      tab.classList.toggle("active", tabRegion === region);
    });
  }

  document.querySelectorAll(".region_tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const href = tab.getAttribute("href") || "";
      const region = href.includes("=") ? href.split("=")[1] : "";

      // URL 갱신
      history.pushState(null, "", `?region=${encodeURIComponent(region)}`);

      // 활성 탭 동기화 + 첫 페이지부터 재조회
      updateActiveTab(region);
      currentPage = 1;
      doSearch(currentPage);
    });
  });

  // 최초 진입 시 탭 상태 동기화
  updateActiveTab(new URLSearchParams(window.location.search).get("region") || "");

  /* ---------- 초기 실행 ---------- */
  doSearch(currentPage);
});
