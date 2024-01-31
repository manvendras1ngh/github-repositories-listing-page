const userInput = document.querySelector("#username");
const displayMain = document.querySelector(".github");
const displayRepo = document.querySelector(".github__repo");
const profile = document.querySelector(".github__profile");
const paginationElement = document.querySelector(".github__pageNumber");

const apiEndpoint = `https://api.github.com/users`;
let userName = "";
let itemsPerPage = 6;
let currentPage = 1;

const logRepo = async() => {
  try{
    const response = await fetch(`${apiEndpoint}/${userName}/repos?per_page=${itemsPerPage}&page=${currentPage}`);

    if(!response.ok){
      throw new Error(`HTTP Error!, Status: ${response.status}`);
    }

    const data = await response.json();
    //if user has no public repo, can display -->> no public repo to show!.

    displayData(data);
    let totalPages = await getTotalPagesFromHeaders();
    renderPagination(totalPages);

  }catch(error){
    console.error("Error fetching data: ", error);
    // displayMain.innerHTML = "<h3>user not found! try again.</h3>";//will display on any error encountered. find solution.
  };
};

const displayData = (userData) => {
  displayRepo.innerHTML = "";
  profile.innerHTML = "";

  profile.innerHTML = `
  <div class="github__profilepic">
    <img src = ${userData[0].owner.avatar_url} class="github__image"/>
  </div>
  <div class="github__details">
    <h2>${userData[0].owner.login}</h2>
    <a class="github__link" href = ${userData[0].owner.html_url}>Github profile link</a>
  </div>
  `;

  userData.forEach((repo) => {
    const repoElement = document.createElement("div");
    repoElement.className = "github__repos";
    repoElement.innerHTML = `
      <h2>${repo.name}</h2>
      <p class="github__description">${repo.description}</p>
      <a href = ${repo.html_url}>Show Repo on Github</a>
      <p class="github__language">${repo.language}</p>
    `;
    displayRepo.appendChild(repoElement);
  });
};


const renderPagination = (totalPages) =>{
  paginationElement.innerHTML = "";
  
  for(let i = 1; i <= totalPages; i++){
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = i;
    link.href = "#";
    link.addEventListener("click", () => {
      currentPage = i;
      logRepo(currentPage);
    });

    li.appendChild(link);
    paginationElement.appendChild(li);
  };

};

const getTotalPagesFromHeaders = async() => {
  //extract total pages from headers of API response.
  const res = await fetch(`${apiEndpoint}/${userName}/repos?per_page=${itemsPerPage}&page=${currentPage}`);
  const linkHeader = res.headers.get('Link');
  if (!linkHeader) return 1;

  const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
  if (!lastPageMatch) return 1;

  return parseInt(lastPageMatch[1], 10);
};

const handleInput = e => {
  if(e.key === "Enter"){
    userName = e.target.value;
    logRepo();
    e.target.value = "";
  }
};
userInput.addEventListener("keydown", handleInput);

