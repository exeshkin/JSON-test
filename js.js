// получаем элементы страницы
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
let keysObjByClick;

// подключаем JSON
const requestURL = 'article.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

// отрабатывает при загрузке страницы
request.onload = function () {
	const jsonObj = request.response;
	let keysObj = Object.keys(jsonObj).sort().reverse(); // получает ключи JSON и сортирует по убыванию
	start(jsonObj, keysObj);
	addRemoveActiveMenuLink(jsonObj);
}

// создаёт контент страницы
function start(jsonObj, keysObj) {
	// создает элементы меню и добавляет в хедер
	for (let i = 0; i < keysObj.length; i++) {
		let link = document.createElement('a');
		link.classList = 'link';
		link.setAttribute('data-keys-obj', `${keysObj[i]}`);
		if (i == 0) link.classList.add('_active');
		link.textContent = jsonObj[keysObj[i]].date;
		header.appendChild(link);
	}

	footer.innerHTML = header.innerHTML; // копирует хедер в футер

	document.querySelector('title').innerHTML = `${jsonObj[keysObj[0]].date} ${jsonObj[keysObj[0]].minister} - ${jsonObj[keysObj[0]].name}`; // создает и присваивает title страницы

	// создает h1 присваивает название
	let titleName = document.createElement('h1');
	titleName.textContent = jsonObj[keysObj[0]].name;

	// создает блок YouTube
	let divYT = document.createElement('div');
	divYT.classList = 'youtube';
	let iframeYT = `<iframe src="https://www.youtube.com/embed/${jsonObj[keysObj[0]].ytId}" title="YouTube video player" frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen=""></iframe>`;

	// создает блок аудио
	let audio = `<audio controls controlsList="nodownload">
						<source src="${jsonObj[keysObj[0]].urlMP3}"
						type="audio/mpeg">
					</audio>`;

	// создает кнопку
	let button = document.createElement('a');
	button.classList = 'button';
	button.setAttribute('href', `${jsonObj[keysObj[0]].urlMP3}`);
	button.setAttribute('download', `${jsonObj[keysObj[0]].date} ${jsonObj[keysObj[0]].minister} - ${jsonObj[keysObj[0]].name}`);
	button.textContent = 'Скачать *.mp3';

	// добавление элементов на страницу
	main.appendChild(titleName);
	main.appendChild(divYT);
	divYT.insertAdjacentHTML('beforeend', iframeYT);
	main.insertAdjacentHTML('beforeend', audio);
	main.appendChild(button);
}

// Клик по меню добавляет/удаляет класс _active и копирует в футер/хедер
function addRemoveActiveMenuLink(jsonObj) {
	let linkMenu = document.querySelectorAll('.header > .link, footer > .link'); // получает все ссылки из хедера и футера

	for (let menuLink of linkMenu) {
		menuLink.addEventListener("click", function (event) {
			keysObjByClick = event.target.dataset.keysObj; // присваиваеn переменной ключ JSON (достаёт из ссылки при клике)
			onClickMenu(jsonObj, keysObjByClick); // запускает обновление контента на странице
			//console.log(keysObjByClick);

			if (menuLink.closest('.header')) { // проверяет ссылку (из хедера ?)
				linkMenu = document.querySelectorAll('.header > .link'); // изменяет переменную linkMenu -> получает все ссылки из хедера

				if (!menuLink.classList.contains('_active')) { // проверяет ссылку (не имеет класс _active ?)
					// удаляет класс _active из всех ссылок в хедере
					for (i = 0; i < linkMenu.length; i++) {
						linkMenu[i].classList.remove('_active');
					}
					menuLink.classList.add('_active'); // добавляет класс _active выбранной (по клику) ссылке

					let linkMenuFooter = document.querySelectorAll('footer > .link'); // получает все ссылки из футера
					// копирует все классы ссылок из хедера в ссылки футера
					for (i = 0; i < linkMenuFooter.length; i++) {
						linkMenuFooter[i].classList = linkMenu[i].classList;
					}
				}
			} else if (menuLink.closest('.footer')) { // проверяет ссылку (из футера ?)
				linkMenu = document.querySelectorAll('.footer > .link'); // изменяет переменную linkMenu -> получает все ссылки из футера

				if (!menuLink.classList.contains('_active')) { // проверяет ссылку (не имеет класс _active ?)
					// удаляет класс _active из всех ссылок в футере
					for (i = 0; i < linkMenu.length; i++) {
						linkMenu[i].classList.remove('_active');
					}
					menuLink.classList.add('_active'); // добавляет класс _active выбранной (по клику) ссылке 

					let linkMenuHeader = document.querySelectorAll('header > .link'); // получает все ссылки из хедера
					// копирует все классы ссылок из футера в ссылки хедера
					for (i = 0; i < linkMenuHeader.length; i++) {
						linkMenuHeader[i].classList = linkMenu[i].classList;
					}
				}
			}
		})
	}
}

function onClickMenu(jsonObj, keysObjByClick) {
	document.querySelector('title').innerHTML = `${jsonObj[keysObjByClick].date} ${jsonObj[keysObjByClick].minister} - ${jsonObj[keysObjByClick].name}`; // создает и присваивает title страницы

	document.querySelector('h1').textContent = jsonObj[keysObjByClick].name;

	document.querySelector('.youtube').innerHTML = `<iframe src="https://www.youtube.com/embed/${jsonObj[keysObjByClick].ytId}" title="YouTube video player" frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen=""></iframe>`;

	document.querySelector('audio').remove();

	document.querySelector('.button').insertAdjacentHTML('beforebegin', `<audio controls controlsList="nodownload">
					<source src="${jsonObj[keysObjByClick].urlMP3}"
					type="audio/mpeg"></audio>`);

	document.querySelector('.button').setAttribute('href', `${jsonObj[keysObjByClick].urlMP3}`);
	document.querySelector('.button').setAttribute('download', `${jsonObj[keysObjByClick].date} ${jsonObj[keysObjByClick].minister} - ${jsonObj[keysObjByClick].name}`);
}

