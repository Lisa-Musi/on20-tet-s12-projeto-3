const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');
const darkModeCheckbox = document.querySelector('.dark-mode-checkbox > input');

button.addEventListener('click', (event) => {
  event.preventDefault();
  const username = input.value.trim();
  username ? getGitHubUser(username) : alert('Digite uma usuária válida!');
  input.value = '';
});

const getGitHubUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    if (response.status == 404) {
      renderUserNotFound();
    } else if (response.status == 200) {
      createCard(userData);
    }
  }
  catch (err) {
    console.error('Capturei um erro: ', err);
  }
};

const createCard = ({ avatar_url, name, login, bio, followers, public_repos, html_url }) => {
  main.innerHTML = `
    <div class='card'>
      <a href='${html_url}' target='_blank'>
        <img class='profile-img' src=${avatar_url} alt='foto da usuária no github'>
        <h2 class='profile-title'>${name}</h2>
        <h4 class='profile-subtitle'>${login}</h4> 
      </a>
      <p class='profile-description'>${bio ? bio : ''}</p>
      <div class='profile-infos'>
        <div class='info-box'>
          <img src='../assets/people_outline.png' class='box-icon'>
          <p class='box-text'>${followers}</p>
        </div>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='../assets/Vector.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `;
  const linkRepositories = document.querySelector('.link-repositories');

  const clickLink = (event) => {
    event.preventDefault();
    getRepositories(login);
    linkRepositories.removeEventListener('click', clickLink);
  };

  linkRepositories.addEventListener('click', clickLink);
};

const getRepositories = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repositories = await response.json();
    if (repositories.length > 0) {
      createRepositoriesCards(repositories);
    } else {
      renderNotFoundRepositories(username);
    }
  }
  catch (err) {
    console.error('Capturei um erro: ', err);
  }
};

const createRepositoriesCards = (repositories) => {
  const repositoriesList = document.createElement('div');
  repositoriesList.setAttribute('id', 'repositories-list');
  main.appendChild(repositoriesList);
  console.log(repositories);

  repositories.forEach(({ name, description, language, stargazers_count, html_url }) => {
    repositoriesList.innerHTML += `
      <a href='${html_url}' target='_blank'>
        <div class='repository'>
          <h2 class='repository-title'>${name}</h2>
          <p class='repository-description'>${description ? description : ''}</p> 
          <div class='repository-details'>
            <p class='repository-text'>${language ? language : 'não-definida'}</p>
            <p class='repository-icon'>
              <img src='../assets/star.png'>
              ${stargazers_count}
            </p>
          </div>
        </div>
      </a>
    `;
  });
};

const renderNotFoundRepositories = (username) => main.innerHTML += `
  <div class='not-found-repositories'>
    <h2 class='not-found-subtitle'>${username} não possui nenhum repositório público ainda.</h2>
  </div>
`;

const renderUserNotFound = () => main.innerHTML = `
    <div class='not-found-box'>
      <h2 class='not-found-title'>Usuária não encontrada 😖</h2>
      <h4 class='not-found-subtitle'>Pesquise novamente</h4>
      <img class='not-found-img' src='../assets/notfound.png'>
    </div>
`;

const setupDarkMode = () => {
  const localStorageUseDarkMode = localStorage.getItem('use-dark-mode');
  if (localStorageUseDarkMode !== null) {
    darkModeCheckbox.checked = localStorageUseDarkMode === 'true';
  } else if (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    darkModeCheckbox.checked = true;
  }

  darkModeCheckbox.addEventListener('change', () => {
    localStorage.setItem('use-dark-mode', darkModeCheckbox.checked);
  });
};

setupDarkMode();